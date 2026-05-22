import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { adminUpdateSiteSchema, parseJson } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';
import { validateCustomDomain, validateSubdomain } from '@/lib/validation';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;
    const parsed = await parseJson(req, adminUpdateSiteSchema);
    if (!parsed.ok) return parsed.response;
    const input = parsed.data;

    if (input.subdomain !== undefined) {
      const r = validateSubdomain(input.subdomain);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
      input.subdomain = r.value;
    }

    if (input.custom_domain !== undefined && input.custom_domain !== null) {
      const r = validateCustomDomain(input.custom_domain);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
      input.custom_domain = r.value || null;
    }

    // Cargar el sitio actual para invalidar el cache del dominio anterior si cambió.
    const { data: previous } = await supabase
      .from('sites')
      .select('subdomain, custom_domain')
      .eq('id', id)
      .maybeSingle();

    const { data, error } = await supabase
      .from('sites')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un sitio con ese subdominio o dominio' },
          { status: 409 }
        );
      }
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: 'Sitio no encontrado' }, { status: 404 });
    }

    if (data.subdomain) revalidateTag(siteCacheTag(data.subdomain), 'max');
    if (data.custom_domain) revalidateTag(siteCacheTag(data.custom_domain), 'max');
    if (previous?.subdomain && previous.subdomain !== data.subdomain) {
      revalidateTag(siteCacheTag(previous.subdomain), 'max');
    }
    if (previous?.custom_domain && previous.custom_domain !== data.custom_domain) {
      revalidateTag(siteCacheTag(previous.custom_domain), 'max');
    }

    return NextResponse.json({ site: data });
  } catch (error) {
    captureError(error, { source: 'admin-sites-patch' });
    return NextResponse.json({ error: 'Error al actualizar el sitio' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;
    const { data: target } = await supabase
      .from('sites')
      .select('subdomain, custom_domain')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase.from('sites').delete().eq('id', id);
    if (error) throw error;

    if (target?.subdomain) revalidateTag(siteCacheTag(target.subdomain), 'max');
    if (target?.custom_domain) revalidateTag(siteCacheTag(target.custom_domain), 'max');

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-sites-delete' });
    return NextResponse.json({ error: 'Error al eliminar el sitio' }, { status: 500 });
  }
}
