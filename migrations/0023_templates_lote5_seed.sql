-- =============================================================
-- Migration 0023: seeds del Lote 5 (turismo, comercio, eventos, ong)
--   agencia-viajes (turismo)  — paquetes + galería + testimonios
--   floreria       (comercio) — productos + ocasiones + galería
--   eventos-dj     (eventos)  — servicios + galería + testimonios
--   ong-fundacion  (ong)      — programas + equipo + cómo ayudar + FAQ
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- Cierra las 20 plantillas nuevas (seeds 0019-0023).
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Agencia de Viajes', 'agencia-viajes', 'Paquetes y destinos con precio, galería y testimonios, con consulta por WhatsApp', 'turismo', 'pro', 30),
  ('Florería', 'floreria', 'Productos con foto y precio, ocasiones y envíos por WhatsApp', 'comercio', 'pro', 31),
  ('Eventos / DJ', 'eventos-dj', 'Servicios para eventos, galería y testimonios con cotización por WhatsApp', 'eventos', 'pro', 32),
  ('ONG / Fundación', 'ong-fundacion', 'Programas, equipo y formas de ayudar (donar/voluntariado) con contacto por WhatsApp', 'ong', 'pro', 33)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
