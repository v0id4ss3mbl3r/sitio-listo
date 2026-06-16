-- =============================================================
-- Migration 0014: site_items
--
-- Tabla genérica de contenido administrable por sitio, parametrizada por
-- `kind`. Una sola tabla sirve a varias plantillas (fotografía, belleza,
-- gimnasio, comercio local) en vez de tablas bespoke por rubro:
--   gallery  → fotos de galería
--   service  → servicios con precio (meta.duration, features…)
--   plan     → planes/membresías (meta.period, features…)
--   schedule → clases/horarios (meta.day, time, instructor…)
--   feature  → destacados genéricos
--
-- RLS espeja `pages`: dueño CRUD de los items de su sitio, admin todo, y
-- lectura pública de items activos de sitios activos (para el render del tenant).
-- =============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.site_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('gallery', 'service', 'plan', 'schedule', 'feature')),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_items_site_kind
  ON public.site_items(site_id, kind, sort_order);

ALTER TABLE public.site_items ENABLE ROW LEVEL SECURITY;

-- Dueño: CRUD de los items de su sitio.
DROP POLICY IF EXISTS "Users manage own site items" ON public.site_items;
CREATE POLICY "Users manage own site items" ON public.site_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_items.site_id AND sites.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_items.site_id AND sites.user_id = auth.uid()
    )
  );

-- Admin: todo.
DROP POLICY IF EXISTS "Admins manage all site items" ON public.site_items;
CREATE POLICY "Admins manage all site items" ON public.site_items
  FOR ALL USING (public.is_admin());

-- Público: items activos de sitios activos (render del tenant vía anon).
DROP POLICY IF EXISTS "Anyone can view active site items" ON public.site_items;
CREATE POLICY "Anyone can view active site items" ON public.site_items
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_items.site_id AND sites.is_active = true
    )
  );

COMMIT;
