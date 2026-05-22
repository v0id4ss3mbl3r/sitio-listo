import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { PLAN_PRODUCT_LIMITS, PlanType, hasCatalogFeature } from '@/lib/constants';
import { loadCatalogContext } from '@/lib/catalog/auth';
import { captureError } from '@/lib/logger';
import { createProductSchema, parseJson } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

export async function GET() {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('site_id', site.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    captureError(error, { source: 'catalog-products-get' });
    return NextResponse.json({ error: 'Error al listar productos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site, planType, admin } = result.ctx;

    const parsed = await parseJson(req, createProductSchema);
    if (!parsed.ok) return parsed.response;
    const input = parsed.data;

    // Gate features según el plan.
    if (input.is_featured && !hasCatalogFeature(planType, 'featured_products')) {
      return NextResponse.json(
        { error: 'Los productos destacados son exclusivos del plan Extremo' },
        { status: 403 }
      );
    }
    if (
      input.image_urls &&
      input.image_urls.length > 0 &&
      !hasCatalogFeature(planType, 'multiple_images')
    ) {
      return NextResponse.json(
        { error: 'La galería de imágenes es exclusiva del plan Extremo' },
        { status: 403 }
      );
    }

    if (!admin) {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id);

      const limit = PLAN_PRODUCT_LIMITS[planType as PlanType] ?? 0;
      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Tu plan permite hasta ${limit === Infinity ? '∞' : limit} productos.`,
          },
          { status: 403 }
        );
      }
    }

    // Validar que la categoría (si vino) sea del mismo sitio.
    if (input.category_id) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('id')
        .eq('id', input.category_id)
        .eq('site_id', site.id)
        .maybeSingle();
      if (!cat) {
        return NextResponse.json(
          { error: 'La categoría no existe o no pertenece a tu sitio' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ site_id: site.id, ...input })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese slug' },
          { status: 409 }
        );
      }
      throw error;
    }

    if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
    if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');

    return NextResponse.json({ product: data });
  } catch (error) {
    captureError(error, { source: 'catalog-products-post' });
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}
