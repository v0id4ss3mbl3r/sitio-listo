import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.is_active === 'boolean') updateData.is_active = body.is_active;
  if (typeof body.sort_order === 'number') updateData.sort_order = body.sort_order;

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('templates')
    .update(updateData)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
