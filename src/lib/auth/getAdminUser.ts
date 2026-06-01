import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

// `cache()` deduplica por request: si el layout admin y la página admin
// llaman getAdminUser() en el mismo render, se hace UNA sola validación de
// sesión + UNA query a profiles (en vez de duplicarlas).
export const getAdminUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') return null;
  return { user, profile };
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
