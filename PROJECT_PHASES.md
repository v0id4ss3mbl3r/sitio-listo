# SitioListo - Fases del Proyecto

Este documento registra el progreso cronológico del desarrollo de SitioListo, detallando las funcionalidades clave implementadas en cada fase. Sirve como referencia arquitectónica y técnica para entender la evolución del MVP.

---

## Fase 1: Setup Inicial y Base de Datos
**Objetivo:** Configurar la base tecnológica y la estructura de datos.
- **Stack Tecnológico:** Next.js 16 (App Router), React 19, TailwindCSS v4.
- **Supabase:** Creación del proyecto y conexión de variables de entorno.
- **Esquema SQL (`supabase-schema.sql`):** 
  - Creación de tablas: `profiles`, `templates`, `subscriptions`, `sites`.
  - Configuración de relaciones y Foreign Keys (`user_id` vinculado a `auth.users`).
  - Creación de Trigger automático para insertar en `profiles` cuando un usuario se registra.
  - Habilitación de Row Level Security (RLS) con políticas específicas para `INSERT`, `UPDATE` y `SELECT`.

---

## Fase 2: Autenticación y Landing Page
**Objetivo:** Captación de usuarios y sistema de login seguro.
- **Landing Page Pública:** Diseño atractivo en `/src/app/(landing)/page.tsx` con galería de plantillas, tabla de precios y llamados a la acción (CTAs).
- **Autenticación (Auth):**
  - Flujo de registro por Email/Contraseña y OAuth (Google).
  - Configuración de Callback route para manejo de sesiones (`/api/auth/callback`).
  - Redirección automática al panel (`/dashboard`) post-login.
  - Eliminación de fricción: se removió la necesidad de confirmar el email obligatoriamente para agilizar el onboarding.

---

## Fase 3: Integración de Pagos (MercadoPago)
**Objetivo:** Monetización vía suscripciones recurrentes.
- **SDK de MercadoPago:** Integración de PreApproval (suscripciones) con el Access Token de producción.
- **Checkout API (`/api/checkout`):** Generación de enlaces de pago dinámicos según el plan elegido.
- **Cancelación API (`/api/checkout/cancel`):** Función para que el usuario anule su suscripción y desactive su sitio desde el panel ("Zona de Peligro").
- **Webhooks:** Endpoint en `/api/webhooks/mercadopago` (protegido por Service Role Key) que actualiza automáticamente el estado en la base de datos a `authorized`, `paused` o `cancelled` según la respuesta de MercadoPago.

---

## Fase 4: Panel de Usuario y Multi-tenant Core
**Objetivo:** Infraestructura para servir múltiples sitios bajo un mismo sistema y panel de gestión.
- **Dashboard Privado:** Accesible bajo `app.sitiolisto.com.ar`.
- **Enrutador Edge (`middleware.ts`):**
  - Diferenciación de tráfico basada en `hostname`.
  - Si es `app.*`, reescribe a `(panel)`.
  - Si es el dominio principal, sirve la landing pública.
  - Si es cualquier otro subdominio (o dominio personalizado), reescribe a `(tenant)/[domain]`.
- **Sincronización de Sesión:** Uso de `createProxyClient` en el Edge para refrescar tokens JWT antes de reescribir la URL.

---

## Fase 5: Editor Visual y Dominios Personalizados
**Objetivo:** Permitir a los clientes construir su sitio de forma dinámica y publicarlo al instante.
- **Editor en Vivo:** UI dividida en pestañas (Apariencia, Contenido, Dominio).
- **Validación de Subdominio en Tiempo Real:** Debounce en frontend que consulta la disponibilidad del nombre (`/api/sites/check`) evitando colisiones.
- **Dominios Personalizados:** Soporte completo en la API y BD (`custom_domain`) para vincular dominios propios de los clientes mediante CNAME delegados a Vercel.
- **Renderizado Dinámico (`[domain]/page.tsx`):**
  - Consulta a Supabase usando `or(subdomain.eq.X, custom_domain.eq.X)`.
  - Verificación de suscripción activa (`is_active = true`).
  - Inyección de las configuraciones visuales (Textos, colores primarios, template_id).

---

## Fase 6: Refactorización de Plantillas Premium (Actual)
**Objetivo:** Reemplazar las plantillas básicas (placeholders) por componentes de alto nivel visual.
- **SaborUrbano:** Plantilla orientada a gastronomía. Glassmorphism, diseño oscuro y elegante.
- **PortfolioMinimal:** Plantilla orientada a creativos. Minimalista, grilla asimétrica, soft-shadows.
- **Imágenes Dinámicas:** Generación de placeholders estéticos en la carpeta `public/templates/` para enriquecer la previsualización.

---

*Desarrollado con arquitectura sólida para escalar a miles de tenants en infraestructura serverless.*
