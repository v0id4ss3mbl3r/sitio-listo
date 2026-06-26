-- =============================================================
-- Migration 0019: seeds del Lote 1 de plantillas nuevas
--   cafeteria       (gastronomía) — carta + galería
--   bar-cerveceria  (gastronomía) — carta + galería
--   pasteleria      (gastronomía) — productos + galería
--   barberia        (belleza)     — servicios + equipo + turnos por WhatsApp
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- Render no depende de estos seeds (usa la constante TEMPLATES); son para que
-- aparezcan en el panel admin y la policy pública de templates activas.
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Cafetería', 'cafeteria', 'Carta por secciones, galería y reservas por WhatsApp para cafés de especialidad', 'gastronomia', 'pro', 14),
  ('Bar / Cervecería', 'bar-cerveceria', 'Carta de cervezas y tragos, galería y reservas, con estética nocturna', 'gastronomia', 'pro', 15),
  ('Pastelería', 'pasteleria', 'Productos con foto y precio, encargos por WhatsApp y galería de creaciones', 'gastronomia', 'pro', 16),
  ('Barbería', 'barberia', 'Servicios con precio, equipo y reserva de turnos por WhatsApp, look masculino', 'belleza', 'pro', 17)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
