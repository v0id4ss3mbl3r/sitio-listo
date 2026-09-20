# TODO — Pendientes pos-Sprint 1.5

Cosas que quedaron documentadas pero sin implementar. Cuando arranques alguna, decímelo y la hacemos.

---

## Observabilidad — avisos por Telegram (hecho)

Los errores ahora avisan por Telegram, sin librerías: la Bot API es un POST con
JSON y `fetch` ya viene en el runtime.

**Para activarlo** hay que setear dos variables (en `.env.local` y en Vercel):

- `TELEGRAM_BOT_TOKEN` — lo da @BotFather con `/newbot`
- `TELEGRAM_CHAT_ID` — el chat destino; se saca de
  `https://api.telegram.org/bot<TOKEN>/getUpdates` después de escribirle al bot

Sin esas variables los avisos quedan apagados y todo sigue igual (los errores
van al log estructurado, como antes).

**Cómo está armado.** Todo pasa por `captureError()` en
[src/lib/logger.ts](src/lib/logger.ts), que era ya el embudo único:

- [src/lib/alertThrottle.ts](src/lib/alertThrottle.ts) — el freno. Agrupa por
  firma normalizada (ids, números, URLs y emails se reemplazan, así el "mismo"
  error no avisa dos veces) y aplica dos topes: no repetir una firma antes de 5
  minutos, y máximo 10 avisos por minuto en total. Lo que se traga se cuenta y
  se informa en el aviso siguiente ("+37 iguales desde el último aviso").
- [src/lib/telegram.ts](src/lib/telegram.ts) — el envío. Texto plano a propósito
  (los stack traces romperían el parseo de Markdown), con timeout, y no tira
  nunca: un problema al avisar no puede tumbar el request.
- El envío va dentro de `after()` de Next, así que sale **después** de
  responderle al usuario y no le suma latencia.

**Límite conocido.** El estado del freno vive en memoria del proceso. En Vercel
cada instancia tiene el suyo, así que el conteo es por instancia. Mata el caso
que importa (la misma instancia recibiendo el mismo error en loop), pero no
deduplica entre instancias.

**Si alguna vez hace falta más** (historial buscable, agrupación entre
instancias, tendencias), Sentry se enchufa en el mismo `captureError` y puede
convivir con los avisos de Telegram.

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
- ~~**A4 Plantillas reorganizadas por tier**~~ — hecho. Las 30 quedaron repartidas
  en tres tiers acumulativos: Basic 8 (landings de una sección), Pro 25 (+17 rubros
  con contenido administrable), Extremo 30 (+5 de negocio grande y la tienda
  completa). `canUseTemplate` usa `TEMPLATE_TIER_ACCESS` como fuente única y el
  editor dejó de duplicar la regla. El copy de los tres planes se corrigió y hay
  tests que lo atan al reparto real.
  **Pendiente asociado:** el copy de Extremo dice "hasta 50 plantillas" y hoy
  existen 30 — hay que llegar a 50 o bajar el número.
- ~~**Verificación DNS automática del custom_domain**~~ — hecho. `POST /api/sites/verify-domain` resuelve CNAME y registro A, compara contra `DOMAIN_CNAME_TARGET` / `DOMAIN_APEX_IP` y actualiza el badge; el editor tiene botón "Verificar ahora". Queda confirmar que `DOMAIN_APEX_IP` coincide con lo que muestra el panel de Vercel para este proyecto.
