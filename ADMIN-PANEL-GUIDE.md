# SitioListo — Admin Panel & Roadmap Fases 9-11

## Qué es

El panel de administración en `/admin` permite al dueño de la plataforma visualizar métricas, gestionar usuarios, suscripciones, sitios y plantillas. Requiere autenticación + rol `admin` en dos capas: middleware + cada API route. Las páginas ya están implementadas con datos reales de Supabase.

---

## Paso 0 — SQL inicial (ejecutar una sola vez)

```sql
-- Agregar columna role a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Función helper para RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS policies: admins ven todo
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all sites" ON public.sites
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all sites" ON public.sites
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (public.is_admin());

-- Asignar admin (reemplazar con tu UUID real)
UPDATE public.profiles SET role = 'admin' 
WHERE id = 'tu-uuid-aqui';
```

---

## Rutas del admin

| URL | Archivo | Qué muestra |
|-----|---------|------------|
| `/admin` | `src/app/panel/(dashboard)/admin/page.tsx` | Overview con métricas (usuarios totales, suscripciones activas, MRR, sitios, nuevos usuarios) |
| `/admin/usuarios` | `src/app/panel/(dashboard)/admin/usuarios/page.tsx` | Lista de usuarios con plan, sitios, rol, fecha de registro |
| `/admin/suscripciones` | `src/app/panel/(dashboard)/admin/suscripciones/page.tsx` | Lista de suscripciones activas, filtrable por estado |
| `/admin/sitios` | `src/app/panel/(dashboard)/admin/sitios/page.tsx` | Lista de sitios, toggle activo/inactivo |
| `/admin/plantillas` | `src/app/panel/(dashboard)/admin/plantillas/page.tsx` | Lista de plantillas, toggle activo/inactivo, uso, sort_order |

---

## Seguridad

Cada API route y Server Component del admin verifica:
1. Usuario está autenticado (`supabase.auth.getUser()`)
2. Tiene rol `admin` en la tabla `profiles`

Si no cumple, redirige a `/` o devuelve 403. No hay acceso cruzado entre usuarios normales.

---

## Variables de entorno

Las 3 siguientes ya deben existir (se usan en otros lados también):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Checklist de verificación

- [ ] Usuario normal NO ve el link "Admin" en el sidebar
- [ ] Ir a `/admin` como usuario normal redirige a `/`
- [ ] Ir a `/admin` como admin muestra Overview con métricas
- [ ] Tabla Usuarios muestra todos con planes correctos
- [ ] Tabla Suscripciones filtra por estado
- [ ] Toggle sitio activo/inactivo funciona
- [ ] Toggle plantilla activa/inactiva funciona
- [ ] MRR en Overview coincide con suma de suscripciones authorized

---

---

# ROADMAP: Fases 9 / 10 / 11

## Fase 9 — Fixes críticos & Admin funcionando (inicio inmediato)

### 9.1 Bug: "Pro (SIN SUSCRIPCIÓN)"

**Problema:** Al hacer clic en un plan y volver sin completar pago, se muestra "Pro — Sin suscripción", que es confuso.

**Causa:** `checkout/route.ts` inserta una suscripción con `status: 'pending'`. Cuando el usuario vuelve, `cuenta/page.tsx` ve esa fila pending y muestra "Pro" + badge "Sin suscripción".

**Solución en `src/app/panel/(dashboard)/cuenta/page.tsx`:**
- Cambiar la query de subscriptions. Donde dice `.order('created_at', { ascending: false }).limit(1)`, agregar antes: `.eq('status', 'authorized')`
- Esto ignora las suscripciones pending. Si el pago se completó, el webhook habrá hecho el update a 'authorized'. Si no se completó, no hay nada que mostrar.

**Verificación:** Tras hacer clic en un plan y volver sin pagar, el "Plan Actual" no muestra nada (no el nombre del plan pending).

---

### 9.2 Admin Bypass — Sin pagar para testear

**Objetivo:** Admin accede al editor y ve todas las plantillas sin necesidad de suscripción. Esto permite testear localmente sin hacer checkout.

**Cambios en `src/app/panel/(dashboard)/editor/page.tsx`:**
1. En el `useEffect` inicial, agregar query de `profiles` para obtener `profiles.role`. Guardar en estado `isAdmin`.
2. Cambiar la línea donde se calcula `userPlan`. De:
   ```
   const userPlan = subscription?.status === 'authorized' ? subscription.plan_type : 'free'
   ```
   A:
   ```
   const userPlan = isAdmin ? 'extremo' : (subscription?.status === 'authorized' ? subscription.plan_type : 'free')
   ```
3. El banner "Necesitás un plan activo" NO debe renderizarse si `isAdmin === true`.
4. El guard en `handleSave` (que retorna si `userPlan === 'free'`) NO debe aplicarse si `isAdmin`.

**Cambios en `src/app/panel/(dashboard)/cuenta/page.tsx`:**
1. Cargar `isAdmin` de la misma forma.
2. Si `isAdmin === true`, mostrar un mensaje: "Sos administrador. Tenés acceso completo a todas las funciones sin necesidad de suscripción." O simplemente no mostrar nada (opción más limpia).

**Verificación:** Cuando logueas como admin, entras al editor directamente, sin ver el banner bloqueante. Todas las plantillas (incluyendo `tienda-express` que normalmente es pro) están disponibles.

---

### 9.3 Admin Panel — SQL ejecutado

**Acción manual para el usuario:** Ejecutar el SQL del "Paso 0" en Supabase si no lo hizo aún. Reemplazar `'tu-uuid-aqui'` con su UUID real (sacarlo de la tabla `profiles` o de Supabase Auth).

Una vez ejecutado el SQL:
- `/admin` debe mostrar 5 métricas reales (usuarios totales, suscripciones activas, MRR, sitios, usuarios nuevos últimos 30 días)
- `/admin/usuarios`, `/admin/suscripciones`, `/admin/sitios`, `/admin/plantillas` deben mostrar datos reales
- No hay código a cambiar para que funcione — es todo SQL

---

### 9.4 Actualizar Features de Planes

**Archivo:** `src/lib/constants.ts`

Reescribir los arrays `features` de cada plan para ser más específicos y claros (no genéricos):

**Básico ($29.999/mes):**
```
- 1 sitio web estático
- Subdominio incluido (tuempresa.sitiolisto.com.ar)
- Todas las plantillas básicas
- SSL gratis
- Soporte por email
- 14 días de prueba
```

**Pro ($39.999/mes):**
```
- 1 sitio web
- Dominio personalizado incluido
- Plantillas premium (todas)
- Contacto por WhatsApp integrado
- Sin branding "Creado con SitioListo"
- Soporte prioritario
- Múltiples páginas por sitio*
```

**Extremo ($79.999/mes):**
```
- Hasta 10 sitios web
- Todas las plantillas (básicas + premium + exclusivas)
- Pasarelas de pago integradas*
- Soporte 24/7 dedicado
- Acceso anticipado a nuevas funciones
- Múltiples páginas por sitio*
```

`* = próximamente (Fase 11)`

**Nota:** Corregir la inconsistencia actual donde Básico dice "Todas las plantillas". Ahora Básico tiene SOLO plantillas básicas. Premium (Pro) y Exclusivas (Extremo) son acceso restringido.

---

### 9.5 SQL para Fase 10 (preparar ahora)

Ejecutar también en Supabase (para preparar trial en Fase 10):

```sql
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;
```

---

## Fase 10 — Editor Visual & Plantillas Nuevas (semana 2)

### 10.1 Trial de 14 días (implementation)

**Requisito:** Columna `trial_end_date` en subscriptions (ejecutada en 9.5).

**En webhook (`/api/webhook`):** Al recibir `authorized` para plan básico:
- Verificar si es la PRIMERA suscripción del usuario (COUNT = 0 antes de insertar/actualizar)
- Si es primera: setear `trial_end_date = NOW() + INTERVAL '14 days'`
- Si es renovación (COUNT > 0): NO setear trial_end_date, queda null (usuario ya pagó antes)

**En editor (`src/app/panel/(dashboard)/editor/page.tsx`):** 
- Cambiar el cálculo de `userPlan` para que también acepte trial activo:
  - Calcular `isTrialActive = subscription?.trial_end_date && new Date(subscription.trial_end_date) > new Date()`
  - Nueva lógica: si `isTrialActive` O si `status === 'authorized'`, el plan es válido
- Si `isTrialActive` es true, mostrar banner informativo: "Estás en período de prueba. Te quedan [X] días. [Botón para suscribirse]"

**Verificación:** Tras hacer checkout de plan Básico y el webhook confirmar, `trial_end_date` está seteado. El editor funciona sin bloqueos. Al día 14, el trial expira (se muestra banner de expiración).

---

### 10.2 Editor Visual — Mejoras UX

**Archivo:** `src/app/panel/(dashboard)/editor/page.tsx`

**Mejora 1 — Secciones colapsables por template:**
- Cada plantilla tiene su propio conjunto de campos específicos
- Si template = 'restaurant-01' o 'restaurante-premium': mostrar sección "Restaurante" con fields como `openingHours`, `phone`, `address`, `specialties`
- Si template = 'portfolio-01': mostrar "Portfolio" con `skills`
- Agrupar en la sidebar para no mostrar 30 inputs al mismo tiempo
- Ocultar/colapsar campos irrelevantes para el template actual

**Mejora 2 — Preview en tiempo real:**
- Botón "Preview" que abre `[subdomain].sitiolisto.com.ar` (o custom domain) en nueva pestaña
- Al guardar cambios, botón pasa a "Ver cambios 🔄" por 2 segundos, luego vuelve a "Ver sitio"
- Esto sugiere al usuario que abra preview para ver los cambios

**Mejora 3 — Validación de dominio personalizado:**
- Antes de guardar un custom domain, hacer fetch a `/api/check-domain?domain=ejemplo.com`
- Si ya existe en otro sitio: mostrar error inline rojo "Dominio en uso"
- Si es válido: permitir guardar

**Mejora 4 — Estado de guardado visual:**
- Botón "Guardar" tiene 3 estados visuales:
  - Normal (gris/primario)
  - Guardando... (spinner, deshabilitado)
  - Guardado ✓ (verde, 2 segundos)
  - Vuelve a normal
- Desabilitar submit mientras está en estado "Guardando"

---

### 10.3 Nuevas Plantillas — Catálogo por tier

#### TIER BÁSICO (acceso: todos los planes)

Las 5 existentes. **Sin nuevas plantillas básicas.** Mover `tienda-express` de `plan: 'pro'` a `plan: 'basic'` en el array TEMPLATES de `src/app/panel/(dashboard)/editor/page.tsx`. Las plantillas premium nuevas son suficiente diferenciador para el plan Pro.

| Slug | Nombre | Cambio |
|------|--------|--------|
| restaurant-01 | SaborUrbano | Sin cambios |
| portfolio-01 | PortfolioMinimal | Sin cambios |
| landing-pro | LandingPro | Sin cambios |
| servicios-pro | ServiciosPro | Sin cambios |
| tienda-express | TiendaExpress | **Cambiar `plan: 'pro'` → `plan: 'basic'`** |

---

#### TIER PREMIUM (acceso: Pro, Extremo solamente)

**1. AgenciaCreativa** (`agencia-creativa`)
- Target: agencias de diseño, marketing, desarrollo web, consultoras
- Secciones: Hero dark full-screen (fondo oscuro con tagline bold), Servicios (grilla 3 cols con descripción), Portfolio/trabajos (masonry 4 items con foto + metadata), Clientes (logos en grilla, gris background), CTA "Trabajemos juntos", Footer
- Estilo: dark (#0a0a0a o similar), tipografía display grande y bold, acentos neón o vibrantes
- Campos: `tagline`, `clientLogos` (array de URLs), `workItems` (array: {titulo, categoria, thumbnail, link})
- Animación: cards suben ligeramente en hover

**2. InmobiliariaModerna** (`inmobiliaria-moderna`)
- Target: inmobiliarias, corredores de propiedades, desarrollistas
- Secciones: Hero + buscador cosmético (tipo de propiedad / operación venta/alquiler / zona), Propiedades destacadas (4 cards grandes), Servicios (venta/alquiler/tasación/inversión), Perfil del asesor (foto + nombre + WhatsApp), Footer
- Estilo: azul corporativo + blanco, profesional y de confianza
- Campos: `agentName`, `agentPhone`, `agentPhoto`, `properties` (array simplificada)
- Nota: buscador es cosmético en Fase 10 (no filtra realmente)

**3. RestaurantePremium** (`restaurante-premium`)
- Target: restaurantes de autor, parrillas, sushi, pizzerías premium
- Diferencia vs `restaurant-01` (SaborUrbano): Hero full-screen con foto de ambiente, Menú expandible por secciones (entrada/platos principales/postres), Sección de reservas con horarios disponibles, Galería de platos (6+ fotos grandes), Sección premios/menciones, Footer con todos los datos
- Estilo: oscuro elegante, tipografía serif para títulos (Playfair, Lora), fotos de alta calidad
- Campos: `ambiance` (descripción del lugar), `menuSections` (array: {nombre, items con descripción y precio}), `awards` (array de premios), `reservationNote` (ej: "Máximo 8 personas por reserva")
- Funcionalidad: "Reservar" es botón WhatsApp que manda mensaje templado con la fecha

**4. TiendaFashion** (`tienda-fashion`)
- Target: ropa, accesorios, calzado, cosmética, zapaterías
- Secciones: Hero con modelo/look temporada (foto grande), Categorías (mujer/hombre/niños/accesorios - chips o cards), Novedades (grid 6 productos con hover zoom), Banner "Envíos gratis a todo el país" o similar, Feed de Instagram (6 fotos placeholders cuadradas), Newsletter subscription, Footer
- Estilo: minimalista, blanco + negro + 1 color acento bold, tipografía thin/black weights (contraste)
- Campos: `season` (temporada actual, ej "Verano 2024"), `shippingInfo` (texto), `instagramHandle` (usuario de IG)
- Funcionalidad: newsletter form es visual sin backend (Fase 11)

**5. GymFitness** (`gym-fitness`)
- Target: gimnasios, crossfit, yoga, pilates, artes marciales, estudios de fitness
- Secciones: Hero impactante (foto de fondo oscura + overlay + claim motivacional grande), Clases/actividades (grilla con nombre, horario, nivel de dificultad), Membresías (tabla 3 columnas: básica/estándar/premium, precios y beneficios), Equipo de instructores (cards: foto, nombre, especialidad), Galería (6 fotos del espacio/clases, placeholder), CTA "Primera clase gratis", Footer
- Estilo: bold y energético, fondo oscuro (#0d0d0d) + acento vibrante (naranja, rojo o verde neón según primaryColor), tipografía sans-serif ultra-bold, mucho contraste
- Campos: `memberships` (array: {nombre, precio, beneficios array}), `classes` (array: {nombre, horario, nivel, instructor}), `trainers` (array: {nombre, especialidad, foto})
- Funcionalidad: "Primera clase gratis" y "Unirme ahora" → WhatsApp

---

#### TIER EXCLUSIVO (acceso: solo Extremo)

**1. HotelBoutique** (`hotel-boutique`)
- Target: hoteles boutique, hosterías, cabañas de lujo, posadas, albergues premium
- Secciones: Hero full-screen con video placeh. animado, Habitaciones (3-5 tipos con galería de fotos, precio/noche, amenities), Servicios (desayuno, spa, traslados, actividades), Check-in/checkout + política de cancelación, "Experiencias" (actividades en la zona), Reserva online (WhatsApp), Footer
- Estilo: lujo discreto, crema/dorado/negro, tipografía serif elegante (Georgia, Playfair), mucho whitespace, líneas finas
- Campos: `rooms` (array: {nombre, precio/noche, descripcion, amenities, fotos}), `checkInTime` (ej "15:00"), `checkOutTime` (ej "11:00"), `experiences` (array de actividades)
- Funcionalidad: galería de fotos por habitación, "Reservar ahora" → WhatsApp con precios

**2. FranquiciaMultisede** (`franquicia-multisede`)
- Target: franquicias, cadenas de locales, negocios con múltiples sucursales
- Secciones: Hero + logo/branding central, Selector de sede (dropdown o tabs), Info dinámmica por sede (dirección, horarios, teléfono, foto del local), Servicios/productos comunes a todas las sedes, Contacto central, Footer
- Estilo: corporativo moderno, logo prominente, colores consistentes por toda la marca
- Campos: `branches` (array: {nombre, direccion, horario, telefono, foto}), `centralPhone`, `services` (array global)
- Funcionalidad: al cambiar sede en el dropdown, la página actualiza dinámicamente la información de dirección, horarios, teléfono

**3. ClinicaMedica** (`clinica-medica`)
- Target: clínicas, centros de salud, consultorios compartidos, laboratorios, sanatorios
- Secciones: Hero + nombre clínica + tagline, Especialidades (grilla con ícono médico por especialidad), Equipo médico (cards: foto-placeholder, nombre, matrícula, especialidad, horarios), Obras sociales aceptadas (logos/nombres), Turnos online (botón WhatsApp que responde por especialidad), Ubicación + horarios, Footer
- Estilo: blanco, celeste/verde salud, profesional, accesible y de confianza
- Campos: `specialties` (array de nombres), `doctors` (array: {nombre, especialidad, matricula}), `insurances` (array de nombres)
- Funcionalidad: al clickear en una especialidad, el botón de turno manda WhatsApp con el mensaje "Quisiera turno en [especialidad]"

**4. EcommerceCompleto** (`ecommerce-completo`)
- Target: tiendas online completas, PYMES con catálogo amplio
- Secciones: Header con carrito visual (badge de cantidad), Banner hero rotativo (3 slides), Categorías (6+ chips/cards), Productos (grid 8-12 con precio, badge de "Oferta" o "Nuevo"), Sección "Beneficios" (3-4 items: envío gratis, pago seguro, 30 días devolución), "Productos más vendidos" (4 destacados), Newsletter subscription, Footer completo
- Estilo: e-commerce profesional muy visual, colores según branding, optimizado para conversión
- Campos: `categories` (array), `benefits` (array: {icon, text}), `products` (array: {nombre, precio, precioAnterior, badge, imagen})
- Funcionalidad: "Agregar al carrito" y "Comprar ahora" son botones cosmético en Fase 10. Checkout real viene en Fase 11.

**5. EmpresaCorporativa** (`empresa-corporativa`)
- Target: empresas medianas/grandes, consultoras, holdings, constructoras, servicios B2B
- Secciones: Hero con foto/video corporativo full-width, Misión/Visión/Valores (3 columnas), Servicios (grilla 6), Números de impacto (4 stats animados: años, clientes, proyectos, empleados), Equipo directivo (cards: foto, nombre, cargo), Clientes/Partners (logos en grilla grayscale), Noticias (3 cards con título, fecha, resumen), Oficinas/Sucursales (lista con ciudad y dirección), Contacto B2B (email + formulario cosmético), Footer completo
- Estilo: corporativo premium, azul oscuro (#1e2a4a o similar) + blanco + gris, tipografía serif para títulos (autoridad), formal y de confianza
- Campos: `stats` (array: {label, value}), `directors` (array: {nombre, cargo, foto}), `offices` (array: {ciudad, direccion}), `newsItems` (array: {titulo, fecha, resumen})
- Funcionalidad: formulario de contacto es mailto cosmético; noticias son estáticas configuradas en el editor

---

### 10.4 Implementación técnica de plantillas

Para Haiku: Cada nueva plantilla es un archivo `.tsx` en `src/app/[domain]/templates/`. 

**Pasos para cada plantilla:**
1. Copiar estructura de una plantilla existente (ej: `SaborUrbano.tsx` para plantillas básicas, `PortfolioMinimal.tsx` para las más oscuras/premium)
2. Actualizar `TemplateProps` interface con los campos específicos de esa plantilla
3. Crear estilos inline con `dangerouslySetInnerHTML` (mismo patrón que los existentes)
4. Implementar layout con max-width, padding responsivo
5. Incluir `planType?: string` en la interface y conditional footer (ocultar branding si plan es 'pro' o 'extremo')
6. Exportar default component
7. En `src/app/[domain]/page.tsx`: agregar `import` y condicional de render con los campos del content
8. En `src/app/panel/(dashboard)/editor/page.tsx`: agregar entrada en el array TEMPLATES con `plan: 'pro'` o `plan: 'extremo'` según el tier

**Implementar de a máximo 3 plantillas por sesión de Haiku** para no saturar el contexto. Orden sugerido:
- Sesión A: agencia-creativa + restaurante-premium + tienda-fashion
- Sesión B: inmobiliaria-moderna + gym-fitness
- Sesión C: hotel-boutique + franquicia-multisede
- Sesión D: clinica-medica + ecommerce-completo + empresa-corporativa

---

## Fase 11 — Features Avanzadas (opcional si llega tiempo)

### 11.1 Múltiples páginas por sitio

**Scope:** Pro (hasta 3 páginas) y Extremo (hasta 10 páginas). Básico sigue con 1 única página.

**Nueva tabla DB:** `pages` — columns: `id` (uuid), `site_id` (fk), `slug` (texto, único por site), `title` (texto), `template` (texto, nombre de template), `config` (jsonb, similar a sites.config), `order` (int), `is_home` (boolean), `created_at`, `updated_at`.

**En editor:** Agregar sidebar de páginas a la izquierda. Botón "+ Nueva página". Drag-and-drop para reordenar. Validación de slug único por site.

**Routing:** `[domain]/[slug]` para páginas no-home. Si slug = "inicio" o está `is_home: true`, la página carga en `[domain]/`.

---

### 11.2 Analytics básicos

**Scope:** Pro y Extremo solamente.

**Nueva tabla:** `analytics_events` — columns: `id`, `site_id` (fk), `path` (ruta visitada), `timestamp`, `device` (mobile/desktop).

**Tracking:** Script propio mínimo (~1 línea) que hace POST a `/api/track` en cada page load. Endpoint inserta en analytics_events.

**En panel usuario:** Tab "Analytics" en editor. Gráfica de visitas últimos 30 días (línea). Top 3 páginas más visitadas. Breakdown mobile vs desktop.

---

### 11.3 Pasarelas de pago (Extremo)

**Scope:** Solo plan Extremo. Para plantillas que tengan carrito (Ecommerce, TiendaFashion, RestaurantePremium con menú de compra).

**Integración:** MercadoPago Checkout Pro. El propietario configura su MP access token en el editor (tab "Tienda").

**Flow:** Usuario hace clic "Comprar". Se abre Checkout Pro de MP. MP devuelve a callback URL. Se registra la orden en tabla `orders` (site_id, customer_mp_id, total, status).

---

### 11.4 Límites hard de sitios por plan

- **Básico:** 1 sitio máximo
- **Pro:** 1 sitio máximo
- **Extremo:** 10 sitios máximo

**En POST `/api/sites`:** Antes de crear, hacer `SELECT COUNT(*) FROM sites WHERE user_id = $1`. Si está en el límite, devolver `403 Forbidden` con mensaje claro: "Has alcanzado el límite de sitios para tu plan."

---

### 11.5 Notificaciones por email

**Trigger:** Al cambiar estado de suscripción a 'authorized' (en webhook).

**Contenido:** Email de bienvenida HTML con: nombre del plan, fecha próximo cobro, enlace al editor, info de soporte.

**Servicio:** Resend, SendGrid, Brevo, o similar. Template HTML simple.

---

### 11.6 Dominio personalizado — Validación DNS

**Setup:** En editor, tab "Dominio". Al ingresar un dominio personalizado, mostrar instrucciones DNS específicas por registrador (Nic.ar, GoDaddy, Namecheap, Google Domains).

**Verificación:** Botón "Verificar dominio ahora". Hace POST a `/api/verify-domain?domain=ejemplo.com` que intenta resolver un DNS record específico (CNAME o TXT que el usuario debe crear). Si existe, marca como verificado. Caso contrario, error + reintentar.

**Admin panel:** En `/admin/sitios`, agregar columna "DNS" que muestra estado: Verified / Pending / Failed.

---

## Resumen: Qué entrega cada Fase

| Fase | Entregas principales |
|------|----------------------|
| **9** | Fix "Pro sin suscripción" + Admin bypass + Features descriptions actualizadas. Sin cambios visuales en plantillas. |
| **10** | Trial 14 días implementado + Editor visual mejoras (sections colapsables, preview, validación dominio, estado guardado) + 10 plantillas nuevas (2 básicas + 4 premium + 4 exclusivas). |
| **11** | Múltiples páginas + Analytics + Pasarelas de pago (Extremo) + Límites hard de sitios + Emails de bienvenida + DNS validation. |

---

## Tabla de plantillas completa (referencia)

| Slug | Nombre | Tier | `plan` en código | Target |
|------|--------|------|-----------------|--------|
| restaurant-01 | SaborUrbano | Básico | `'basic'` | Restaurantes, bares |
| portfolio-01 | PortfolioMinimal | Básico | `'basic'` | Diseñadores, fotógrafos |
| landing-pro | LandingPro | Básico | `'basic'` | Startups, consultores |
| servicios-pro | ServiciosPro | Básico | `'basic'` | Agencias, profesionales |
| tienda-express | TiendaExpress | Básico | `'basic'` ⚠️ cambiar de `'pro'` | Pequeñas tiendas |
| **agencia-creativa** | **AgenciaCreativa** | **Premium** | **`'pro'`** | **Agencias, marketing** |
| **inmobiliaria-moderna** | **InmobiliariaModerna** | **Premium** | **`'pro'`** | **Inmobiliarias** |
| **restaurante-premium** | **RestaurantePremium** | **Premium** | **`'pro'`** | **Restaurantes altos** |
| **tienda-fashion** | **TiendaFashion** | **Premium** | **`'pro'`** | **Moda, accesorios** |
| **gym-fitness** | **GymFitness** | **Premium** | **`'pro'`** | **Gym, crossfit, yoga** |
| **hotel-boutique** | **HotelBoutique** | **Exclusivo** | **`'extremo'`** | **Hoteles, hosterías** |
| **franquicia-multisede** | **FranquiciaMultisede** | **Exclusivo** | **`'extremo'`** | **Franquicias, cadenas** |
| **clinica-medica** | **ClinicaMedica** | **Exclusivo** | **`'extremo'`** | **Clínicas, centros salud** |
| **ecommerce-completo** | **EcommerceCompleto** | **Exclusivo** | **`'extremo'`** | **Tiendas online grandes** |
| **empresa-corporativa** | **EmpresaCorporativa** | **Exclusivo** | **`'extremo'`** | **Empresas grandes, B2B** |

---

## Nota final

Este roadmap está listo para que **Haiku** lo ejecute fase por fase. No incluye código real — solo especificaciones, rutas de archivos e instrucciones. Haiku sabrá qué hacer sin ambigüedades.
