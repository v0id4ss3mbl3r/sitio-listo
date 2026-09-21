-- =============================================================
-- Migration 0025: ampliar el CHECK de templates.category
--
-- BUG: `supabase-schema.sql` creó la tabla con
--   CHECK (category IN ('restaurant','portfolio','ecommerce','landing','services'))
-- y NINGUNA migración posterior lo amplió, pero los seeds 0015, 0017 y
-- 0019–0023 insertan categorías nuevas (gastronomia, salud, belleza, …).
--
-- Resultado: esos seeds fallaban con
--   ERROR 23514: new row for relation "templates" violates check constraint
--   "templates_category_check"
-- y las 24 plantillas nuevas nunca llegaron a la base, aunque el código de
-- la app las tenía listas.
--
-- La lista de abajo son los 20 slugs de TEMPLATE_CATEGORIES en
-- src/lib/constants.ts. Si agregás una categoría allá, hay que agregarla acá.
--
-- ⚠ ORDEN: esta migración tiene que correr ANTES que los seeds 0015, 0017 y
-- 0019–0023. No depende de ninguna otra, así que puede ir primero de todo.
-- =============================================================

BEGIN;

ALTER TABLE public.templates
  DROP CONSTRAINT IF EXISTS templates_category_check;

ALTER TABLE public.templates
  ADD CONSTRAINT templates_category_check
  CHECK (category IN (
    -- Originales
    'restaurant', 'portfolio', 'ecommerce', 'landing', 'services',
    -- Sumadas con las plantillas nuevas
    'fotografia', 'belleza', 'fitness', 'comercio', 'gastronomia',
    'salud', 'profesional', 'automotor', 'tecnologia', 'educacion',
    'inmobiliaria', 'hoteleria', 'turismo', 'eventos', 'ong'
  ));

COMMIT;
