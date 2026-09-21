-- =============================================================
-- Migration 0027: personalización por skin (app_settings.theme_overrides)
--
-- El admin puede retocar un preset desde /admin/apariencia: color primario y
-- secundario, tipografía de títulos y de cuerpo, ancho de borde, y si el tema
-- usa halos y degradés.
--
-- Se guarda como un objeto por tema, no como columnas sueltas, porque la lista
-- de cosas ajustables va a crecer y no queremos una migración por cada una:
--
--   {
--     "kiosco":  { "primary": "coral", "borderWidth": "thin" },
--     "glow":    { "useGradients": true, "surface": "glow" }
--   }
--
-- Los valores son IDS de listas cerradas definidas en src/lib/themes.ts
-- (BRAND_COLORS, BRAND_FONTS, BORDER_WIDTHS), no hex ni nombres de fuente
-- libres. La validación vive en la API con zod: acá no ponemos CHECK porque
-- esas listas crecen en el código y no queremos migrar la base cada vez.
--
-- El preset del código NUNCA se pisa: el override se aplica encima al leer.
-- Borrar una clave devuelve ese tema a su estado original.
-- =============================================================

BEGIN;

ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS theme_overrides JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Debe ser un objeto ({}), no un array ni un escalar: el merge indexa por
-- theme_id y cualquier otra forma rompería la lectura en silencio.
ALTER TABLE public.app_settings
  DROP CONSTRAINT IF EXISTS app_settings_theme_overrides_object;

ALTER TABLE public.app_settings
  ADD CONSTRAINT app_settings_theme_overrides_object
  CHECK (jsonb_typeof(theme_overrides) = 'object');

COMMIT;
