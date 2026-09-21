import { unstable_cache } from 'next/cache';

import { createPublicClient } from '@/lib/supabase/public';
import {
  applyThemeOverride,
  getTheme,
  DEFAULT_THEME_ID,
  type Theme,
  type ThemeId,
  type ThemeOverrides,
} from '@/lib/themes';

// Tag de cache para invalidar el render que depende de app_settings (el layout
// raíz). El PATCH de /api/admin/settings llama revalidateTag(APP_SETTINGS_TAG).
export const APP_SETTINGS_TAG = 'app-settings';

export type AppAppearance = {
  themeId: ThemeId;
  overrides: ThemeOverrides;
};

/**
 * Apariencia global del producto (landing + panel), leída de app_settings.
 *
 * Resiliente a propósito: si la tabla no existe todavía (migración 0010 sin
 * correr), si falta la columna de overrides (0027 sin correr) o hay cualquier
 * error, devuelve el default y la app renderiza igual. Un problema de
 * configuración no puede dejar la home en blanco.
 */
export function fetchAppAppearanceCached(): Promise<AppAppearance> {
  return unstable_cache(
    async (): Promise<AppAppearance> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('app_settings')
          .select('theme_id, theme_overrides')
          .eq('id', 'global')
          .maybeSingle();

        const raw = data?.theme_overrides;
        // Defensa contra una fila con forma inesperada: el CHECK de la 0027
        // solo existe si esa migración corrió.
        const overrides =
          raw && typeof raw === 'object' && !Array.isArray(raw)
            ? (raw as ThemeOverrides)
            : {};

        return { themeId: getTheme(data?.theme_id).id, overrides };
      } catch {
        return { themeId: DEFAULT_THEME_ID, overrides: {} };
      }
    },
    ['app-settings-appearance'],
    { tags: [APP_SETTINGS_TAG], revalidate: 60 * 60 }
  )();
}

/** El tema global ya resuelto: preset del código + override del admin. */
export async function fetchAppThemeResolved(): Promise<Theme> {
  const { themeId, overrides } = await fetchAppAppearanceCached();
  return applyThemeOverride(getTheme(themeId), overrides[themeId]);
}

/**
 * Solo el id del tema global.
 * @deprecated Usar `fetchAppThemeResolved()` — este no aplica la
 * personalización que el admin guardó desde /admin/apariencia.
 */
export async function fetchAppThemeCached(): Promise<ThemeId> {
  const { themeId } = await fetchAppAppearanceCached();
  return themeId;
}
