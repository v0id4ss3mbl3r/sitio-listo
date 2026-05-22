import { NextResponse } from 'next/server';

import { captureError } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

// Marcar una notificación específica como leída.
export async function PATCH(
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
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'notifications-mark-read' });
    return NextResponse.json({ error: 'Error al marcar como leída' }, { status: 500 });
  }
}
