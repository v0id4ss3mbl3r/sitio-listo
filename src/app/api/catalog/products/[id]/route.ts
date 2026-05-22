import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { hasCatalogFeature } from '@/lib/constants';
import { loadCatalogContext } from '@/lib/catalog/auth';
import { captureError } from '@/lib/logger';
import { parseJson, updateProductSchema } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

function invalidate(site: { subdomain: string; custom_domain: string | null }) {
  if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
  if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site, planType } = result.ctx;

    const { id } = await params;
    const parsed = await parseJson(req, updateProductSchema);
    if (!parsed.ok) return parsed.response;
    const input = parsed.data;

    if (input.is_featured === true && !hasCatalogFeature(planType, 'featured_products')) {
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
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('site_id', site.id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese slug' },
          { status: 409 }
        );
      }
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    invalidate(site);
    return NextResponse.json({ product: data });
  } catch (error) {
    captureError(error, { source: 'catalog-products-put' });
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await loadCatalogContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { id } = await params;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('site_id', site.id);

    if (error) throw error;

    invalidate(site);
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'catalog-products-delete' });
    return NextResponse.json({ error: 'Error al borrar el producto' }, { status: 500 });
  }
}
