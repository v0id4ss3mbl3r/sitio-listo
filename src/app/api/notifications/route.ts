import { NextResponse } from 'next/server';

import { captureError } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const url = new URL(req.url);
    const onlyUnread = url.searchParams.get('unread') === 'true';

    let query = supabase
      .from('notifications')
      .select('id, title, body, read_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (onlyUnread) query = query.is('read_at', null);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ notifications: data ?? [] });
  } catch (error) {
    captureError(error, { source: 'notifications-get' });
    return NextResponse.json({ error: 'Error al cargar notificaciones' }, { status: 500 });
  }
}

// Marcar todas como leídas.
export async function PATCH() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'notifications-mark-all-read' });
    return NextResponse.json({ error: 'Error al marcar leídas' }, { status: 500 });
  }
}
