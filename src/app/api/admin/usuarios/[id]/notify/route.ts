import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { notifyUserSchema, parseJson } from '@/lib/schemas';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase, user: adminUser } = guard;

    const { id } = await params;
    const parsed = await parseJson(req, notifyUserSchema);
    if (!parsed.ok) return parsed.response;

    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!targetProfile) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: id,
        title: parsed.data.title,
        body: parsed.data.body,
        created_by: adminUser.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ notification: data });
  } catch (error) {
    captureError(error, { source: 'admin-users-notify' });
    return NextResponse.json({ error: 'Error al enviar notificación' }, { status: 500 });
  }
}
