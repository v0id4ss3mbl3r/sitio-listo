import { NextResponse } from 'next/server';

import { clientKey, rateLimit } from '@/lib/rateLimit';

/**
 * Topes por ruta. Pensados para frenar un script, no para molestar a alguien
 * usando el producto: un cliente real no toca el checkout 8 veces por minuto.
 */
export const LIMITES = {
  // Crea una preferencia de pago en MercadoPago: cada intento es una llamada
  // a un tercero, así que es el más caro de abusar.
  checkout: { limit: 8, windowMs: 60_000 },
  // El editor la llama con debounce mientras se escribe el subdominio.
  subdomainCheck: { limit: 40, windowMs: 60_000 },
  // Sale a consultar DNS; barato, pero no hay razón para llamarla seguido.
  verifyDomain: { limit: 10, windowMs: 60_000 },
  // Guardar el sitio.
  guardarSitio: { limit: 30, windowMs: 60_000 },
} as const;

export type LimiteId = keyof typeof LIMITES;

/**
 * Devuelve una respuesta 429 si el request excede el tope, o null si puede
 * seguir. Se usa al principio del handler:
 *
 *   const frenado = checkLimit(req, 'checkout', user.id);
 *   if (frenado) return frenado;
 */
export function checkLimit(
  req: Request,
  id: LimiteId,
  userId?: string | null
): NextResponse | null {
  const { limit, windowMs } = LIMITES[id];
  const resultado = rateLimit({
    key: `${id}:${clientKey(req, userId)}`,
    limit,
    windowMs,
  });

  if (resultado.allowed) return null;

  return NextResponse.json(
    { error: 'Demasiados intentos. Esperá un momento y volvé a probar.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(resultado.retryAfter),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
