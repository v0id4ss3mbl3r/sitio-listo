import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
            cookiesToSet.forEach(({ name, value, options }) => {
              // Configurar dominio para compartir cookies entre subdominios
              const cookieOptions = { ...options, domain: '.sitiolisto.com.ar' };
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
