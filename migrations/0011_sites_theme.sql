-- =============================================================
-- Migration 0011: sites.theme_id (tema visual por sitio)
--
-- Permite que cada sitio de cliente tenga su propio tema (Oficina / Glow /
-- Vivo). NULL = usar el default de la plantilla (TEMPLATE_DEFAULT_THEME en
-- src/lib/themes.ts), que conserva el look actual de cada plantilla.
--
-- Sin CHECK a propósito: la lista de temas crece en el código y la validación
-- vive en la API con zod (igual criterio que 0010_app_settings).
--
-- Por ahora solo lo setea el admin (PATCH /api/admin/sitios/[id], protegido por
-- requireAdmin). El permiso para que el cliente lo cambie llega en una fase
-- posterior. Las policies existentes de `sites` ya cubren el acceso.
-- =============================================================

BEGIN;

ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS theme_id TEXT;

COMMENT ON COLUMN public.sites.theme_id IS
  'Tema visual del sitio (oficina/glow/vivo). NULL = default de la plantilla. Validado en la app con zod.';

COMMIT;
