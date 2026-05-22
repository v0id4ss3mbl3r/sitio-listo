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

## CI con GitHub Actions

**Qué es.** Un workflow YAML en `.github/workflows/ci.yml` que GitHub corre automáticamente cada vez que hacés push o PR. Ejecuta `npm install`, `npx tsc --noEmit`, `npm run lint`, `npm test`. Si algo falla, el PR queda bloqueado.

**Por qué importa incluso con VPS.**
- Si deployás con `git pull` en el server, el CI te avisa que el push está roto antes de pullear.
- Si en algún momento sumás colaboradores, evita que mergeen código que rompe tests.
- Cero costo: 2000 min/mes gratis en repos privados; vas a usar ~30 min/mes.

**Cuándo hacerlo.** Cualquier momento. Es un solo archivo de 30 líneas y queda funcionando.

---

## Refactor del admin para no usar service_role

Relacionado con RLS arriba. Hoy [src/app/api/admin/*](src/app/api/admin) y [src/app/panel/(dashboard)/admin/*](src/app/panel/(dashboard)/admin) importan `createAdminClient()` que usa `SUPABASE_SERVICE_ROLE_KEY` (bypass total). Una vez creadas las policies del paso "RLS para el panel admin", hay que refactorear esos archivos para usar el cliente normal.

Lista exacta de archivos a refactorear:
- `src/app/api/admin/sitios/[id]/route.ts`
- `src/app/api/admin/plantillas/[id]/route.ts`
- `src/app/panel/(dashboard)/admin/page.tsx`
- `src/app/panel/(dashboard)/admin/usuarios/page.tsx`
- `src/app/panel/(dashboard)/admin/sitios/page.tsx`
- `src/app/panel/(dashboard)/admin/suscripciones/page.tsx`
- `src/app/panel/(dashboard)/admin/plantillas/page.tsx`

---

## Hallazgos del análisis original todavía pendientes

(Estos vienen del informe en `~/.claude/plans/podr-as-darle-un-an-lisis-recursive-ripple.md`, anexos A1–A7.)

- **A1 "Pro (SIN SUSCRIPCIÓN)"**: el bug donde [cuenta/page.tsx](src/app/panel/(dashboard)/cuenta/page.tsx) muestra suscripciones pending como activas. Fix: agregar `.eq('status', 'authorized')` a la query.
- **A4 Plantillas reorganizadas por tier**: ADMIN-PANEL-GUIDE define un catálogo más amplio (5 Premium + 5 Exclusivas) y propone mover `tienda-express` a tier basic. Hoy hay solo 5 plantillas y `tienda-express` está como pro.
- **Verificación DNS automática del custom_domain**: hoy el badge "pending/verified/failed" se actualiza solo manualmente. Falta un endpoint que haga `dns.resolveCname()` y compare contra el target real.
