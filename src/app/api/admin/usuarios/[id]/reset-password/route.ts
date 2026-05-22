import { NextResponse } from 'next/server';

import { isProduction } from '@/lib/env';
import { createServiceRoleClient, requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';

// Genera un link de recovery y lo enviamos al email del usuario vía Supabase.
// Supabase manda el email automáticamente si tenés SMTP configurado en el
// dashboard. Si no, no se envía pero el endpoint igual devuelve 200 (no
// queremos filtrar info al admin).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;

    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .maybeSingle();

    if (!profile?.email) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const appUrl = isProduction()
      ? process.env.NEXT_PUBLIC_APP_URL
      : 'http://app.localhost:3000';

    const service = createServiceRoleClient();
    const { error } = await service.auth.admin.generateLink({
      type: 'recovery',
      email: profile.email,
      options: {
        redirectTo: `${appUrl}/api/auth/callback?next=/restablecer-clave`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-users-reset-password' });
    return NextResponse.json({ error: 'Error al enviar recovery' }, { status: 500 });
  }
}
