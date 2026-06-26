-- =============================================================
-- Migration 0020: seeds del Lote 2 de plantillas nuevas (salud + bienestar)
--   consultorio-medico (salud)   — especialidades + equipo + FAQ
--   odontologia        (salud)   — tratamientos + equipo + testimonios
--   spa                (belleza) — servicios con duración + paquetes + galería
--   veterinaria        (salud)   — servicios + equipo + FAQ + urgencias
--
-- slug DEBE coincidir con el id en TEMPLATES y el template_id de page.tsx.
-- =============================================================

BEGIN;

INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Consultorio Médico', 'consultorio-medico', 'Especialidades, equipo médico y preguntas frecuentes, con turnos por WhatsApp', 'salud', 'pro', 18),
  ('Odontología', 'odontologia', 'Tratamientos, opiniones de pacientes y equipo, con turnos por WhatsApp', 'salud', 'pro', 19),
  ('Spa & Bienestar', 'spa', 'Servicios con duración, paquetes y galería, con reservas por WhatsApp', 'belleza', 'pro', 20),
  ('Veterinaria', 'veterinaria', 'Servicios, equipo y FAQ con franja de urgencias y turnos por WhatsApp', 'salud', 'pro', 21)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
