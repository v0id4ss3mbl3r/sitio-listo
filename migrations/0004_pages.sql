-- =============================================================
-- Migration 0004: tabla pages (secciones de un sitio)
--
-- Modelo: cada sitio tiene N páginas. Una de ellas es la home
-- (is_home=true), enforced con unique partial index. El home renderiza
-- con la plantilla del sitio; las páginas adicionales usan un layout
-- genérico que respeta branding.
--
-- Esta migration también hace backfill: por cada sitio existente
-- se crea su fila home con el sites.config actual.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  is_home BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Slug único dentro de cada sitio.
  CONSTRAINT pages_site_slug_unique UNIQUE (site_id, slug),
  -- Slug con formato URL-safe (igual a la regla de subdominios).
  CONSTRAINT pages_slug_format CHECK (
    slug = '' OR slug ~ '^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'
  )
);

-- Solo una página por sitio puede ser home.
CREATE UNIQUE INDEX IF NOT EXISTS pages_one_home_per_site
  ON public.pages(site_id)
  WHERE is_home = true;

CREATE INDEX IF NOT EXISTS idx_pages_site_id ON public.pages(site_id);
CREATE INDEX IF NOT EXISTS idx_pages_site_slug ON public.pages(site_id, slug);

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Dueño del sitio ve sus páginas.
CREATE POLICY "Users can view own site pages" ON public.pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = pages.site_id
        AND sites.user_id = auth.uid()
    )
  );

-- Dueño puede crear/editar/borrar páginas de su sitio.
CREATE POLICY "Users can insert own site pages" ON public.pages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = pages.site_id
        AND sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own site pages" ON public.pages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = pages.site_id
        AND sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own site pages" ON public.pages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = pages.site_id
        AND sites.user_id = auth.uid()
    )
  );

-- Páginas publicadas de sitios activos son visibles públicamente
-- (necesario para que el renderer del tenant las pueda leer sin sesión).
CREATE POLICY "Anyone can view published pages of active sites" ON public.pages
  FOR SELECT USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = pages.site_id
        AND sites.is_active = true
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Backfill: una fila home por cada sitio existente
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.pages (site_id, slug, title, content, is_home, sort_order, is_published)
SELECT
  s.id,
  '',
  COALESCE(s.config ->> 'name', 'Inicio'),
  COALESCE(s.config, '{}'::jsonb),
  true,
  0,
  s.is_active
FROM public.sites s
WHERE NOT EXISTS (
  SELECT 1 FROM public.pages p
  WHERE p.site_id = s.id AND p.is_home = true
);
