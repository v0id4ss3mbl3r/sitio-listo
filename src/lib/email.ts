// Envío de emails transaccionales, sin librerías: la API de Resend es un POST
// con JSON y `fetch` ya viene en el runtime. Mismo patrón que los avisos de
// Telegram.
//
// Configuración (ninguna es NEXT_PUBLIC_, así que no llegan al navegador):
//   RESEND_API_KEY — la clave de la cuenta
//   EMAIL_FROM     — remitente verificado, ej. "SitioListo <hola@sitiolisto.com.ar>"
//
// Si falta cualquiera de las dos, el envío queda apagado y la app sigue igual.
// Un email que no sale no puede tumbar un cobro ni un webhook.

const RESEND_API = 'https://api.resend.com/emails';
const SEND_TIMEOUT_MS = 8000;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  /** Alternativa en texto plano. Obligatoria: sube la entregabilidad y es lo
   *  que ven los clientes que bloquean HTML. */
  text: string;
};

export type EmailResult = { sent: boolean; reason?: string };

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { sent: false, reason: 'no-configurado' };
  if (!to) return { sent: false, reason: 'sin-destinatario' };

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, text }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!res.ok) {
      // console directo, no captureError: un fallo de email no amerita
      // despertar a nadie por Telegram, y evita bucles si el que falla es el
      // aviso de que falló algo.
      console.error(
        JSON.stringify({
          level: 'error',
          message: 'email-send-failed',
          status: res.status,
          subject,
        })
      );
      return { sent: false, reason: `http-${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'email-send-threw',
        detail: err instanceof Error ? err.message : String(err),
      })
    );
    return { sent: false, reason: 'excepcion' };
  }
}
