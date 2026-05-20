import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { COOKIE_DOMAIN, isProduction } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const prod = isProduction();
            cookiesToSet.forEach(({ name, value, options }) => {
              // En local, el dominio .sitiolisto.com.ar hace que el navegador
              // ignore las cookies → sesión perdida → 403 esporádico.
              const cookieOptions = prod
                ? { ...options, domain: COOKIE_DOMAIN }
                : options;
              cookieStore.set(name, value, cookieOptions);
            });
          } catch {
            // Se ignora si se llama desde un Server Component.
            // El proxy se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
