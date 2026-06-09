-- =============================================================
-- Migration 0013: hardening de seguridad
--
-- Cierra una escalación de privilegios: la policy "Users can update own
-- profile" es FOR UPDATE USING (auth.uid()=id) SIN restricción de columnas,
-- y profiles.role solo tiene CHECK (role IN ('user','admin')). Sin protección,
-- cualquier usuario podía hacer `UPDATE profiles SET role='admin'` desde el
-- cliente y volverse admin.
--
-- Solución: un trigger BEFORE UPDATE que revierte cambios de `role` y
-- `can_customize_theme` cuando quien actualiza NO es admin. Consolida (y
-- reemplaza) el trigger de la migración 0012 que solo cubría el theme.
--
-- (Los inserts faltantes de sites/subscriptions NO se resuelven con policies
--  de INSERT —permitirían auto-otorgarse plan—; se hacen server-side con
--  service-role en /api/sites y /api/checkout.)
-- =============================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      NEW.role := OLD.role;
    END IF;
    IF NEW.can_customize_theme IS DISTINCT FROM OLD.can_customize_theme THEN
      NEW.can_customize_theme := OLD.can_customize_theme;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Reemplaza el trigger/función de 0012 (solo cubría can_customize_theme).
DROP TRIGGER IF EXISTS trg_protect_can_customize_theme ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_can_customize_theme();

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

COMMIT;
