-- =============================================================
-- Migration 0001: agregar profiles.role + corregir CHECK constraints de planes
-- Aplica esta migration en Supabase Dashboard → SQL Editor
-- sobre cualquier entorno que ya tenga el schema base.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Agregar columna role a profiles
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function para usar en futuras RLS policies (hallazgo #9 del análisis)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────
-- 2. Actualizar CHECK constraint en subscriptions.plan_type
--    Antes: ('basic', 'pro', 'agency')  ← 'extremo' y 'test' fallaban
--    Ahora: ('basic', 'pro', 'extremo', 'test')
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('basic', 'pro', 'extremo', 'test'));

-- ─────────────────────────────────────────────────────────────
-- 3. Actualizar CHECK constraint en templates.plan_required
--    Antes: ('basic', 'pro', 'agency')
--    Ahora: ('basic', 'pro', 'extremo')
--    (templates no usan 'test' — los planes test acceden a las mismas plantillas que basic)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.templates
  DROP CONSTRAINT IF EXISTS templates_plan_required_check;

ALTER TABLE public.templates
  ADD CONSTRAINT templates_plan_required_check
  CHECK (plan_required IN ('basic', 'pro', 'extremo'));

-- ─────────────────────────────────────────────────────────────
-- 4. (Manual, no incluido en SQL) Asignar admin a tu propio usuario
--    Reemplazá 'tu-email@dominio.com' por tu email real y ejecutalo
--    en una transacción aparte después de aplicar esta migration:
--
--    UPDATE public.profiles SET role = 'admin'
--    WHERE email = 'tu-email@dominio.com';
-- ─────────────────────────────────────────────────────────────
