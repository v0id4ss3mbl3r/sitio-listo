import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { adminUpdateSubscriptionSchema, parseJson } from '@/lib/schemas';
import { siteCacheTag } from '@/lib/supabase/public';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;
    const parsed = await parseJson(req, adminUpdateSubscriptionSchema);
    if (!parsed.ok) return parsed.response;

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('user_id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    // Invalidar cache de los sitios del usuario (su plan cambió).
    const { data: userSites } = await supabase
      .from('sites')
      .select('subdomain, custom_domain')
      .eq('user_id', data.user_id);

    revalidateTag(`user-sub:${data.user_id}`, { expire: 0 });
    for (const s of userSites ?? []) {
      if (s.subdomain) revalidateTag(siteCacheTag(s.subdomain), { expire: 0 });
      if (s.custom_domain) revalidateTag(siteCacheTag(s.custom_domain), { expire: 0 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-subs-patch' });
    return NextResponse.json({ error: 'Error al actualizar suscripción' }, { status: 500 });
  }
}
