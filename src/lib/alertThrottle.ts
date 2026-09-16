// Freno de avisos. Sin esto, un error en loop (o un bot pegándole a una ruta
// rota) manda cientos de mensajes en minutos y Telegram nos empieza a rebotar
// los envíos por límite de frecuencia — justo cuando más falta hacen.
//
// Dos frenos independientes:
//   1. Por firma: el mismo error no vuelve a avisar hasta pasada la ventana.
//      Las ocurrencias que se tragan se cuentan y se informan en el aviso
//      siguiente ("+37 iguales desde el último aviso").
//   2. Global: tope de avisos por minuto, por si explotan muchos errores
//      distintos a la vez.
//
// Nota sobre serverless: el estado vive en memoria del proceso. En Vercel cada
// instancia tiene el suyo, así que el conteo es por instancia, no global. Eso
// igual mata el caso que importa (la misma instancia recibiendo el mismo error
// en loop); lo que no hace es deduplicar entre instancias.

export const ALERT_WINDOW_MS = 5 * 60_000; // no repetir la misma firma por 5 min
export const ALERT_RATE_WINDOW_MS = 60_000;
export const ALERT_MAX_PER_RATE_WINDOW = 10;

// Tope de firmas en memoria, para que el Map no crezca sin control.
const MAX_TRACKED_SIGNATURES = 500;

type Entry = {
  // Cuándo se mandó el último aviso de esta firma. 0 = nunca se avisó.
  lastSentAt: number;
  // Ocurrencias tragadas desde ese aviso.
  suppressed: number;
};

const seen = new Map<string, Entry>();

let rateWindowStart = 0;
let sentInRateWindow = 0;
let droppedByRate = 0;

export type ThrottleDecision =
  | { send: false }
  | {
      send: true;
      // Cuántas iguales se tragaron desde el aviso anterior.
      suppressed: number;
      // Cuántos avisos (de cualquier firma) se descartaron por el tope global.
      droppedByRate: number;
    };

/**
 * Reduce un error a una firma estable, para que dos ocurrencias del "mismo"
 * error caigan en el mismo grupo aunque cambien los ids, montos o URLs.
 *
 * "No existe el sitio 8f2c…-a1" y "No existe el sitio 3b9d…-c4" son el mismo
 * problema y no deben avisar dos veces.
 */
export function fingerprint(message: string, source?: string): string {
  const normalized = message
    .toLowerCase()
    // El orden importa: lo más específico primero, o los números se comen todo.
    .replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      '<id>'
    )
    .replace(/https?:\/\/\S+/g, '<url>')
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '<email>')
    .replace(/\b[0-9a-f]{16,}\b/g, '<hash>')
    // Sin \b: los números suelen venir pegados a una unidad ("3000ms") y ahí
    // no hay frontera de palabra que los separe.
    .replace(/\d+/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);

  return `${source ?? 'sin-origen'}|${normalized}`;
}

/**
 * Decide si este error amerita un aviso ahora mismo.
 *
 * `now` es inyectable para poder testear las ventanas sin esperar 5 minutos.
 */
export function shouldSendAlert(
  signature: string,
  now: number = Date.now()
): ThrottleDecision {
  const entry = seen.get(signature);

  // Freno 1: ya avisamos de esto hace poco.
  if (entry && entry.lastSentAt > 0 && now - entry.lastSentAt < ALERT_WINDOW_MS) {
    entry.suppressed++;
    return { send: false };
  }

  // Freno 2: tope global por minuto.
  if (now - rateWindowStart >= ALERT_RATE_WINDOW_MS) {
    rateWindowStart = now;
    sentInRateWindow = 0;
  }

  if (sentInRateWindow >= ALERT_MAX_PER_RATE_WINDOW) {
    droppedByRate++;
    if (entry) {
      entry.suppressed++;
    } else {
      // lastSentAt en 0: todavía no avisamos nunca de esta firma, así que el
      // próximo intento la va a tratar como nueva.
      seen.set(signature, { lastSentAt: 0, suppressed: 1 });
    }
    return { send: false };
  }

  sentInRateWindow++;

  const suppressed = entry?.suppressed ?? 0;
  const dropped = droppedByRate;
  droppedByRate = 0;

  seen.delete(signature); // re-insertar lo manda al final del Map (orden de uso)
  seen.set(signature, { lastSentAt: now, suppressed: 0 });
  evictOldest();

  return { send: true, suppressed, droppedByRate: dropped };
}

// El Map itera en orden de inserción y cada aviso re-inserta su firma, así que
// borrar desde el principio descarta las menos usadas recientemente.
function evictOldest(): void {
  while (seen.size > MAX_TRACKED_SIGNATURES) {
    const oldest = seen.keys().next();
    if (oldest.done) break;
    seen.delete(oldest.value);
  }
}

// Solo para tests: limpia el estado entre casos.
export function resetAlertThrottle(): void {
  seen.clear();
  rateWindowStart = 0;
  sentInRateWindow = 0;
  droppedByRate = 0;
}
