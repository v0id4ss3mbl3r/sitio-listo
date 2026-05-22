import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { isAdmin } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';

type Result =
  | { ok: true; supabase: SupabaseClient; user: User }
  | { ok: false; response: Response };

// Verifica que el caller esté autenticado y sea admin. Devuelve el cliente
// Supabase con la sesión del admin (sujeto a RLS — las policies "Admins
// can ..." creadas en migration 0007 le dan acceso completo).
export async function requireAdmin(): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    };
  }
  const admin = await isAdmin(supabase, user.id);
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Prohibido' }, { status: 403 }),
    };
  }
  return { ok: true, supabase, user };
}

// Cliente con SUPABASE_SERVICE_ROLE_KEY — bypassea RLS. Reservado para
// operaciones que requieren la Auth Admin API (delete user, update user
// metadata, generate recovery link, set password). NO usar para queries
// normales del panel admin: para eso usá el cliente de requireAdmin().
export function createServiceRoleClient(): SupabaseClient {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
