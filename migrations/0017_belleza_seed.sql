-- =============================================================
-- Migration 0017: seed de la plantilla Belleza & Estética
-- (slug = id en TEMPLATES y template_id en page.tsx)
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Belleza & Estética', 'belleza-estetica', 'Servicios con precio, portfolio y reserva de turnos por WhatsApp (manicura, peluquería, barbería)', 'belleza', 'pro', 13)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
