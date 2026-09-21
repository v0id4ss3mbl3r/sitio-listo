import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdmin } from '@/lib/admin/api';
import { APP_SETTINGS_TAG } from '@/lib/appSettings';
import { captureError } from '@/lib/logger';
import { adminUpdateSettingsSchema, parseJson } from '@/lib/schemas';

// PATCH /api/admin/settings — actualiza ajustes globales del producto:
// el tema activo y/o la personalización por skin. Invalida el cache del layout
// raíz para que el cambio se vea de inmediato tras un router.refresh().
//
// Los overrides se mergean por tema, no se reemplazan en bloque: mandar
// { glow: {...} } deja intacto lo que el admin haya guardado para kiosco.
// Para devolver un tema a su preset se manda {} en su clave.
export async function PATCH(req: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const parsed = await parseJson(req, adminUpdateSettingsSchema);
    if (!parsed.ok) return parsed.response;

    const cambios: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (parsed.data.theme_id) cambios.theme_id = parsed.data.theme_id;

    if (parsed.data.theme_overrides) {
      // Leemos lo guardado para mergear por tema. Es una fila única y la ruta
      // ya pasó por requireAdmin, así que no hay carrera que valga la pena
      // resolver con un lock.
      const { data: actual } = await supabase
        .from('app_settings')
        .select('theme_overrides')
        .eq('id', 'global')
        .maybeSingle();

      const previos =
        actual?.theme_overrides && typeof actual.theme_overrides === 'object'
          ? (actual.theme_overrides as Record<string, unknown>)
          : {};

      const fusionados: Record<string, unknown> = { ...previos };
      for (const [temaId, override] of Object.entries(parsed.data.theme_overrides)) {
        // Un objeto vacío significa "volver al preset": se borra la clave en
        // vez de guardar {} y arrastrar basura.
        if (!override || Object.keys(override).length === 0) {
          delete fusionados[temaId];
        } else {
          fusionados[temaId] = { ...(previos[temaId] as object ?? {}), ...override };
        }
      }

      cambios.theme_overrides = fusionados;
    }

    const { data, error } = await supabase
      .from('app_settings')
      .update(cambios)
      .eq('id', 'global')
      .select('id, theme_id, theme_overrides, updated_at')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Ajustes no encontrados' }, { status: 404 });
    }

    revalidateTag(APP_SETTINGS_TAG, 'max');

    return NextResponse.json({ settings: data });
  } catch (error) {
    captureError(error, { source: 'admin-settings-patch' });
    return NextResponse.json({ error: 'Error al actualizar la apariencia' }, { status: 500 });
  }
}
