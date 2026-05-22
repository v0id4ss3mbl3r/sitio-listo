import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { blockUserSchema, parseJson } from '@/lib/schemas';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase, user: adminUser } = guard;

    const { id } = await params;
    if (id === adminUser.id) {
      return NextResponse.json(
        { error: 'No podés bloquear tu propia cuenta' },
        { status: 400 }
      );
    }

    const parsed = await parseJson(req, blockUserSchema);
    if (!parsed.ok) return parsed.response;

    const { until } = parsed.data;
    if (new Date(until).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'La fecha de fin del bloqueo tiene que ser futura' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('profiles')
      .update({ blocked_until: until, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-users-block' });
    return NextResponse.json({ error: 'Error al bloquear usuario' }, { status: 500 });
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
    const { error } = await supabase
      .from('profiles')
      .update({ blocked_until: null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-users-unblock' });
    return NextResponse.json({ error: 'Error al desbloquear usuario' }, { status: 500 });
  }
}
