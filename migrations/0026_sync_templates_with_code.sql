-- =============================================================
-- Migration 0026: alinear la tabla `templates` con src/lib/constants.ts
--
-- Tres desfases acumulados entre el código y la base, todos de la misma
-- familia: nadie comparaba constants.ts contra el SQL.
--
--   1. `landing-pro` y `servicios-pro` se llamaban `lanzamiento-pro` y
--      `servicios-plus` en supabase-schema.sql. Se renombraron en el código
--      y nunca se migró la base.
--   2. `tienda-catalogo` no tiene seed en NINGÚN archivo: la plantilla existe
--      en el código desde el catálogo (0006) pero nunca llegó a la tabla.
--   3. `plan_required` quedó viejo en cuatro filas. Los seeds 0015 y 0017 las
--      sembraron como 'pro' y el reparto de tiers las movió a 'basic'
--      (fotografia-estudio, gimnasio-fitness, comercio-local,
--      belleza-estetica), y tienda-catalogo pasó a 'extremo'.
--
-- Nada de esto afectaba a los clientes: la galería de la landing y el
-- selector del editor leen TEMPLATES de constants.ts, no esta tabla. El que
-- veía datos incompletos era el panel de admin (/admin/plantillas).
--
-- Idempotente: se puede correr las veces que haga falta.
-- =============================================================

BEGIN;

-- ── 1. Renombrar los slugs viejos si todavía existen ──
-- UPDATE en vez de INSERT para no perder el id, is_active ni sort_order de
-- esas filas (un sitio podría estar apuntando al id).
UPDATE public.templates SET slug = 'landing-pro'
 WHERE slug = 'lanzamiento-pro'
   AND NOT EXISTS (SELECT 1 FROM public.templates WHERE slug = 'landing-pro');

UPDATE public.templates SET slug = 'servicios-pro'
 WHERE slug = 'servicios-plus'
   AND NOT EXISTS (SELECT 1 FROM public.templates WHERE slug = 'servicios-pro');

-- ── 2. Insertar las que falten ──
INSERT INTO public.templates (name, slug, description, category, plan_required, sort_order)
VALUES
  ('Landing Pro', 'landing-pro', 'Landing de conversión con hero, beneficios y llamado a la acción', 'landing', 'basic', 2),
  ('Servicios Pro', 'servicios-pro', 'Presentación de servicios con precios y contacto directo', 'services', 'basic', 3),
  ('Tienda Catálogo', 'tienda-catalogo', 'Catálogo completo con categorías, destacados y múltiples imágenes', 'ecommerce', 'extremo', 5)
ON CONFLICT (slug) DO NOTHING;

-- ── 3. Sincronizar category y plan_required con constants.ts ──
-- No se tocan name ni description: pueden haberse editado desde el panel.
UPDATE public.templates AS t
   SET category = v.category,
       plan_required = v.plan_required
  FROM (VALUES
  ('sabor-urbano', 'restaurant', 'basic'),
  ('portfolio-minimal', 'portfolio', 'basic'),
  ('landing-pro', 'landing', 'basic'),
  ('servicios-pro', 'services', 'basic'),
  ('tienda-express', 'ecommerce', 'pro'),
  ('tienda-catalogo', 'ecommerce', 'extremo'),
  ('fotografia-estudio', 'fotografia', 'basic'),
  ('gimnasio-fitness', 'fitness', 'basic'),
  ('comercio-local', 'comercio', 'basic'),
  ('belleza-estetica', 'belleza', 'basic'),
  ('cafeteria', 'gastronomia', 'pro'),
  ('bar-cerveceria', 'gastronomia', 'pro'),
  ('pasteleria', 'gastronomia', 'pro'),
  ('barberia', 'belleza', 'pro'),
  ('consultorio-medico', 'salud', 'pro'),
  ('odontologia', 'salud', 'pro'),
  ('spa', 'belleza', 'pro'),
  ('veterinaria', 'salud', 'pro'),
  ('estudio-juridico', 'profesional', 'pro'),
  ('estudio-contable', 'profesional', 'pro'),
  ('arquitectura', 'profesional', 'extremo'),
  ('taller-mecanico', 'automotor', 'pro'),
  ('tecnologia-reparaciones', 'tecnologia', 'pro'),
  ('academia', 'educacion', 'pro'),
  ('inmobiliaria', 'inmobiliaria', 'extremo'),
  ('hotel-cabanas', 'hoteleria', 'extremo'),
  ('agencia-viajes', 'turismo', 'extremo'),
  ('floreria', 'comercio', 'pro'),
  ('eventos-dj', 'eventos', 'pro'),
  ('ong-fundacion', 'ong', 'pro')
  ) AS v(slug, category, plan_required)
 WHERE t.slug = v.slug
   AND (t.category IS DISTINCT FROM v.category
     OR t.plan_required IS DISTINCT FROM v.plan_required);

COMMIT;
