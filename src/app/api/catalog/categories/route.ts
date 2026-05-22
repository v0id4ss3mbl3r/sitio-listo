import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { PLAN_CATEGORY_LIMITS, PlanType } from '@/lib/constants';
import { loadCatalogContext } from '@/lib/catalog/auth';
import { captureError } from '@/lib/logger';
import { createCategorySchema, parseJson } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

export async function GET() {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('site_id', site.id)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ categories: data ?? [] });
  } catch (error) {
    captureError(error, { source: 'catalog-categories-get' });
    return NextResponse.json({ error: 'Error al listar categorías' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site, planType, admin } = result.ctx;

    const parsed = await parseJson(req, createCategorySchema);
    if (!parsed.ok) return parsed.response;

    if (!admin) {
      const { count } = await supabase
        .from('product_categories')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id);

      const limit = PLAN_CATEGORY_LIMITS[planType as PlanType] ?? 0;
      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Tu plan permite hasta ${limit === Infinity ? '∞' : limit} categorías.`,
          },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabase
      .from('product_categories')
      .insert({ site_id: site.id, ...parsed.data })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese slug' },
          { status: 409 }
        );
      }
      throw error;
    }

    if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
    if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');

    return NextResponse.json({ category: data });
  } catch (error) {
    captureError(error, { source: 'catalog-categories-post' });
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 });
  }
}
