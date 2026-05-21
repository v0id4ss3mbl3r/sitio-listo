import { createClient } from '@supabase/supabase-js';

// Cliente Supabase sin contexto de cookies, apto para queries públicas
// (RLS policies que aplican a anon). Pensado para wrapearse en
// `unstable_cache` del runtime de Next — no debe depender de request state.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Tag de cache para invalidar el render de un sitio específico cuando
// su dueño guarda cambios. Llamar `revalidateTag(siteCacheTag(subdomain))`
// desde el POST de /api/sites.
export function siteCacheTag(domain: string): string {
  return `site:${domain.toLowerCase()}`;
}
