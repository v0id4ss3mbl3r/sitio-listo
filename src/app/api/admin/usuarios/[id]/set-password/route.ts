import { NextResponse } from 'next/server';

import { createServiceRoleClient, requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { parseJson, setPasswordSchema } from '@/lib/schemas';

// CAMBIO DIRECTO de password — operación sensible. El admin queda con
// conocimiento de la nueva pass del usuario. Usar solo en casos de
// soporte donde el usuario lo pidió explícitamente.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { user: adminUser } = guard;

    const { id } = await params;
    if (id === adminUser.id) {
      return NextResponse.json(
        { error: 'Usá /restablecer-clave para tu propia contraseña' },
        { status: 400 }
      );
    }

    const parsed = await parseJson(req, setPasswordSchema);
    if (!parsed.ok) return parsed.response;

    const service = createServiceRoleClient();
    const { error } = await service.auth.admin.updateUserById(id, {
      password: parsed.data.password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-users-set-password' });
    return NextResponse.json({ error: 'Error al setear contraseña' }, { status: 500 });
  }
}
