-- =============================================================
-- Migration 0015: seeds de las plantillas nuevas en la tabla `templates`
--
-- La tabla `templates` alimenta el panel admin (/admin/plantillas) y la policy
-- pública "Anyone can view active templates". El editor del cliente usa la
-- constante TEMPLATES (src/lib/constants.ts), así que el render NO depende de
-- estos seeds — pero conviene tenerlos para que las nuevas aparezcan en admin.
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- Belleza se agrega cuando se construya su componente.
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Estudio de Fotografía', 'fotografia-estudio', 'Galería de trabajos y paquetes de sesión, con reserva por WhatsApp', 'fotografia', 'pro', 10),
  ('Gimnasio / Fitness', 'gimnasio-fitness', 'Planes de membresía y grilla de clases, con inscripción por WhatsApp', 'fitness', 'pro', 11),
  ('Comercio Local', 'comercio-local', 'Destacados, info y horarios para comercios de barrio, con contacto por WhatsApp', 'comercio', 'pro', 12)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
