-- =============================================================
-- Migration 0010: app_settings (configuración global del producto)
--
-- Tabla de una sola fila (id = 'global') que guarda ajustes que aplican
-- a TODA la app de SitioListo (landing + panel), no a un sitio de cliente.
--
-- Por ahora solo: theme_id → el tema global (Oficina / Glow / Vivo) que el
-- admin elige desde /admin/apariencia. El layout raíz lo lee y aplica.
--
-- Lectura: pública (anon) — el layout la necesita incluso para visitantes
-- sin sesión en la landing. Escritura: solo admin (is_admin()).
--
-- No ponemos CHECK sobre theme_id a propósito: la lista de temas crece en
-- el código (src/lib/themes.ts) y la validación vive en la API con zod, para
-- no tener que migrar la DB cada vez que agregamos un preset.
-- =============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  theme_id TEXT NOT NULL DEFAULT 'oficina',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Singleton: solo puede existir la fila 'global'.
  CONSTRAINT app_settings_singleton CHECK (id = 'global')
);

-- Sembrar la fila única con el tema por defecto.
INSERT INTO public.app_settings (id, theme_id)
VALUES ('global', 'oficina')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read app settings" ON public.app_settings;
CREATE POLICY "Anyone can read app settings" ON public.app_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update app settings" ON public.app_settings;
CREATE POLICY "Admins can update app settings" ON public.app_settings
  FOR UPDATE USING (public.is_admin());

COMMIT;
