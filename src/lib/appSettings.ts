import { unstable_cache } from 'next/cache';

import { createPublicClient } from '@/lib/supabase/public';
import { DEFAULT_THEME_ID, getTheme, type ThemeId } from '@/lib/themes';

// Tag de cache para invalidar el render que depende de app_settings (el layout
// raíz). El PATCH de /api/admin/settings llama revalidateTag(APP_SETTINGS_TAG).
export const APP_SETTINGS_TAG = 'app-settings';

/**
 * Tema global del producto (landing + panel), leído de app_settings.
 * Resiliente: si la tabla no existe todavía (migración 0010 sin correr) o
 * hay cualquier error, devuelve el tema por defecto para no romper el render.
 */
export function fetchAppThemeCached(): Promise<ThemeId> {
  return unstable_cache(
    async (): Promise<ThemeId> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('app_settings')
          .select('theme_id')
          .eq('id', 'global')
          .maybeSingle();
        // getTheme normaliza un id ausente/inválido al default.
        return getTheme(data?.theme_id).id;
      } catch {
        return DEFAULT_THEME_ID;
      }
    },
    ['app-settings-theme'],
    { tags: [APP_SETTINGS_TAG], revalidate: 60 * 60 }
  )();
}
