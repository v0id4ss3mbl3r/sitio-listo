-- =============================================================
-- Migration 0021: seeds del Lote 3 (profesionales + automotor)
--   estudio-juridico (profesional) — áreas de práctica + equipo + FAQ
--   estudio-contable (profesional) — servicios + planes mensuales + FAQ
--   arquitectura     (profesional) — proyectos + proceso + equipo
--   taller-mecanico  (automotor)   — servicios con precio + ventajas + FAQ
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Estudio Jurídico', 'estudio-juridico', 'Áreas de práctica, equipo y FAQ con consulta confidencial por WhatsApp', 'profesional', 'pro', 22),
  ('Estudio Contable', 'estudio-contable', 'Servicios contables, planes mensuales y FAQ con presupuesto por WhatsApp', 'profesional', 'pro', 23),
  ('Arquitectura', 'arquitectura', 'Portfolio de proyectos, proceso de trabajo y estudio, estilo editorial', 'profesional', 'pro', 24),
  ('Taller Mecánico', 'taller-mecanico', 'Servicios con precio, ventajas y FAQ con presupuesto por WhatsApp', 'automotor', 'pro', 25)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
