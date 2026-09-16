# TODO — Pendientes pos-Sprint 1.5

Cosas que quedaron documentadas pero sin implementar. Cuando arranques alguna, decímelo y la hacemos.

---

## Observabilidad (Sentry)

**Qué es.** Servicio externo (gratis hasta 5K eventos/mes en tu volumen alcanza de sobra) que captura todos los errores de la app — los de tu API, los del navegador del usuario, los de Server Components. Cada uno aparece en un dashboard con:
- Stack trace completo (línea exacta donde rompió).
- Qué usuario lo gatilló (email, plan).
- Qué request lo causó (URL, headers, body).
- Frecuencia y tendencia ("este error empezó hace 2h, ya afectó a 14 usuarios").
- Alerta por email/Slack cuando aparece un error nuevo.

**Por qué importa.** Hoy no te enterás de nada. Si un usuario hace checkout a las 3am y MercadoPago devuelve un error nuevo, el checkout falla silenciosamente; vos lo descubrís días después cuando se queja.

**Estado actual.** El código ya está cableado. En vez de `console.error` uso `captureError(err, context)` (definido en [src/lib/logger.ts](src/lib/logger.ts)). Hoy escribe JSON al stdout, mañana le enchufás Sentry.

**Pasos para activarlo** (15 minutos):
1. Crear cuenta gratis en `sentry.io` → New Project → "Next.js".
2. Te dan un DSN (un string tipo `https://xxx@sentry.io/yyy`).
3. `npm install @sentry/nextjs`.
4. `npx @sentry/wizard@latest -i nextjs` — el wizard crea automáticamente `sentry.client.config.ts` y `sentry.server.config.ts` con el DSN. Decile que sí a todo.
5. Editar [src/lib/logger.ts:24](src/lib/logger.ts#L24): reemplazar el `console.error(JSON.stringify(...))` por `Sentry.captureException(err, { extra: context })`. Idem `captureMessage`.

---

## RLS para el panel admin

**Qué es.** Hoy el panel admin (`/admin/*`) usa la **service role key** de Supabase — la llave maestra que **bypassea TODA la seguridad** (RLS). El código antes de hacer cualquier cosa chequea "este usuario es admin", pero si en un futuro alguien olvida ese chequeo en una nueva ruta, cualquier usuario logueado podría leer/modificar todo.

**La solución segura.** Reservar la llave maestra solo para procesos sin usuario (webhook MP). En el panel admin, usar el cliente normal de Supabase + agregar policies que digan "si sos admin, podés ver/editar todo". La función `is_admin()` que ya creé hace exactamente eso.

**Estado actual.** La función `is_admin()` ya existe (migration 0001). Falta:
1. Crear las policies en Supabase: 5 líneas de SQL por tabla (profiles, sites, subscriptions, templates, pages).
2. Reemplazar `createAdminClient()` por `createClient()` en los archivos de `/api/admin/*` y `/app/panel/(dashboard)/admin/*`. Son ~6 archivos.

**Cuándo hacerlo.** Antes de salir a producción, porque es una mitigación de riesgo. No urgente porque hoy el panel admin solo lo usás vos.

---

## Refactor del admin para no usar service_role

**Estado real (verificado 2026-09-16):** las rutas de `/api/admin/*` y las páginas de
`/panel/admin/*` **ya no usan** `createAdminClient()`. Los únicos tres archivos que
todavía lo importan son de pago/escritura, donde el service-role es deliberado y está
documentado en el código:

- `src/app/api/checkout/route.ts`
- `src/app/api/checkout/cancel/route.ts`
- `src/app/api/sites/route.ts` — no hay policy de INSERT/UPDATE para el dueño (migration
  0016, evita activar un sitio sin pagar), así que la escritura tiene que ir por acá.

O sea: este ítem está esencialmente cerrado. Lo que queda es decidir si se dejan así
(recomendado) o se crean policies específicas para esos tres casos.

---

## Hallazgos del análisis original todavía pendientes

(Estos vienen del informe en `~/.claude/plans/podr-as-darle-un-an-lisis-recursive-ripple.md`, anexos A1–A7.)

- ~~**A1 "Pro (SIN SUSCRIPCIÓN)"**~~ — ya no aplica (verificado 2026-09-16). [cuenta/page.tsx](src/app/panel/(dashboard)/cuenta/page.tsx) chequea `status === 'authorized'` en los cuatro lugares donde muestra el plan.
- **A4 Plantillas reorganizadas por tier** (pendiente, y ahora más grande): el catálogo
  cerró en **30 plantillas**, pero la distribución quedó desbalanceada — 26 están en
  `plan: 'pro'` y solo 4 en `basic` (`sabor-urbano`, `portfolio-minimal`, `landing-pro`,
  `servicios-pro`). Es una decisión de producto: hay que repartirlas de nuevo antes de
  salir a producción. Los tiers viven en `TEMPLATES` en [constants.ts](src/lib/constants.ts).
- ~~**Verificación DNS automática del custom_domain**~~ — hecho. `POST /api/sites/verify-domain` resuelve CNAME y registro A, compara contra `DOMAIN_CNAME_TARGET` / `DOMAIN_APEX_IP` y actualiza el badge; el editor tiene botón "Verificar ahora". Queda confirmar que `DOMAIN_APEX_IP` coincide con lo que muestra el panel de Vercel para este proyecto.
