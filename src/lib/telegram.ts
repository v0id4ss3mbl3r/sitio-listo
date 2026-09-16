// Envío de avisos por Telegram, sin librerías: la Bot API es un POST con JSON
// y `fetch` ya viene en el runtime.
//
// Configuración (ninguna de las dos es NEXT_PUBLIC_, así que nunca llegan al
// navegador):
//   TELEGRAM_BOT_TOKEN — el que devuelve @BotFather al crear el bot
//   TELEGRAM_CHAT_ID   — el chat a donde mandar (tu usuario, o un grupo)
//
// Si falta cualquiera de las dos, los avisos quedan apagados y todo sigue
// funcionando igual: el error ya quedó en el log estructurado.

const TELEGRAM_API = 'https://api.telegram.org';
const MAX_MESSAGE_LENGTH = 4096; // límite duro de la Bot API
const SEND_TIMEOUT_MS = 5000;
const STACK_LINES = 4;

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export type AlertInput = {
  message: string;
  source?: string;
  stack?: string;
  context?: Record<string, unknown>;
  suppressed: number;
  droppedByRate: number;
};

/**
 * Arma el texto del aviso. Va como texto plano a propósito: los stack traces
 * tienen guiones bajos, asteriscos y backticks que romperían el parseo de
 * Markdown y harían que Telegram rechace el mensaje entero.
 */
export function buildAlertText({
  message,
  source,
  stack,
  context,
  suppressed,
  droppedByRate,
}: AlertInput): string {
  const lines: string[] = ['🔴 SitioListo — error'];

  lines.push('');
  lines.push(source ? `[${source}] ${message}` : message);

  if (suppressed > 0) {
    lines.push('');
    lines.push(`+${suppressed} iguales desde el último aviso`);
  }

  if (droppedByRate > 0) {
    lines.push(`${droppedByRate} aviso(s) de otros errores omitidos por tope de frecuencia`);
  }

  // Resto del contexto, sin repetir `source` que ya va en el encabezado.
  const extra = Object.entries(context ?? {}).filter(([key]) => key !== 'source');
  if (extra.length > 0) {
    lines.push('');
    for (const [key, value] of extra) {
      lines.push(`${key}: ${String(value)}`);
    }
  }

  if (stack) {
    const frames = stack.split('\n').slice(1, 1 + STACK_LINES);
    if (frames.length > 0) {
      lines.push('');
      lines.push(frames.map((frame) => frame.trim()).join('\n'));
    }
  }

  return lines.join('\n').slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * Manda el aviso. No tira nunca: un problema al avisar no puede tumbar el
 * request que lo originó.
 */
export async function sendTelegramAlert(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, MAX_MESSAGE_LENGTH),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!res.ok) {
      // console directo, no captureError: avisar de que falló el aviso nos
      // metería en un bucle.
      console.error(
        JSON.stringify({
          level: 'error',
          message: 'telegram-alert-failed',
          status: res.status,
        })
      );
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'telegram-alert-threw',
        detail: err instanceof Error ? err.message : String(err),
      })
    );
  }
}
