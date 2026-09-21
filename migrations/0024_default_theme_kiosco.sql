-- =============================================================
-- Migration 0024: Kiosco pasa a ser el tema por defecto del producto
--
-- El tema global vive en app_settings.theme_id (migration 0010) y lo elige
-- el admin desde /admin/apariencia. La fila venía sembrada con 'oficina'.
--
-- DEFAULT_THEME_ID en src/lib/themes.ts ya apunta a 'kiosco', pero ese valor
-- solo actúa como fallback cuando la fila no existe o trae un id inválido:
-- mientras la fila diga 'oficina', la app sirve Oficina. Por eso hace falta
-- actualizarla acá.
--
-- OJO (verificado en producción): el UPDATE filtra por theme_id = 'oficina'
-- a propósito, para no pisar una elección deliberada del admin. Si la fila ya
-- decía otra cosa — 'glow', por ejemplo — esta migración NO hace nada y el
-- tema sigue como estaba. Eso no es un fallo: cambiarlo es un clic en
-- /admin/apariencia, y una migración no debería sobreescribir una decisión
-- que alguien tomó desde el panel.
--
-- Reversible: volver a poner 'oficina' (o cualquier otro preset) desde
-- /admin/apariencia, sin migración.
-- =============================================================

BEGIN;

UPDATE public.app_settings
SET theme_id = 'kiosco',
    updated_at = NOW()
WHERE id = 'global'
  AND theme_id = 'oficina';

-- Si por lo que sea la fila no existía, la creamos ya con el tema nuevo.
INSERT INTO public.app_settings (id, theme_id)
VALUES ('global', 'kiosco')
ON CONFLICT (id) DO NOTHING;

COMMIT;
