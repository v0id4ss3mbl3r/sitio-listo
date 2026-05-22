-- =============================================================
-- Migration 0008: agregar FKs faltantes que PostgREST necesita
--
-- Sintoma: PGRST200 "Could not find a relationship between 'profiles'
-- and 'subscriptions' in the schema cache" (y similar para sites).
--
-- Causa: las FK user_id->profiles(id) en subscriptions y sites no
-- existen en la base, aunque supabase-schema.sql las declara. Probable-
-- mente la base se creo desde un schema previo sin esas FK, o se
-- borraron manualmente en algun momento.
--
-- Esta migration las agrega con los nombres canonicos que espera el
-- codigo (subscriptions_user_id_fkey, sites_user_id_fkey).
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- Sanity check: filas huerfanas que romperian el ALTER
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
      'Hay % suscripciones con user_id apuntando a un profile inexistente. Limpialas antes de aplicar la FK.',
      orphan_subs;
  END IF;

  IF orphan_sites > 0 THEN
    RAISE EXCEPTION
      'Hay % sitios con user_id apuntando a un profile inexistente. Limpialos antes de aplicar la FK.',
      orphan_sites;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- subscriptions.user_id -> profiles.id
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_user_id_fkey'
      AND conrelid = 'public.subscriptions'::regclass
  ) THEN
    -- Si existe con otro nombre, borrarla primero
    PERFORM 1 FROM pg_constraint
    WHERE conrelid = 'public.subscriptions'::regclass
      AND contype = 'f'
      AND (SELECT array_agg(attname)
           FROM pg_attribute
           WHERE attrelid = 'public.subscriptions'::regclass
             AND attnum = ANY(conkey)) = ARRAY['user_id'];

    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- sites.user_id -> profiles.id
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sites_user_id_fkey'
      AND conrelid = 'public.sites'::regclass
  ) THEN
    ALTER TABLE public.sites
      ADD CONSTRAINT sites_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- Forzar refresh del schema cache de PostgREST
-- ─────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
