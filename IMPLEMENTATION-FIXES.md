# SitioListo — Plan de Implementación de Correcciones Críticas

> **Para quién es este documento:** Desarrolladores junior o mid que ejecutan cambios sobre el codebase de SitioListo.  
> **Versión del plan:** 1.0  
> **Fecha:** Mayo 2025  
> **Redactado por:** Tech Lead  

---

## ⚠️ Reglas Generales — Leer antes de tocar cualquier archivo

1. **No reescribas archivos completos.** Realizá ediciones quirúrgicas y mínimas. Si un archivo funciona correctamente en las partes que no tocás, dejalo así.
2. **No cambies nombres de props, columnas de base de datos ni slugs de templates** sin actualizar TODOS los lugares donde se usan. Ante la duda, buscá con grep antes de renombrar.
3. **No toques los archivos de templates** (`SaborUrbano.tsx`, `PortfolioMinimal.tsx`, etc.) a menos que el ítem lo indique explícitamente.
4. **Cada ítem es independiente.** Podés ejecutarlos en cualquier orden, pero completá uno entero antes de empezar el siguiente. No mezcles cambios de distintos ítems en el mismo commit.
5. **Un commit por ítem.** El mensaje del commit debe referenciar el número de ítem (ej: `fix(#2): dashboard carga sitio real del usuario`).
6. **No instales dependencias nuevas** salvo que el ítem lo indique explícitamente y con exactamente el nombre del paquete.
7. **Antes de implementar cualquier ítem**, leé los archivos involucrados en su totalidad para entender el contexto existente.
8. **No hagas cambios de estilo, refactors de nombres de variables ni cleanup** que no sean parte del ítem. Eso es ruido en el diff.

---

## Índice de Ítems

| # | Título | Criticidad | Archivos afectados |
|---|--------|-----------|-------------------|
| 1 | Fix cookie domain para resolver 403 intermitentes | 🔴 Seguridad/Auth | `proxy.ts` |
| 2 | Dashboard carga el sitio real del usuario | 🔴 UX Core | `panel/(dashboard)/page.tsx` |
| 3 | Fix back_url hardcodeada en checkout de desarrollo | 🔴 Pagos | `api/checkout/route.ts` |
| 4 | Webhook valida firma HMAC de MercadoPago | 🔴 Seguridad | `api/webhooks/mercadopago/route.ts` |
| 5 | Webhook desactiva sitio cuando suscripción se cancela | 🟡 Negocio | `api/webhooks/mercadopago/route.ts` |
| 6 | Branding "Creado con SitioListo" controlado por plan | 🟡 Producto | `[domain]/page.tsx` + cada template |
| 7 | Corregir IDs de templates: fuente de verdad única | 🟡 Consistencia | `constants.ts` + `editor/page.tsx` + `[domain]/page.tsx` |
| 8 | Tipado correcto de suscripción en el editor | 🟡 Calidad | `editor/page.tsx` |
| 9 | Reemplazar `alert()` / `confirm()` nativos | 🟡 UX | `cuenta/page.tsx` |
| 10 | Agregar SEO metadata a la landing page | 🟢 Marketing | `(landing)/page.tsx` |
| 11 | Fuentes de Google en `layout.tsx`, no en templates | 🟢 Performance | `layout.tsx` + templates que importan fuentes inline |
| 12 | Crear `.env.example` | 🟢 DX | raíz del proyecto |
| 13 | Renombrar variables CSS confusas en globals.css | 🟢 Mantenibilidad | `globals.css` |

---

## Ítem 1 — Fix cookie domain para resolver 403 intermitentes

### Contexto
El error 403 intermitente que ocurre después de un deploy se debe a que cuando Supabase SSR regenera el token de sesión (refresh), las cookies se escriben sin un atributo `domain`. Esto hace que la cookie generada en `app.sitiolisto.com.ar` no sea reconocida correctamente en requests subsiguientes.

### Archivo a modificar
`src/lib/supabase/proxy.ts`

### Qué hacer
Dentro de la función `setAll(cookiesToSet)`, cuando se llama a `response.cookies.set(name, value, options)`, las `options` que llegan de Supabase no incluyen el atributo `domain`. Debés enriquecer las opciones antes de pasarlas al `response.cookies.set`.

**Instrucciones precisas:**
1. Detectá si estamos en producción mirando `process.env.VERCEL === '1'`.
2. Si estamos en producción, mergeá las `options` originales con `{ domain: '.sitiolisto.com.ar' }`. El punto al inicio es intencional — permite que la cookie funcione en todos los subdominios.
3. Si estamos en desarrollo, no modifiques las `options`.
4. No cambies nada más de este archivo.

### Cómo verificar
- Hacé login en producción.
- Esperá 5 minutos sin actividad (para que el token esté próximo al refresh).
- Recargá la página. No debería redirigir a `/login` ni dar 403.

---

## Ítem 2 — Dashboard carga el sitio real del usuario

### Contexto
`src/app/panel/(dashboard)/page.tsx` es un Server Component. Actualmente siempre muestra la tarjeta "Aún no has configurado tu sitio" sin importar si el usuario ya tiene uno configurado o no. Tampoco refleja el estado real de la suscripción.

### Archivo a modificar
`src/app/panel/(dashboard)/page.tsx`

### Qué hacer
Después de obtener `user` y `profile`, agregá dos queries adicionales a Supabase:

1. **Query de sitio:** Buscá en la tabla `sites` el registro donde `user_id = user.id`. Seleccioná: `id`, `subdomain`, `is_active`, `template_id`.

2. **Query de suscripción:** Buscá en la tabla `subscriptions` el registro más reciente donde `user_id = user.id` y `status = 'authorized'`. Seleccioná: `plan_type`, `status`.

Luego actualizá la tarjeta "Tu Sitio Web" para mostrar uno de estos tres estados según los datos obtenidos:

- **Sin sitio:** `site` es `null` → mostrar el mensaje actual con el botón "Configurar Sitio".
- **Sitio activo:** `site` existe y `site.is_active = true` → mostrar el subdominio como un link (`{subdomain}.sitiolisto.com.ar`) y un botón "Editar Sitio" que lleve a `/editor`.
- **Sitio inactivo:** `site` existe pero `site.is_active = false` → mostrar un aviso de que el sitio está pausado por suscripción vencida y un botón "Reactivar Plan" que lleve a `/cuenta`.

Para la tarjeta "Suscripción":
- Si hay suscripción activa: mostrar el nombre del plan (usar `PLANS[plan_type]?.name` importado de `@/lib/constants`) y un badge verde "Activo".
- Si no hay: mostrar el estado actual (texto de "Plan Gratuito").

### Restricciones
- No conviertas esta página en un Client Component. Hacé las queries directamente en el Server Component con el cliente de Supabase del servidor (`@/lib/supabase/server`).
- No modifiques el layout ni otros elementos de la página que no sean esas dos tarjetas.

### Cómo verificar
- Logueate con un usuario que ya tenga un sitio configurado → debería ver el subdominio y el botón "Editar Sitio".
- Logueate con un usuario nuevo → debería ver el mensaje original de "configurar sitio".

---

## Ítem 3 — Fix back_url hardcodeada en checkout de desarrollo

### Contexto
En `src/app/api/checkout/route.ts` la `back_url` que se envía a MercadoPago en modo desarrollo apunta a `https://app.sitiolisto.com.ar/cuenta` en vez de al entorno local. Esto redirige al usuario al sitio de producción después de un pago de prueba.

### Archivo a modificar
`src/app/api/checkout/route.ts`

### Qué hacer
En la línea donde se construye el objeto `body` que se envía a MercadoPago, el campo `back_url` debe cambiar así:

**Condición actual (incorrecta):**
```
back_url: process.env.NODE_ENV === 'production' 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/cuenta?status=success`
  : `https://app.sitiolisto.com.ar/cuenta?status=success`,
```

**Condición correcta:**
- Siempre usar `process.env.NEXT_PUBLIC_APP_URL` como base.
- Si `NEXT_PUBLIC_APP_URL` no está definida (fallback de seguridad), usar `https://app.sitiolisto.com.ar`.
- La lógica debe ser: `\`${process.env.NEXT_PUBLIC_APP_URL || 'https://app.sitiolisto.com.ar'}/cuenta?status=success\``

### Restricciones
- No toques nada más de este archivo.
- Asegurate de que en `.env.local` exista la variable `NEXT_PUBLIC_APP_URL=http://app.localhost:3000` para desarrollo.

---

## Ítem 4 — Webhook valida firma HMAC de MercadoPago

### Contexto
`src/app/api/webhooks/mercadopago/route.ts` actualmente acepta cualquier POST sin verificar que proviene de MercadoPago. Un actor malicioso puede marcar suscripciones como `authorized` enviando un POST falso.

### Archivo a modificar
`src/app/api/webhooks/mercadopago/route.ts`

### Variable de entorno requerida
`MP_WEBHOOK_SECRET` — el secret configurado en el panel de MercadoPago para el webhook. Debe agregarse a las variables de entorno de Vercel y al `.env.local`.

### Qué hacer
Al inicio de la función `POST`, antes de procesar cualquier dato, implementá la validación de firma:

1. Extraé los headers `x-signature` y `x-request-id` del request.
2. Si alguno de los dos falta y estamos en producción (`process.env.NODE_ENV === 'production'`), retorná un `NextResponse.json({ error: 'Unauthorized' }, { status: 401 })`.
3. El header `x-signature` tiene el formato: `ts=TIMESTAMP,v1=HASH`. Parsealo para extraer `ts` y `v1`.
4. Construí el string a firmar: `"id:{data.id};request-id:{x-request-id};ts:{ts};"` donde `data.id` es el `id` del payload del body. Para obtener `data.id` sin consumir el body, necesitarás leer el body como texto primero y luego parsearlo.
5. Calculá el HMAC-SHA256 de ese string usando `MP_WEBHOOK_SECRET` como clave.
6. Compará el resultado (en hex) con `v1`. Si no coinciden, retorná 401.
7. En desarrollo (`NODE_ENV !== 'production'`), saltear la validación para no bloquear pruebas locales.

**Nota sobre lectura del body:** Como en Next.js el body solo se puede leer una vez, guardá el texto raw en una variable, usala para verificar la firma, y luego parseala con `JSON.parse` para el resto del procesamiento. No uses `req.clone()` — el cuerpo ya fue leído.

**Módulo Node para HMAC:** Usá `import { createHmac } from 'crypto'` — ya disponible en el runtime de Next.js sin instalar nada.

### Cómo verificar
- Enviá un POST manual sin headers a la URL del webhook → debe retornar 401.
- MercadoPago seguirá enviando notificaciones correctamente si el secret está bien configurado.

---

## Ítem 5 — Webhook desactiva sitio cuando suscripción se cancela

### Contexto
Cuando una suscripción pasa a estado `cancelled`, el webhook actualiza `subscriptions.status` pero no toca `sites.is_active`. El sitio del usuario queda público indefinidamente aunque no esté pagando.

### Archivo a modificar
`src/app/api/webhooks/mercadopago/route.ts`

### Qué hacer
Dentro del bloque `if (type === 'subscription_preapproval')`, después de actualizar el estado en `subscriptions`, agregá lógica condicional:

1. Si `status === 'cancelled'` o `status === 'paused'`:
   - Hacé una segunda query a Supabase buscando en `subscriptions` el registro con `mp_preapproval_id = preapprovalId`. Seleccioná `user_id`.
   - Con ese `user_id`, actualizá `sites` poniendo `is_active = false` donde `user_id` coincida.
   
2. Si `status === 'authorized'`:
   - Con el `user_id` obtenido de la misma forma, actualizá `sites` poniendo `is_active = true` donde `user_id` coincida.
   - Esto maneja el caso de reactivación de una suscripción pausada.

**Importante:** Ya tenés el cliente `supabaseAdmin` instanciado en el archivo. Usalo para estas queries adicionales, no crees otro cliente.

### Restricciones
- No hagas una tercera llamada a la API de MercadoPago. Ya tenés `subscriptionData` con el `external_reference` que es el `user_id`. Úsalo directamente en vez de hacer una query extra a `subscriptions`.

### Cómo verificar
- Cancelá manualmente una suscripción en el panel de MercadoPago.
- El webhook debería ejecutarse y `sites.is_active` debería pasar a `false`.
- El sitio del tenant debería mostrar la página de "sitio no disponible".

---

## Ítem 6 — Branding "Creado con SitioListo" controlado por plan

### Contexto
Según el modelo de negocio, los planes Pro y Extremo no muestran el branding "Creado con SitioListo". Esto está documentado en `FASE8-IMPLEMENTATION-GUIDE.md` pero nunca fue implementado en los componentes de template. La prop `planType` ya se pasa correctamente desde `[domain]/page.tsx` pero ningún template la usa.

### Archivos a modificar
1. `src/app/[domain]/templates/SaborUrbano.tsx`
2. `src/app/[domain]/templates/PortfolioMinimal.tsx`
3. `src/app/[domain]/templates/LandingPro.tsx`
4. `src/app/[domain]/templates/ServiciosPro.tsx`
5. `src/app/[domain]/templates/TiendaExpress.tsx`

### Qué hacer para cada template

**En la interfaz de props:** Verificá que `planType?: string` existe como prop. Si no existe, agregala como opcional con valor por defecto `'basic'`.

**En el footer de cada template:** Actualmente el footer tiene el texto "Powered by SitioListo" o "Creado con SitioListo" (o no tiene nada). Implementá la siguiente lógica:

```
Mostrar el branding solo si planType !== 'pro' && planType !== 'extremo'
```

El branding debe ser visualmente discreto (texto pequeño, baja opacidad) y siempre ir al final del footer. No lo hagas prominente.

**Verificación previa:** Antes de modificar cada template, leé el footer existente para entender qué hay y cómo ajustar el condicional. No cambies el diseño del footer, solo añadí el condicional al elemento de branding.

### Restricciones
- No modifiques ninguna otra sección del template.
- No cambies la firma de props si ya existen otras props opcionales.

---

## Ítem 7 — Fuente de verdad única para IDs de templates

### Contexto
Los slugs de templates están duplicados y hay inconsistencias. El editor usa `restaurant-01` pero el renderer también acepta `sabor-urbano`. Esto genera código frágil con múltiples condiciones OR.

### Archivos a modificar
1. `src/lib/constants.ts`
2. `src/app/panel/(dashboard)/editor/page.tsx`
3. `src/app/[domain]/page.tsx`

### Qué hacer

**En `constants.ts`:** Agregá un array `TEMPLATES` (sin borrar nada existente) con la siguiente estructura para cada template:
```
{
  id: string,          // el slug definitivo, ej: 'sabor-urbano'
  name: string,        // nombre para mostrar en el editor
  type: string,        // categoría, ej: 'restaurant'
  plan: 'basic' | 'pro',  // plan mínimo requerido
  component: string,   // nombre del componente, ej: 'SaborUrbano'
}
```

Los IDs definitivos (usar estos, no los alias) son:
- `sabor-urbano` → SaborUrbano
- `portfolio-minimal` → PortfolioMinimal
- `landing-pro` → LandingPro
- `servicios-pro` → ServiciosPro
- `tienda-express` → TiendaExpress

**En `editor/page.tsx`:** Reemplazá el array `TEMPLATES` hardcodeado importando y usando el array de `constants.ts`. Asegurate de que los IDs que se guardan al hacer save sean los definitivos (ej: `sabor-urbano`, no `restaurant-01`).

**En `[domain]/page.tsx`:** Reemplazá las condiciones `if (template_id === 'sabor-urbano' || template_id === 'restaurant-01')` por condiciones únicas basadas en el ID definitivo. Eliminá los alias antiguos (`restaurant-01`, `portfolio-01`) una vez que estés seguro de que no hay registros en base de datos que los usen.

**⚠️ Precaución con datos existentes:** Antes de eliminar los alias en `[domain]/page.tsx`, verificá en Supabase si hay registros en `sites` que tengan `template_id = 'restaurant-01'` o `template_id = 'portfolio-01'`. Si los hay, mantené los alias hasta que esos registros sean migrados o tenés una estrategia de migración.

---

## Ítem 8 — Tipado correcto de suscripción en el editor

### Contexto
En `editor/page.tsx`, el estado de la suscripción está tipado como `any`, lo que permite acceder a propiedades inexistentes sin error de TypeScript.

### Archivo a modificar
`src/app/panel/(dashboard)/editor/page.tsx`

### Qué hacer

1. Definí una interface local en el mismo archivo (no en un archivo separado, para no sobrediseñar):
```
interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  amount: number;
  created_at: string;
}
```

2. Reemplazá `useState<any>(null)` por `useState<Subscription | null>(null)`.

3. Verificá que en el resto del archivo no haya accesos que rompan con el nuevo tipo. Si los hay, corregalos.

### Restricciones
- No muevas la interface a un archivo de tipos compartido. Mantenela local al archivo por ahora.
- No cambies la lógica de negocio, solo el tipado.

---

## Ítem 9 — Reemplazar `alert()` y `confirm()` nativos

### Contexto
En `cuenta/page.tsx`, la cancelación de suscripción usa `confirm()` nativo del browser y `alert()` para los resultados. Se ven fuera de lugar en una app premium.

### Archivo a modificar
`src/app/panel/(dashboard)/cuenta/page.tsx`

### Qué hacer

Implementá un modal de confirmación inline usando estado de React. No instales ninguna librería de modales.

1. Agregá un estado booleano `showCancelModal` inicializado en `false`.

2. Reemplazá el `if (!confirm(...)) return;` en `handleCancel` por: poner `showCancelModal = true` y terminar la función ahí.

3. Agregá un componente de modal renderizado condicionalmente cuando `showCancelModal === true`. El modal debe:
   - Usar un overlay oscuro (`position: fixed, inset: 0, background: rgba(0,0,0,0.6)`)
   - Tener una card centrada con el mensaje de advertencia
   - Tener dos botones: "Cancelar" (cierra el modal, `showCancelModal = false`) y "Sí, cancelar suscripción" (llama a la lógica real de cancelación)
   - Usar las variables CSS del design system (`var(--bg-card)`, `var(--text-primary)`, etc.)
   - El botón destructivo debe ser rojo, consistente con el estilo de la "Zona de Peligro" existente

4. Reemplazá los `alert()` de éxito/error por la notificación del tipo que ya existe en el editor (`notification` state con mensaje flotante). Si ese patrón no está duplicado en `cuenta/page.tsx`, podés agregar el mismo estado `notification` de forma idéntica a como está en el editor.

### Restricciones
- No instales librerías de UI.
- El modal debe ser responsive.
- No cambies la lógica de `handleCancel` más allá de lo indicado.

---

## Ítem 10 — SEO metadata en la landing page

### Contexto
El `layout.tsx` raíz ya tiene metadata base bien configurada. Pero `(landing)/page.tsx` podría sobrescribir con metadata más específica para la landing. Actualmente no exporta `generateMetadata`.

### Archivo a modificar
`src/app/(landing)/page.tsx`

### Qué hacer
Agregá un export de `metadata` estático al inicio del archivo (no `generateMetadata`, sino el export estático ya que la landing no necesita datos dinámicos):

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SitioListo — Creá tu sitio web profesional en minutos',
  description: 'Elegí entre plantillas profesionales, personalizá los colores y contenido, y publicá con tu propio subdominio. Planes desde $29.999/mes.',
  openGraph: {
    title: 'SitioListo — Tu sitio web, listo hoy',
    description: 'Plantillas para restaurantes, portfolios, tiendas y más. Publicá en minutos sin saber programar.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SitioListo',
    description: 'Creá tu sitio web profesional en minutos.',
  },
};
```

**Nota:** Si no existe `/public/og-image.png`, creá un placeholder o remové la propiedad `images` por ahora. No inventes una URL que no existe.

---

## Ítem 11 — Mover fuentes de Google fuera de templates

### Contexto
`SaborUrbano.tsx` importa fuentes de Google a través de un `<style dangerouslySetInnerHTML>` con `@import url(...)`. Esto genera un request de fuentes en cada render del componente, es lento y puede causar FOUT (flash of unstyled text).

### Archivo a modificar
`src/app/layout.tsx` + `src/app/[domain]/templates/SaborUrbano.tsx`

### Qué hacer

**En `layout.tsx`:**
Ya hay fuentes cargadas con `next/font/google` (`Geist`, `Geist_Mono`). Agregá `Inter` y `JetBrains_Mono` usando el mismo sistema:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['500', '800'],
});
```

Luego incluí estas variables en el `className` del `<html>`.

**En `SaborUrbano.tsx`:**
Remové el `@import url('https://fonts.googleapis.com/...')` del `<style dangerouslySetInnerHTML>`. Reemplazá las referencias a `'Inter', system-ui, sans-serif` por `var(--font-inter), system-ui, sans-serif` y la fuente mono por `var(--font-jetbrains), monospace`.

### Restricciones
- No cambies el diseño visual del template.
- Verificá que `Inter` y `JetBrains_Mono` son exports válidos de `next/font/google` antes de implementar.

---

## Ítem 12 — Crear `.env.example`

### Archivo a crear
`.env.example` en la raíz del proyecto (al mismo nivel que `package.json`)

### Contenido exacto

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# MercadoPago
MP_ACCESS_TOKEN=APP_USR-tu-access-token
MP_WEBHOOK_SECRET=tu-webhook-secret

# URLs
NEXT_PUBLIC_APP_URL=http://app.localhost:3000
# En producción: https://app.sitiolisto.com.ar
```

### Restricciones
- No subas valores reales. Solo placeholders descriptivos.
- No modifiques `.env.local` ni `.env`.

---

## Ítem 13 — Renombrar variables CSS confusas

### Contexto
En `globals.css`, la variable `--bg-dark` en el tema claro (`:root`) tiene el valor `#ffffff`. El nombre `bg-dark` es semánticamente incorrecto para un fondo blanco.

### Archivo a modificar
`src/app/globals.css`

### Qué hacer
Este ítem **requiere un search global antes de hacer cualquier cambio**. Ejecutá en la terminal:

```bash
grep -r "bg-dark" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Listá todos los usos. Si hay más de 20 usos, **no hagas este ítem en esta iteración** — el riesgo de romper estilos es alto. Documentá los resultados y reportalos.

Si hay menos de 20 usos: renombrá `--bg-dark` a `--bg-surface` y `--bg-dark-secondary` a `--bg-surface-secondary` en `globals.css` y en cada archivo donde aparezcan.

### Restricciones
- Hacé el search PRIMERO, antes de cambiar nada.
- Si el search devuelve más de 20 resultados, detente y no hagas nada.

---

## Notas sobre el modelo de negocio — Páginas por plan

El plan Extremo no significa "múltiples sitios por cuenta", sino **múltiples páginas dentro de un mismo sitio** (Home, Contacto, Catálogo, Blog, etc.). Esta distinción es importante para la Fase 9.

Al implementar múltiples páginas en Fase 9, la arquitectura propuesta es:
- Una tabla `pages` en Supabase con `site_id`, `slug`, `template_section`, `config`.
- El límite de páginas por plan se aplica al COUNT de registros en `pages` donde `site_id` coincide.
- El renderer en `[domain]/page.tsx` deberá leer el `pathname` para decidir qué página cargar.

**No implementar esto ahora.** Sólo tenerlo en cuenta para no diseñar estructuras que lo compliquen.

---

## Orden de ejecución recomendado

Si hay tiempo limitado, priorizar en este orden:

```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13
```

Los ítems 1-5 son bloqueantes de negocio/seguridad.  
Los ítems 6-9 mejoran la calidad del producto.  
Los ítems 10-13 son mejoras de mantenibilidad y pueden hacerse en cualquier momento.

---

*Fin del plan — v1.0*
