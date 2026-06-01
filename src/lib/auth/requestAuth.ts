import { headers } from 'next/headers';
import { cache } from 'react';

/**
 * Lee el user id + rol que el middleware ya validó y reenvió como headers de
 * request (x-sl-uid / x-sl-role). Evita re-llamar getUser()/profiles en cada
 * Server Component del panel.
 *
 * Seguro: el middleware borra cualquier x-sl-uid/x-sl-role entrante del cliente
 * antes de setear el suyo, así que el valor no se puede falsificar.
 *
 * Devuelve null si no hay header (p.ej. fuera del flujo de middleware) — el
 * caller debe tener un fallback que valide contra Supabase.
 */
export const getRequestAuth = cache(
  async (): Promise<{ userId: string; role: string | null } | null> => {
    const h = await headers();
    const userId = h.get('x-sl-uid');
    if (!userId) return null;
    return { userId, role: h.get('x-sl-role') };
  }
);
