import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdmin } from '@/lib/admin/api';
import { APP_SETTINGS_TAG } from '@/lib/appSettings';
import { captureError } from '@/lib/logger';
import { adminUpdateSettingsSchema, parseJson } from '@/lib/schemas';

// PATCH /api/admin/settings — actualiza ajustes globales del producto
// (por ahora solo theme_id). Invalida el cache del layout raíz para que el
// nuevo tema se vea de inmediato tras un router.refresh() del cliente.
export async function PATCH(req: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const parsed = await parseJson(req, adminUpdateSettingsSchema);
    if (!parsed.ok) return parsed.response;

    const { data, error } = await supabase
      .from('app_settings')
      .update({ theme_id: parsed.data.theme_id, updated_at: new Date().toISOString() })
      .eq('id', 'global')
      .select('id, theme_id, updated_at')
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
