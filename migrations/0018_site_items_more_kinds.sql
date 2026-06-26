-- =============================================================
-- Migration 0018: nuevos kinds para site_items
--
-- Amplía el CHECK de `kind` para soportar las 20 plantillas nuevas:
--   menu        → ítems de carta (cafetería, bar, pastelería) (meta.category)
--   property    → propiedades/habitaciones (inmobiliaria, hotel)
--                 (meta.operation/location/bedrooms/area)
--   team        → integrantes del equipo (médicos, abogados, profes…)
--   testimonial → reseñas de clientes (meta.rating)
--   faq         → preguntas frecuentes (title=pregunta, description=respuesta)
--
-- El constraint inline original (mig 0014) tiene el nombre autogenerado
-- `site_items_kind_check`. Lo reemplazamos por uno nombrado y ampliado.
-- =============================================================

BEGIN;

ALTER TABLE public.site_items
  DROP CONSTRAINT IF EXISTS site_items_kind_check;

ALTER TABLE public.site_items
  ADD CONSTRAINT site_items_kind_check
  CHECK (kind IN (
    'gallery', 'service', 'plan', 'schedule', 'feature',
    'menu', 'property', 'team', 'testimonial', 'faq'
  ));

COMMIT;
