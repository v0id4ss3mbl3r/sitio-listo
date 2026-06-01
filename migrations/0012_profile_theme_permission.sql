-- =============================================================
-- Migration 0012: profiles.can_customize_theme
--
-- Override manual (por usuario) que habilita al cliente a elegir el tema de
-- su sitio desde el editor, además del gateo por plan (Pro/Extremo lo tienen
-- por defecto; ver canCustomizeTheme() en src/lib/constants.ts).
--
-- Lo setea el admin desde el panel. Como la policy "Users can update own
-- profile" permite al dueño actualizar su fila sin restricción de columnas,
-- agregamos un trigger que IMPIDE que un no-admin cambie este flag (evita que
-- un usuario se auto-otorgue el permiso vía el cliente Supabase).
-- =============================================================

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS can_customize_theme BOOLEAN NOT NULL DEFAULT false;

-- Revierte el cambio del flag si quien actualiza no es admin.
CREATE OR REPLACE FUNCTION public.protect_can_customize_theme()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.can_customize_theme IS DISTINCT FROM OLD.can_customize_theme
     AND NOT public.is_admin() THEN
    NEW.can_customize_theme := OLD.can_customize_theme;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_can_customize_theme ON public.profiles;
CREATE TRIGGER trg_protect_can_customize_theme
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_can_customize_theme();

COMMIT;
