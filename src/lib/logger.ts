// Wrapper minimalista de logging. Centraliza las llamadas para que conectar
// un destino nuevo sea una sola edición de este archivo.
//
// Hoy hace dos cosas con cada error:
//   1. Lo escribe como una línea JSON en stdout (queda en los logs de Vercel).
//   2. Si hay un bot configurado, manda un aviso por Telegram — pasando antes
//      por el freno de `alertThrottle` para no inundar el chat.
//
// Para activar los avisos hay que setear TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID.
// Sin esas variables el punto 2 no corre y todo sigue igual que antes.
//
// Si algún día se suma Sentry (historial, agrupación entre instancias,
// tendencias), va acá mismo y puede convivir con los avisos de Telegram.

import { after } from 'next/server';

import { fingerprint, shouldSendAlert } from '@/lib/alertThrottle';
import {
  buildAlertText,
  isTelegramConfigured,
  sendTelegramAlert,
} from '@/lib/telegram';

export type LogContext = Record<string, unknown>;

export function captureError(err: unknown, context: LogContext = {}): void {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  // Una sola línea estructurada — fácil de parsear en Vercel logs / Datadog.
  console.error(
    JSON.stringify({
      level: 'error',
      message,
      stack,
      ...context,
    })
  );

  notify(message, stack, context);
}

export function captureMessage(
  message: string,
  level: 'info' | 'warn' = 'info',
  context: LogContext = {}
): void {
  const fn = level === 'warn' ? console.warn : console.log;
  fn(
    JSON.stringify({
      level,
      message,
      ...context,
    })
  );
}

// Los avisos son solo para errores: `captureMessage` es informativo y no
// amerita despertar a nadie.
function notify(
  message: string,
  stack: string | undefined,
  context: LogContext
): void {
  if (!isTelegramConfigured()) return;

  try {
    const source =
      typeof context.source === 'string' ? context.source : undefined;

    const decision = shouldSendAlert(fingerprint(message, source));
    if (!decision.send) return;

    dispatch(
      buildAlertText({
        message,
        source,
        stack,
        context,
        suppressed: decision.suppressed,
        droppedByRate: decision.droppedByRate,
      })
    );
  } catch {
    // Un problema armando el aviso no puede tumbar el request. El error
    // original ya quedó logueado arriba.
  }
}

function dispatch(text: string): void {
  try {
    // `after` corre el envío una vez que el usuario ya recibió su respuesta:
    // el aviso no le suma latencia al request.
    after(() => sendTelegramAlert(text));
  } catch {
    // Fuera del ciclo de vida de un request `after` no está disponible.
    // Mandamos igual, sin esperar.
    void sendTelegramAlert(text);
  }
}
