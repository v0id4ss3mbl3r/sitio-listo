import { NextResponse } from 'next/server';

import { createServiceRoleClient, requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;

    const [profileRes, sitesRes, subsRes, notifsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, blocked_until, created_at, updated_at')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('sites')
        .select('id, subdomain, custom_domain, template_id, is_active, is_banned, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('subscriptions')
        .select('id, plan_type, status, amount, current_period_end, trial_end_date, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('notifications')
        .select('id, title, read_at, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    if (!profileRes.data) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      profile: profileRes.data,
      sites: sitesRes.data ?? [],
      subscriptions: subsRes.data ?? [],
      notifications: notifsRes.data ?? [],
    });
  } catch (error) {
    captureError(error, { source: 'admin-users-get' });
    return NextResponse.json({ error: 'Error al cargar usuario' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { user: adminUser } = guard;

    const { id } = await params;
    if (id === adminUser.id) {
      return NextResponse.json(
        { error: 'No podés eliminar tu propia cuenta admin' },
        { status: 400 }
      );
    }

    // Borrar usuario de auth.users dispara CASCADE en profiles, sites, etc.
    const service = createServiceRoleClient();
    const { error } = await service.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-users-delete' });
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
