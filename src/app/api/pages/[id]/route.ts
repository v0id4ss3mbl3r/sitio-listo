import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { captureError } from '@/lib/logger';
import { parseJson, updatePageSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { siteCacheTag } from '@/lib/supabase/public';

async function loadPageWithSite(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pageId: string,
  userId: string
) {
  const { data } = await supabase
    .from('pages')
    .select('id, site_id, is_home, slug, sites!inner(id, user_id, subdomain, custom_domain)')
    .eq('id', pageId)
    .maybeSingle();

  if (!data) return null;
  // El join devuelve un array o un objeto según la versión del cliente; normalizamos.
  const sitesRaw = (data as { sites: unknown }).sites;
  const site = Array.isArray(sitesRaw) ? sitesRaw[0] : sitesRaw;
  if (!site || (site as { user_id: string }).user_id !== userId) return null;

  return {
    page: data as { id: string; site_id: string; is_home: boolean; slug: string },
    site: site as { id: string; subdomain: string; custom_domain: string | null },
  };
}

function invalidate(site: { subdomain: string | null; custom_domain: string | null }) {
  if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
  if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const parsed = await parseJson(req, updatePageSchema);
    if (!parsed.ok) return parsed.response;

    const owned = await loadPageWithSite(supabase, id, user.id);
    if (!owned) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 });
    }

    const patch = parsed.data;
    // No permitir cambiar el slug de la home — siempre es ''.
    if (owned.page.is_home && patch.slug !== undefined && patch.slug !== '') {
      return NextResponse.json(
        { error: 'La página home no puede tener slug' },
        { status: 400 }
      );
    }
    // Slug vacío reservado para home.
    if (!owned.page.is_home && patch.slug === '') {
      return NextResponse.json(
        { error: 'Solo la página home puede tener slug vacío' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pages')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una página con ese slug en tu sitio' },
          { status: 409 }
        );
      }
      throw error;
    }

    invalidate(owned.site);
    return NextResponse.json({ page: data });
  } catch (error) {
    captureError(error, { source: 'pages-put' });
    return NextResponse.json({ error: 'Error al actualizar la página' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const owned = await loadPageWithSite(supabase, id, user.id);
    if (!owned) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 });
    }

    if (owned.page.is_home) {
      return NextResponse.json(
        { error: 'No podés borrar la página principal' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) throw error;

    invalidate(owned.site);
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'pages-delete' });
    return NextResponse.json({ error: 'Error al borrar la página' }, { status: 500 });
  }
}
