import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { loadCatalogContext } from '@/lib/catalog/auth';
import { captureError } from '@/lib/logger';
import { parseJson, updateCategorySchema } from '@/lib/schemas';
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
    const { supabase, site } = result.ctx;

    const { id } = await params;
    const parsed = await parseJson(req, updateCategorySchema);
    if (!parsed.ok) return parsed.response;

    const { data, error } = await supabase
      .from('product_categories')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('site_id', site.id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese slug' },
          { status: 409 }
        );
      }
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    invalidate(site);
    return NextResponse.json({ category: data });
  } catch (error) {
    captureError(error, { source: 'catalog-categories-put' });
    return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 });
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
      .from('product_categories')
      .delete()
      .eq('id', id)
      .eq('site_id', site.id);

    if (error) throw error;

    invalidate(site);
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'catalog-categories-delete' });
    return NextResponse.json({ error: 'Error al borrar la categoría' }, { status: 500 });
  }
}
