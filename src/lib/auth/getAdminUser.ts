import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import { getRequestAuth } from '@/lib/auth/requestAuth';

// Guard de admin para Server Components. `cache()` deduplica por request
// (layout admin + página comparten el resultado).
//
// Camino rápido: usa el user id + rol que el middleware ya validó y reenvió
// por header → cero llamadas de red. Fallback: valida contra Supabase si el
// header no está (contextos sin middleware).
export const getAdminUser = cache(async () => {
  const reqAuth = await getRequestAuth();
  if (reqAuth) {
    return reqAuth.role === 'admin' ? { userId: reqAuth.userId } : null;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') return null;
  return { userId: user.id };
});

// Helper liviano: solo chequea el rol. Para usar dentro de handlers que
// ya tienen un cliente Supabase y un userId.
export async function isAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'admin';
}
