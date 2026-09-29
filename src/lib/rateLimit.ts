/* ─────────────────────────────────────────────────────────────────────────
 * Límite de frecuencia por IP / usuario.
 *
 * Ventana fija: cada clave tiene un contador que se reinicia cada `windowMs`.
 * Es menos preciso que una ventana deslizante en el borde entre ventanas, y a
 * cambio no guarda una marca de tiempo por request — con cientos de claves
 * vivas, esa diferencia importa más que la precisión.
 *
 * LÍMITE CONOCIDO: el estado vive en memoria del proceso. En un entorno con
 * varias instancias, cada una lleva su propio contador, así que el tope real
 * es el configurado multiplicado por la cantidad de instancias. Sube mucho la
 * barrera para un script casero, pero NO es un límite global: para eso hace
 * falta un almacén compartido (Redis / Upstash).
 * ───────────────────────────────────────────────────────────────────────── */

export type RateLimitResult = {
  allowed: boolean;
  /** Cuántos requests quedan en la ventana actual. */
  remaining: number;
  /** Segundos hasta que se libere, para la cabecera Retry-After. */
  retryAfter: number;
};

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

// Tope de claves en memoria, para que el Map no crezca sin control cuando lo
// que llega es tráfico de muchas IPs distintas.
const MAX_KEYS = 10_000;

export function rateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}): RateLimitResult {
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    if (buckets.size >= MAX_KEYS) evictOldest();
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count++;

  if (bucket.count > limit) {
    const restanteMs = windowMs - (now - bucket.windowStart);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil(restanteMs / 1000)),
    };
  }

  return { allowed: true, remaining: limit - bucket.count, retryAfter: 0 };
}

// El Map itera en orden de inserción y cada ventana nueva re-inserta su clave,
// así que borrar desde el principio descarta las menos usadas recientemente.
function evictOldest(): void {
  const sobrantes = Math.ceil(MAX_KEYS * 0.1);
  let borradas = 0;
  for (const clave of buckets.keys()) {
    buckets.delete(clave);
    if (++borradas >= sobrantes) break;
  }
}

/**
 * Identifica a quien hace el request.
 *
 * Con userId se usa ese, que es más justo: varias personas detrás de la misma
 * IP (una oficina, un CGNAT de celular) no se gastan el cupo entre sí.
 * Sin sesión queda la IP, leída de las cabeceras que pone el proxy.
 */
export function clientKey(req: Request, userId?: string | null): string {
  if (userId) return `u:${userId}`;

  const forwarded = req.headers.get('x-forwarded-for');
  // x-forwarded-for puede traer una cadena: el primero es el cliente real.
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'desconocida';

  return `ip:${ip}`;
}

/** Solo para tests: limpia el estado entre casos. */
export function resetRateLimit(): void {
  buckets.clear();
}
