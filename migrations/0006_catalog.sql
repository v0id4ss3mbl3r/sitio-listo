-- =============================================================
-- Migration 0006: catálogo de productos para template tienda-catalogo
--
-- 3 tablas nuevas con RLS por site_id:
--   - product_categories: agrupación de productos
--   - products: ítems del catálogo
--   - store_settings: 1:1 con sites, config visual del catálogo
--
-- Pre-condición: las migrations 0001-0005 ya corrieron.
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- product_categories
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT product_categories_site_slug_unique UNIQUE (site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_site_id
  ON public.product_categories(site_id);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own site categories" ON public.product_categories;
CREATE POLICY "Users can view own site categories" ON public.product_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = product_categories.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own site categories" ON public.product_categories;
CREATE POLICY "Users can manage own site categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = product_categories.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can view categories of active sites" ON public.product_categories;
CREATE POLICY "Anyone can view categories of active sites" ON public.product_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = product_categories.site_id AND sites.is_active = true)
  );

-- ─────────────────────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'),
  description TEXT CHECK (description IS NULL OR length(description) <= 5000),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(12, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  image_url TEXT,
  -- Extra image URLs en JSONB para gallery (feature de Extremo). Hasta 8.
  image_urls JSONB NOT NULL DEFAULT '[]',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT products_site_slug_unique UNIQUE (site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_products_site_id ON public.products(site_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(site_id, is_active);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own site products" ON public.products;
CREATE POLICY "Users can view own site products" ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = products.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own site products" ON public.products;
CREATE POLICY "Users can manage own site products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = products.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can view active products of active sites" ON public.products;
CREATE POLICY "Anyone can view active products of active sites" ON public.products
  FOR SELECT USING (
    is_active = true
    AND EXISTS (SELECT 1 FROM public.sites WHERE sites.id = products.site_id AND sites.is_active = true)
  );

-- ─────────────────────────────────────────────────────────────
-- store_settings (1:1 con sites, solo si el template es tienda-catalogo)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.store_settings (
  site_id UUID PRIMARY KEY REFERENCES public.sites(id) ON DELETE CASCADE,
  theme_color TEXT NOT NULL DEFAULT '#171717',
  -- whatsapp_numbers: array [{ id, label, phone }]. Hasta 3 vendedores.
  whatsapp_numbers JSONB NOT NULL DEFAULT '[]',
  -- Banner hero customizable (solo Extremo lo edita; Pro queda en defaults).
  banner_title TEXT CHECK (banner_title IS NULL OR length(banner_title) <= 120),
  banner_subtitle TEXT CHECK (banner_subtitle IS NULL OR length(banner_subtitle) <= 200),
  banner_image_url TEXT,
  -- Texto del footer / descripción de la tienda.
  store_description TEXT CHECK (store_description IS NULL OR length(store_description) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own site settings" ON public.store_settings;
CREATE POLICY "Users can view own site settings" ON public.store_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = store_settings.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own site settings" ON public.store_settings;
CREATE POLICY "Users can manage own site settings" ON public.store_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = store_settings.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can view settings of active sites" ON public.store_settings;
CREATE POLICY "Anyone can view settings of active sites" ON public.store_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = store_settings.site_id AND sites.is_active = true)
  );

COMMIT;
