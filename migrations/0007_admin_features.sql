-- =============================================================
-- Migration 0007: admin features
--   1. profiles.blocked_until → bloqueo temporal/permanente
--   2. sites.is_banned → baneo administrativo (diferente de is_active)
--   3. notifications → notificaciones in-app del admin al usuario
--   4. templates: tags + min_plan + extender editable metadata
--   5. RLS: policies "Admins can do all" usando is_admin() para retirar
--      el uso de service_role del panel admin (mitiga riesgo del hallazgo
--      #9 del análisis original).
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. profiles.blocked_until
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_blocked_until
  ON public.profiles(blocked_until)
  WHERE blocked_until IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. sites.is_banned
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_sites_is_banned ON public.sites(is_banned) WHERE is_banned;

-- ─────────────────────────────────────────────────────────────
-- 3. notifications (in-app, del admin al usuario)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_all
  ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications read state" ON public.notifications;
CREATE POLICY "Users can update own notifications read state" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 4. templates: tags + min_plan (extra restricciones editables)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS min_plan TEXT
  CHECK (min_plan IS NULL OR min_plan IN ('basic', 'pro', 'extremo'));

CREATE INDEX IF NOT EXISTS idx_templates_tags ON public.templates USING gin(tags);

-- ─────────────────────────────────────────────────────────────
-- 5. RLS para admin — sin service_role en el panel
--    Cada tabla recibe una policy "Admins can <ALL>" via is_admin().
--    Esto permite usar el cliente normal de Supabase desde /admin/*.
-- ─────────────────────────────────────────────────────────────

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can update all subscriptions" ON public.subscriptions
  FOR UPDATE USING (public.is_admin());

-- sites
DROP POLICY IF EXISTS "Admins can manage all sites" ON public.sites;
CREATE POLICY "Admins can manage all sites" ON public.sites
  FOR ALL USING (public.is_admin());

-- pages
DROP POLICY IF EXISTS "Admins can manage all pages" ON public.pages;
CREATE POLICY "Admins can manage all pages" ON public.pages
  FOR ALL USING (public.is_admin());

-- templates
DROP POLICY IF EXISTS "Admins can manage all templates" ON public.templates;
CREATE POLICY "Admins can manage all templates" ON public.templates
  FOR ALL USING (public.is_admin());

-- catalog tables
DROP POLICY IF EXISTS "Admins can manage all catalog products" ON public.products;
CREATE POLICY "Admins can manage all catalog products" ON public.products
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all catalog categories" ON public.product_categories;
CREATE POLICY "Admins can manage all catalog categories" ON public.product_categories
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all store settings" ON public.store_settings;
CREATE POLICY "Admins can manage all store settings" ON public.store_settings
  FOR ALL USING (public.is_admin());

COMMIT;
