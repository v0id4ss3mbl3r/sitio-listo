-- =============================================================
-- Migration 0005: drop sites.config (movido a pages.content)
--
-- Pre-condición: migration 0004 ya corrió y backfilleó la home.
-- Después de esta migration, todo el contenido del sitio vive en
-- pages.is_home.content. `sites` solo guarda metadata (subdomain,
-- custom_domain, template_id, plan_type, custom_domain_status).
-- =============================================================

-- Sanity check: confirmamos que cada sitio tiene su home antes de
-- destruir la fuente original.
DO $$
DECLARE
  sites_without_home INT;
BEGIN
  SELECT COUNT(*) INTO sites_without_home
  FROM public.sites s
  WHERE NOT EXISTS (
    SELECT 1 FROM public.pages p
    WHERE p.site_id = s.id AND p.is_home = true
  );

  IF sites_without_home > 0 THEN
    RAISE EXCEPTION 'Hay % sitios sin home en pages — corré la migration 0004 primero', sites_without_home;
  END IF;
END $$;

ALTER TABLE public.sites DROP COLUMN IF EXISTS config;
