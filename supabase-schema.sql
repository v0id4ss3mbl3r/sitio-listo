-- =============================================================
-- SitioListo — Esquema de Base de Datos
-- Ejecutar en Supabase Dashboard → SQL Editor
-- =============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLA: profiles
-- Se crea automáticamente al registrarse un usuario
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: templates
-- Plantillas disponibles en la plataforma
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'portfolio', 'ecommerce', 'landing', 'services')),
  thumbnail_url TEXT,
  preview_url TEXT,
  plan_required TEXT NOT NULL DEFAULT 'basic' CHECK (plan_required IN ('basic', 'pro', 'extremo')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: subscriptions
-- Suscripciones de MercadoPago
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mp_preapproval_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'extremo', 'test')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'paused', 'cancelled')),
  amount NUMERIC(10, 2) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: sites
-- Sitios publicados de los clientes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  custom_domain_status TEXT CHECK (custom_domain_status IS NULL OR custom_domain_status IN ('pending', 'verified', 'failed')),
  template_id TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: pages
-- Secciones/páginas dentro de un sitio. Una por sitio es is_home=true.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.pages (
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
CREATE UNIQUE INDEX pages_one_home_per_site ON public.pages(site_id) WHERE is_home = true;
CREATE INDEX idx_pages_site_id ON public.pages(site_id);
CREATE INDEX idx_pages_site_slug ON public.pages(site_id, slug);

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_sites_subdomain ON public.sites(subdomain);
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_active ON public.templates(is_active);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ─────────────────────────────────────────────────────────────
-- TABLA: processed_webhooks
-- Idempotencia de webhooks de MercadoPago (evita reprocesar reintentos)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.processed_webhooks (
  request_id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'mercadopago',
  preapproval_id TEXT,
  status_applied TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_processed_webhooks_preapproval ON public.processed_webhooks(preapproval_id);
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Helper para RLS: ¿el usuario actual es admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ¿Esta fila de subscription debería considerarse "activa"?
--   authorized → sí (caso normal)
--   cancelled con period_end futuro → sí (período de gracia post-cancelación)
--   trial con trial_end_date futuro → sí (período de prueba)
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

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Profiles: cada usuario ve/edita solo su perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Templates: públicas para lectura
CREATE POLICY "Anyone can view active templates" ON public.templates
  FOR SELECT USING (is_active = true);

-- Subscriptions: cada usuario ve solo las suyas
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Sites: dueño ve/edita, público ve las activas
CREATE POLICY "Users can view own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active sites by subdomain" ON public.sites
  FOR SELECT USING (is_active = true);

-- Pages: dueño del sitio ve/edita/borra; público ve las publicadas de sitios activos
CREATE POLICY "Users can view own site pages" ON public.pages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own site pages" ON public.pages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );
CREATE POLICY "Users can update own site pages" ON public.pages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own site pages" ON public.pages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.user_id = auth.uid())
  );
CREATE POLICY "Anyone can view published pages of active sites" ON public.pages
  FOR SELECT USING (
    is_published = true
    AND EXISTS (SELECT 1 FROM public.sites WHERE sites.id = pages.site_id AND sites.is_active = true)
  );

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: crear perfil automáticamente al registrarse
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- DATOS INICIALES: Plantillas de ejemplo
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order) VALUES
  ('Sabor Urbano', 'sabor-urbano', 'Plantilla moderna para restaurantes y bares con menú interactivo', 'restaurant', 'basic', 1),
  ('Portfolio Minimal', 'portfolio-minimal', 'Portfolio limpio y elegante para creativos y freelancers', 'portfolio', 'basic', 2),
  ('Tienda Express', 'tienda-express', 'Catálogo de productos con diseño profesional', 'ecommerce', 'pro', 3),
  ('Lanzamiento Pro', 'lanzamiento-pro', 'Landing page de alto impacto para productos y servicios', 'landing', 'basic', 4),
  ('Servicios Plus', 'servicios-plus', 'Sitio para profesionales y empresas de servicios', 'services', 'pro', 5);
