-- =============================================================
-- Migration 0009: reapuntar FKs subscriptions/sites a public.profiles
--
-- Problema: las FKs existen pero apuntan a auth.users(id) directamente.
-- PostgREST no las reconoce como relacion publica profiles<->X, asi que
-- los embeds `profiles.select('... subscriptions(...)')` devuelven
-- PGRST200 "Could not find a relationship in the schema cache".
--
-- Fix: dropear las FKs a auth.users y crearlas apuntando a profiles.
-- Es seguro porque profiles.id == auth.users.id (trigger handle_new_user
-- garantiza una fila profiles por cada auth.users). El ON DELETE CASCADE
-- sigue funcionando: si borrar un auth.users borra su profile, y borrar
-- el profile borra sus subscriptions/sites.
--
-- La migration 0008 no detecto esto porque uso 'IF NOT EXISTS' chequeando
-- el nombre de la FK; como las FKs ya existian (con otro target), no hizo
-- nada.
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- Sanity check: cada user_id en subscriptions/sites tiene profile
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  orphan_subs INT;
  orphan_sites INT;
BEGIN
  SELECT COUNT(*) INTO orphan_subs
  FROM public.subscriptions s
  WHERE s.user_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = s.user_id);

  SELECT COUNT(*) INTO orphan_sites
  FROM public.sites s
  WHERE s.user_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = s.user_id);

  IF orphan_subs > 0 THEN
    RAISE EXCEPTION
      'Hay % suscripciones cuyo user_id no tiene profile correspondiente. Hay que crearlos o limpiarlas antes.',
      orphan_subs;
  END IF;

  IF orphan_sites > 0 THEN
    RAISE EXCEPTION
      'Hay % sitios cuyo user_id no tiene profile correspondiente. Hay que crearlos o limpiarlos antes.',
      orphan_sites;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- subscriptions: drop FK actual (a auth.users) + recrear apuntando a profiles
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- sites: drop FK actual (a auth.users) + recrear apuntando a profiles
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.sites
  DROP CONSTRAINT IF EXISTS sites_user_id_fkey;

ALTER TABLE public.sites
  ADD CONSTRAINT sites_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

COMMIT;

-- Forzar refresh del schema cache de PostgREST
NOTIFY pgrst, 'reload schema';
