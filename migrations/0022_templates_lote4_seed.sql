-- =============================================================
-- Migration 0022: seeds del Lote 4
--   tecnologia-reparaciones (tecnologia)   — servicios + ventajas + FAQ
--   academia                (educacion)    — cursos + profesores + FAQ
--   inmobiliaria            (inmobiliaria) — propiedades + servicios + FAQ
--   hotel-cabanas           (hoteleria)    — habitaciones + servicios + galería
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Tecnología / Reparaciones', 'tecnologia-reparaciones', 'Servicios de reparación con precio, ventajas y FAQ con cotización por WhatsApp', 'tecnologia', 'pro', 26),
  ('Academia / Cursos', 'academia', 'Cursos con precio, profesores y FAQ con inscripción por WhatsApp', 'educacion', 'pro', 27),
  ('Inmobiliaria', 'inmobiliaria', 'Listado de propiedades con operación/ubicación, servicios y FAQ por WhatsApp', 'inmobiliaria', 'pro', 28),
  ('Hotel / Cabañas', 'hotel-cabanas', 'Habitaciones con precio por noche, servicios y galería con reservas por WhatsApp', 'hoteleria', 'pro', 29)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
