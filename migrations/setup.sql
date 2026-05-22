-- =============================================================
-- SitioListo — Setup completo (migrations 0001 a 0005 + admin)
--
-- USO:
--   1. Abrí Supabase Dashboard → tu proyecto → SQL Editor
--   2. Pegá TODO este archivo en una nueva query
--   3. Run
--
-- Es idempotente: podés correrlo de nuevo sin romper nada.
-- Asume que las tablas base (profiles, templates, subscriptions, sites)
-- ya existen — son las que se crearon con supabase-schema.sql original.
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 0001 — profiles.role + función is_admin() + CHECK constraints
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- subscriptions.plan_type: aceptar 'extremo' y 'test' (antes solo basic/pro/agency)
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('basic', 'pro', 'extremo', 'test'));

-- templates.plan_required: aceptar 'extremo' (antes solo basic/pro/agency)
ALTER TABLE public.templates
  DROP CONSTRAINT IF EXISTS templates_plan_required_check;
ALTER TABLE public.templates
  ADD CONSTRAINT templates_plan_required_check
  CHECK (plan_required IN ('basic', 'pro', 'extremo'));

-- ─────────────────────────────────────────────────────────────
-- 0002 — tabla processed_webhooks (idempotencia de MercadoPago)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  request_id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'mercadopago',
  preapproval_id TEXT,
  status_applied TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_preapproval
  ON public.processed_webhooks(preapproval_id);
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 0003 — trial 14d + custom_domain status + helper subscription_is_active
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.subscription_is_active(
  status TEXT,
  current_period_end TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
  SELECT
    status = 'authorized'
    OR (status = 'cancelled' AND current_period_end IS NOT NULL AND current_period_end > NOW())
    OR (trial_end_date IS NOT NULL AND trial_end_date > NOW());
$$ LANGUAGE sql STABLE;

ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS custom_domain_status TEXT
  CHECK (custom_domain_status IS NULL OR custom_domain_status IN ('pending', 'verified', 'failed'));

-- ─────────────────────────────────────────────────────────────
-- 0004 — tabla pages + RLS + backfill desde sites.config
-- ─────────────────────────────────────────────────────────────
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
  CONSTRAINT pages_site_slug_unique UNIQUE (site_id, slug),
  CONSTRAINT pages_slug_format CHECK (
    slug = '' OR slug ~ '^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS pages_one_home_per_site
  ON public.pages(site_id) WHERE is_home = true;
CREATE INDEX IF NOT EXISTS idx_pages_site_id ON public.pages(site_id);
CREATE INDEX IF NOT EXISTS idx_pages_site_slug ON public.pages(site_id, slug);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own site pages" ON public.pages;
CREATE POLICY "Users can view own site pages" ON public.pages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own site pages" ON public.pages;
CREATE POLICY "Users can insert own site pages" ON public.pages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own site pages" ON public.pages;
CREATE POLICY "Users can update own site pages" ON public.pages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own site pages" ON public.pages;
CREATE POLICY "Users can delete own site pages" ON public.pages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can view published pages of active sites" ON public.pages;
CREATE POLICY "Anyone can view published pages of active sites" ON public.pages
  FOR SELECT USING (
    is_published = true
    AND EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.is_active = true)
  );

-- Backfill: una fila home por cada sitio existente, copiando sites.config.
-- NOTA: si la columna sites.config ya fue dropeada (0005 corrió antes),
-- este INSERT se salta sin error porque el WHERE excluye sitios que ya
-- tienen home.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sites' AND column_name = 'config'
  ) THEN
    EXECUTE $sql$
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
      )
    $sql$;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 0005 — drop sites.config (movido a pages.content)
-- ─────────────────────────────────────────────────────────────
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
    RAISE EXCEPTION 'Hay % sitios sin home en pages — algo salió mal en 0004', sites_without_home;
  END IF;
END $$;

ALTER TABLE public.sites DROP COLUMN IF EXISTS config;

-- ─────────────────────────────────────────────────────────────
-- ADMIN — asignar rol admin a v0id.ass3mbl3r@gmail.com
-- ─────────────────────────────────────────────────────────────
UPDATE public.profiles SET role = 'admin' WHERE email = 'v0id.ass3mbl3r@gmail.com';

COMMIT;

-- Validación post-ejecución (ejecutar aparte si querés verificar):
--   SELECT id, email, role FROM public.profiles WHERE email = 'v0id.ass3mbl3r@gmail.com';
--   SELECT COUNT(*) AS total_sites, COUNT(*) FILTER (WHERE is_home) AS homes FROM public.pages;
--   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
