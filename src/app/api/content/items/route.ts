import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { PLAN_ITEM_LIMITS, PlanType } from '@/lib/constants';
import { loadContentContext } from '@/lib/content/auth';
import { captureError } from '@/lib/logger';
import { createSiteItemSchema, parseJson } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

export async function GET() {
  try {
    const result = await loadContentContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { data, error } = await supabase
      .from('site_items')
      .select('*')
      .eq('site_id', site.id)
      .order('kind', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    captureError(error, { source: 'content-items-get' });
    return NextResponse.json({ error: 'Error al listar el contenido' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const result = await loadContentContext();
    if (!result.ok) return result.response;
    const { supabase, site, kinds, planType, admin } = result.ctx;

    const parsed = await parseJson(req, createSiteItemSchema);
    if (!parsed.ok) return parsed.response;
    const input = parsed.data;

    // El kind tiene que pertenecer a la plantilla del sitio.
    if (!kinds.includes(input.kind)) {
      return NextResponse.json(
        { error: 'Ese tipo de contenido no aplica a tu plantilla' },
        { status: 400 }
      );
    }

    // Límite total de items por plan.
    if (!admin) {
      const { count } = await supabase
        .from('site_items')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id);

      const limit = PLAN_ITEM_LIMITS[planType as PlanType] ?? 0;
      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          { error: `Tu plan permite hasta ${limit === Infinity ? '∞' : limit} ítems de contenido.` },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabase
      .from('site_items')
      .insert({ site_id: site.id, ...input })
      .select()
      .single();

    if (error) throw error;

    if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
    if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');

    return NextResponse.json({ item: data });
  } catch (error) {
    captureError(error, { source: 'content-items-post' });
    return NextResponse.json({ error: 'Error al crear el contenido' }, { status: 500 });
  }
}
