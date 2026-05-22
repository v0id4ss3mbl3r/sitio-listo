import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { hasCatalogFeature } from '@/lib/constants';
import { loadCatalogContext } from '@/lib/catalog/auth';
import { captureError } from '@/lib/logger';
import { parseJson, updateStoreSettingsSchema } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

export async function GET() {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('site_id', site.id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ settings: data ?? null });
  } catch (error) {
    captureError(error, { source: 'catalog-settings-get' });
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
  }
}

// PUT crea o actualiza (upsert). Gateamos los campos de banner por plan.
export async function PUT(req: Request) {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site, planType } = result.ctx;

    const parsed = await parseJson(req, updateStoreSettingsSchema);
    if (!parsed.ok) return parsed.response;
    const input = parsed.data;

    const touchesBanner =
      input.banner_title !== undefined ||
      input.banner_subtitle !== undefined ||
      input.banner_image_url !== undefined;

    if (touchesBanner && !hasCatalogFeature(planType, 'banner_custom')) {
      return NextResponse.json(
        { error: 'El banner personalizado es exclusivo del plan Extremo' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('store_settings')
      .upsert(
        {
          site_id: site.id,
          ...input,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'site_id' }
      )
      .select()
      .single();

    if (error) throw error;

    if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
    if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');

    return NextResponse.json({ settings: data });
  } catch (error) {
    captureError(error, { source: 'catalog-settings-put' });
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 });
  }
}
