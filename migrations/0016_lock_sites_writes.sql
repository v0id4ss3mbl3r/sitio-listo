-- =============================================================
-- Migration 0016: cerrar el bypass de pago vía owner-UPDATE en sites
--
-- La policy "Users can update own sites" (FOR UPDATE USING auth.uid()=user_id)
-- permitía que un usuario hiciera, desde el cliente:
--   update sites set is_active = true, plan_type = 'extremo' where user_id = me
-- → activar su sitio / cambiarse de plan sin pagar.
--
-- Ahora TODAS las escrituras a sites pasan por el server con service-role
-- (/api/sites y /api/checkout/cancel) o por admin (requireAdmin + policy
-- "Admins can manage all sites"). El dueño solo necesita leer su sitio, así que
-- quitamos la policy de UPDATE. Quedan: SELECT propio, SELECT público de
-- activos, y ALL de admin.
-- =============================================================

BEGIN;

DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;

COMMIT;
