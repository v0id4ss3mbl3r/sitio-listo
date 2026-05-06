# Fase 8 — Guía de Implementación: Modelo de Negocio y Planes

> **Para el modelo que ejecute esto:** Leé este archivo completo antes de escribir una línea. Cada sección tiene instrucciones exactas. Ejecutá en el orden indicado. Verificá el build después de cada parte.

---

## Resumen de cambios

| Archivo | Qué cambia |
|---|---|
| `src/lib/constants.ts` | Reestructurar planes: eliminar free, renombrar agency→extremo, actualizar precios y features, agregar personalizado |
| `src/app/panel/(dashboard)/cuenta/page.tsx` | Ocultar test, card especial para Personalizado al final |
| `src/app/panel/(dashboard)/editor/page.tsx` | Banner bloqueante si no hay plan activo, guard en handleSave, dominio propio solo Pro+ |
| `src/app/api/checkout/route.ts` | Whitelist de planes válidos para checkout |
| `src/app/[domain]/page.tsx` | Pasar `planType` a los templates |
| Todos los templates en `src/app/[domain]/templates/` | Ocultar "Creado con SitioListo" si planType es pro o extremo |
| `ADMIN-PANEL-GUIDE.md` | Reescribir completo, eliminar código redundante |

**SQL a ejecutar en Supabase** (el usuario lo corre manualmente antes del deploy):
```sql
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'basic';
```

---

## PARTE 1 — `src/lib/constants.ts`

Reemplazar el objeto PLANS completo con este:

```ts
export const PLANS = {
  test: {
    name: 'Prueba (Test)',
    slug: 'test',
    price: 100,
    priceDisplay: '$100',
    description: 'Plan de prueba para verificar MercadoPago',
    features: ['Suscripción de prueba'],
    highlighted: false,
  },
  basic: {
    name: 'Básico',
    slug: 'basic',
    price: 29999,
    priceDisplay: '$29.999',
    description: 'Todo lo que necesitás para estar online desde hoy',
    features: [
      '1 sitio web',
      'Todas las plantillas',
      'Subdominio .sitiolisto.com.ar',
      'SSL incluido',
      'Soporte por email',
      '14 días de prueba gratis',
    ],
    highlighted: false,
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    price: 39999,
    priceDisplay: '$39.999',
    description: 'Para negocios que quieren su dominio propio y más control',
    features: [
      '1 sitio web',
      'Todas las plantillas',
      'Dominio personalizado incluido',
      'Sin marca "Creado con SitioListo"',
      'SSL incluido',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  extremo: {
    name: 'Extremo',
    slug: 'extremo',
    price: 79999,
    priceDisplay: '$79.999',
    description: 'Para franquicias y grandes negocios con múltiples presencias',
    features: [
      'Hasta 10 sitios web',
      'Todas las plantillas',
      'Dominios personalizados',
      'Sin marca "Creado con SitioListo"',
      'SSL incluido',
      'Soporte dedicado 24/7',
    ],
    highlighted: false,
  },
  personalizado: {
    name: 'Personalizado',
    slug: 'personalizado',
    price: null,
    priceDisplay: 'A consultar',
    description: 'Solución a medida para tu negocio. Hablemos.',
    features: [
      'Sitios ilimitados',
      'Integraciones a medida',
      'SLA garantizado',
      'Manager dedicado',
    ],
    highlighted: false,
  },
} as const;

export type PlanType = keyof typeof PLANS;
```

Mantener sin cambios el resto del archivo (`TEMPLATE_CATEGORIES`).

---

## PARTE 2 — `src/app/panel/(dashboard)/cuenta/page.tsx`

### 2a. Cambiar el array de planes (línea ~76)

```ts
// ANTES:
const plans = Object.values(PLANS);

// DESPUÉS:
const plans = Object.values(PLANS).filter(
  (p) => p.slug !== 'test' && p.slug !== 'personalizado'
);
```

### 2b. Agregar card de Personalizado al final del grid de planes

Después del `</div>` que cierra el grid de `plans.map(...)`, agregar esta card especial:

```tsx
{/* Card Plan Personalizado */}
<div
  className="glass-card"
  style={{
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    transition: 'all 0.2s ease',
  }}
>
  <div style={{ marginBottom: '1.5rem' }}>
    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
      Personalizado
    </span>
    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
      <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>A consultar</span>
    </div>
  </div>

  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5rem', marginBottom: '2rem', flex: 1 }}>
    {PLANS.personalizado.description}
  </p>

  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
    {PLANS.personalizado.features.map((feature) => (
      <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <svg style={{ marginTop: '0.125rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {feature}
      </li>
    ))}
  </ul>

  <a
    href="mailto:contacto@sitiolisto.com.ar?subject=Plan%20Personalizado%20SitioListo"
    className="btn-outline"
    style={{
      width: '100%',
      padding: '1rem',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'block',
    }}
  >
    Contactar
  </a>
</div>
```

---

## PARTE 3 — `src/app/panel/(dashboard)/editor/page.tsx`

### 3a. Banner si no hay plan activo

La variable `userPlan` se calcula alrededor de línea 132:
```ts
const userPlan = subscription?.status === 'authorized' ? subscription.plan_type : 'free';
```

Después del bloque `if (loading) { return ... }` y ANTES del `return` principal del editor, agregar:

```tsx
if (userPlan === 'free') {
  return (
    <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '0 1rem' }}>
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Necesitás un plan activo
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
          Para crear y editar tu sitio web necesitás suscribirte a uno de nuestros planes. El plan Básico incluye 14 días de prueba gratis.
        </p>
        <a
          href="/cuenta"
          className="btn-primary"
          style={{ display: 'inline-block', padding: '0.875rem 2rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}
        >
          Ver planes →
        </a>
      </div>
    </div>
  );
}
```

### 3b. Guard en handleSave (línea ~95, inicio de la función)

Al inicio de `handleSave`, antes de `setSaving(true)`:

```ts
if (userPlan === 'free') {
  setNotification({ type: 'error', message: 'Necesitás un plan activo para publicar tu sitio.' });
  return;
}
```

### 3c. Dominio personalizado: deshabilitar para Basic y Free

En la sección del input de `customDomain` (tab Dominio), el `disabled` actual es `userPlan === 'free'`. Cambiarlo a:

```tsx
// ANTES:
disabled={userPlan === 'free'}

// DESPUÉS:
disabled={userPlan === 'free' || userPlan === 'basic'}
```

El texto de aviso también cambia:
```tsx
// ANTES:
{userPlan === 'free' && (
  <p ...>Esta función requiere un Plan PRO.</p>
)}

// DESPUÉS:
{(userPlan === 'free' || userPlan === 'basic') && (
  <p ...>El dominio personalizado está disponible en el Plan Pro o Extremo.</p>
)}
```

### 3d. isLocked de plantillas

Actualmente solo bloquea `ecommerce-01` para free. Cambiar a:

```ts
// ANTES:
const isLocked = tpl.id === 'ecommerce-01' && userPlan === 'free';

// DESPUÉS:
const isLocked =
  userPlan === 'free' ||
  (tpl.plan === 'pro' && userPlan !== 'pro' && userPlan !== 'extremo');
```

**Nota:** Los templates en el array `TEMPLATES` del editor tienen una propiedad `plan`. Verificar que `tienda-express` tiene `plan: 'pro'` para que quede bloqueada para usuarios Basic. El resto tienen `plan: 'basic'`.

---

## PARTE 4 — `src/app/api/checkout/route.ts`

Después de verificar que el user está autenticado (línea ~15), agregar:

```ts
const validPlans = ['basic', 'pro', 'extremo', 'test'];
if (!validPlans.includes(planSlug)) {
  return NextResponse.json({ error: 'Plan inválido para checkout' }, { status: 400 });
}
```

---

## PARTE 5 — Branding condicional en plantillas

### 5a. `src/app/[domain]/page.tsx`

El objeto `content` ya tiene varios campos. Agregar `planType`:

```ts
const content = {
  // ...campos existentes...
  planType: site.plan_type || 'basic',  // la nueva columna de la tabla sites
};
```

### 5b. Actualizar props de cada template

En los 5 templates (`SaborUrbano`, `PortfolioMinimal`, `LandingPro`, `ServiciosPro`, `TiendaExpress`):

**En la interfaz TemplateProps**, agregar:
```ts
planType?: string;
```

**En el footer de cada template**, reemplazar la línea:
```tsx
// ANTES (varía por template pero siempre tiene algo similar):
<p>© {new Date().getFullYear()} — SitioListo</p>
// o
<p>© {new Date().getFullYear()} {siteName} — Creado con SitioListo</p>

// DESPUÉS:
<p style={{ fontSize: 9, ... }}>
  © {new Date().getFullYear()} {siteName}
  {(!planType || planType === 'basic') && ' — Creado con SitioListo'}
</p>
```

### 5c. `src/app/api/sites/route.ts` (POST)

Al crear/actualizar el sitio, guardar el plan actual del usuario en la columna `plan_type` de `sites`. Requiere hacer una query a `subscriptions` para obtener el plan activo del user y guardarlo junto con el resto del sitio.

---

## PARTE 6 — Reescribir `ADMIN-PANEL-GUIDE.md`

Reemplazar el archivo completo con una versión limpia de ~80 líneas. El código ya está en el repo — la guía solo necesita orientación, no duplicar implementación.

Estructura:

```md
# SitioListo — Admin Panel: Guía de Referencia

## Qué hace
[2-3 líneas de descripción]

## Paso 0 — SQL inicial (ejecutar una sola vez en Supabase)
[Solo el bloque ALTER TABLE + policies + UPDATE del admin. Sin código de páginas.]

## Rutas del admin
[Tabla: URL → archivo → descripción de 1 línea]

## Seguridad
[2 líneas: cada API route verifica autenticación + role admin antes de operar]

## Variables de entorno
[Las 3 vars necesarias]

## Checklist de verificación
[Los checkboxes existentes, limpios]
```

---

## Orden de ejecución

1. **SQL en Supabase** (el usuario lo ejecuta): `ALTER TABLE sites ADD COLUMN plan_type...`
2. `src/lib/constants.ts`
3. `src/app/panel/(dashboard)/cuenta/page.tsx`
4. `src/app/panel/(dashboard)/editor/page.tsx`
5. `src/app/api/checkout/route.ts`
6. `src/app/[domain]/page.tsx`
7. Todos los templates (5 archivos)
8. `src/app/api/sites/route.ts` (agregar plan_type al insert/upsert)
9. `ADMIN-PANEL-GUIDE.md`
10. `npm run build` — verificar que no hay errores TypeScript
11. Commit + deploy

---

## Mensaje de commit sugerido

```
feat: Fase 8 - Modelo de negocio, reestructuración de planes

- Planes: basic $29.999 (trial 14d), pro $39.999, extremo $79.999, personalizado (contacto)
- Editor bloqueado sin plan activo, banner con CTA a /cuenta
- Dominio personalizado solo para Pro y Extremo
- Branding "Creado con SitioListo" oculto en Pro y Extremo
- Card Personalizado con mailto en página de suscripciones
- Checkout rechaza planes no válidos (personalizado, free)
- sites.plan_type columna para controlar branding en render
- ADMIN-PANEL-GUIDE.md reescrito como guía de referencia limpia
```

---

## Lo que NO se hace en esta fase

- Trial de 14 días real (requiere lógica de expiración, cron job, MP checkout diferido → Fase 9)
- Plantillas premium exclusivas de Pro/Extremo (→ Fase 9)
- Múltiples páginas por sitio (→ Fase 9)
- Analytics (→ Fase 9)
- Límite hard de 10 sitios para Extremo (→ Fase 9)
