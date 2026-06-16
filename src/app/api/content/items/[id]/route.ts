import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { loadContentContext } from '@/lib/content/auth';
import { captureError } from '@/lib/logger';
import { parseJson, updateSiteItemSchema } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

function invalidate(site: { subdomain: string | null; custom_domain: string | null }) {
  if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
  if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await loadContentContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { id } = await params;
    const parsed = await parseJson(req, updateSiteItemSchema);
    if (!parsed.ok) return parsed.response;

    // Scopeado al sitio del dueño (id + site_id); RLS además lo refuerza.
    const { data, error } = await supabase
      .from('site_items')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('site_id', site.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
    }

    invalidate(site);
    return NextResponse.json({ item: data });
  } catch (error) {
    captureError(error, { source: 'content-items-put' });
    return NextResponse.json({ error: 'Error al actualizar el contenido' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await loadContentContext();
    if (!result.ok) return result.response;
    const { supabase, site } = result.ctx;

    const { id } = await params;
    const { data, error } = await supabase
      .from('site_items')
      .delete()
      .eq('id', id)
      .eq('site_id', site.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
    }

    invalidate(site);
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'content-items-delete' });
    return NextResponse.json({ error: 'Error al borrar el contenido' }, { status: 500 });
  }
}
