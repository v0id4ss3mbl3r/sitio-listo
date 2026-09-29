/* ─────────────────────────────────────────────────────────────────────────
 * Contenido de los emails transaccionales.
 *
 * Separado del transporte a propósito: son funciones puras que devuelven
 * asunto, HTML y texto plano, así se pueden testear sin tocar la red.
 *
 * El HTML es deliberadamente pobre —tablas no, CSS externo no, imágenes no—
 * porque los clientes de correo no son navegadores: Gmail descarta el <head>,
 * Outlook renderiza con el motor de Word. Estilos en línea y poco más.
 * ───────────────────────────────────────────────────────────────────────── */

import { SITE_URL } from '@/lib/env';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.sitiolisto.com.ar';
const CONTACTO = 'contacto@sitiolisto.com.ar';

export type EmailContenido = { subject: string; html: string; text: string };

/** Escapa lo que venga de la base antes de interpolarlo en el HTML. */
function esc(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout({
  titulo,
  parrafos,
  cta,
}: {
  titulo: string;
  parrafos: string[];
  cta?: { texto: string; href: string };
}): string {
  const cuerpo = parrafos
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#444444;">${p}</p>`
    )
    .join('');

  const boton = cta
    ? `<p style="margin:24px 0 0;">
         <a href="${cta.href}" style="display:inline-block;background:#2340E8;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:6px;">${esc(cta.texto)}</a>
       </p>`
    : '';

  return `<!doctype html>
<html lang="es"><body style="margin:0;padding:24px;background:#f4f5fa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:2px solid #0a0a0a;border-radius:6px;padding:32px;">
    <p style="margin:0 0 24px;font-size:18px;font-weight:800;color:#0a0a0a;letter-spacing:-0.02em;">SitioListo</p>
    <h1 style="margin:0 0 20px;font-size:24px;line-height:1.25;font-weight:800;color:#0a0a0a;letter-spacing:-0.02em;">${esc(titulo)}</h1>
    ${cuerpo}
    ${boton}
    <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #e4e6ee;font-size:13px;line-height:1.6;color:#6b6b6b;">
      ¿Dudas? Respondé este correo o escribinos a
      <a href="mailto:${CONTACTO}" style="color:#2340E8;">${CONTACTO}</a>.<br>
      Podés dar de baja el servicio cuando quieras desde
      <a href="${APP_URL}/cuenta" style="color:#2340E8;">tu panel</a>.
    </p>
  </div>
</body></html>`;
}

function textoPlano(titulo: string, lineas: string[], cta?: { texto: string; href: string }): string {
  const partes = [titulo, '', ...lineas];
  if (cta) partes.push('', `${cta.texto}: ${cta.href}`);
  partes.push(
    '',
    '---',
    `¿Dudas? Escribinos a ${CONTACTO}`,
    `Dar de baja: ${APP_URL}/cuenta`
  );
  return partes.join('\n');
}

/** El cobro salió bien y el sitio quedó publicado. */
export function suscripcionActivada({
  nombre,
  plan,
  subdominio,
}: {
  nombre?: string | null;
  plan: string;
  subdominio?: string | null;
}): EmailContenido {
  const saludo = nombre ? `Hola ${esc(nombre)},` : 'Hola,';
  const url = subdominio ? `https://${subdominio}.sitiolisto.com.ar` : SITE_URL;

  const lineas = [
    `${nombre ? `Hola ${nombre},` : 'Hola,'} tu suscripción al plan ${plan} quedó activa.`,
    subdominio
      ? `Tu sitio ya está publicado en ${url} y se puede visitar desde cualquier lado.`
      : 'Entrá al panel para elegir tu plantilla y publicar tu sitio.',
    'El comprobante de pago te llega por separado.',
  ];

  return {
    subject: `Tu plan ${plan} está activo`,
    html: layout({
      titulo: `Tu plan ${esc(plan)} está activo`,
      parrafos: [
        `${saludo} ya podés usar todo lo que incluye tu plan.`,
        subdominio
          ? `Tu sitio está publicado en <a href="${url}" style="color:#2340E8;">${esc(subdominio)}.sitiolisto.com.ar</a> y cualquiera puede visitarlo.`
          : 'Entrá al panel para elegir tu plantilla y publicar tu sitio.',
        'El comprobante de pago te llega por separado.',
      ],
      cta: { texto: subdominio ? 'Ver mi sitio' : 'Ir al panel', href: subdominio ? url : `${APP_URL}/editor` },
    }),
    text: textoPlano(`Tu plan ${plan} está activo`, lineas, {
      texto: subdominio ? 'Ver mi sitio' : 'Ir al panel',
      href: subdominio ? url : `${APP_URL}/editor`,
    }),
  };
}

/** MercadoPago pausó la suscripción: casi siempre, un cobro rechazado. */
export function pagoRechazado({ nombre, plan }: { nombre?: string | null; plan: string }): EmailContenido {
  const saludo = nombre ? `Hola ${esc(nombre)},` : 'Hola,';

  const lineas = [
    `${nombre ? `Hola ${nombre},` : 'Hola,'} no pudimos cobrar tu plan ${plan}.`,
    'Suele ser un problema con la tarjeta: saldo, vencimiento o un límite del banco.',
    'Tu sitio sigue online por ahora. Si el cobro no se regulariza, se despublica al terminar el período pago.',
    'Revisá el medio de pago en tu panel para que no se interrumpa.',
  ];

  return {
    subject: `No pudimos cobrar tu plan ${plan}`,
    html: layout({
      titulo: 'No pudimos cobrar tu suscripción',
      parrafos: [
        `${saludo} el último intento de cobro del plan ${esc(plan)} no se pudo completar.`,
        'Suele ser un problema con la tarjeta: saldo, fecha de vencimiento o un límite del banco.',
        '<strong>Tu sitio sigue online.</strong> Si el cobro no se regulariza, se despublica al terminar el período que ya pagaste.',
      ],
      cta: { texto: 'Revisar mi medio de pago', href: `${APP_URL}/cuenta` },
    }),
    text: textoPlano('No pudimos cobrar tu suscripción', lineas, {
      texto: 'Revisar mi medio de pago',
      href: `${APP_URL}/cuenta`,
    }),
  };
}

/** La suscripción se dio de baja (por el usuario o por MercadoPago). */
export function suscripcionCancelada({
  nombre,
  plan,
  hasta,
}: {
  nombre?: string | null;
  plan: string;
  hasta?: string | null;
}): EmailContenido {
  const saludo = nombre ? `Hola ${esc(nombre)},` : 'Hola,';
  const fecha = hasta
    ? new Date(hasta).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const lineas = [
    `${nombre ? `Hola ${nombre},` : 'Hola,'} tu plan ${plan} quedó dado de baja.`,
    fecha
      ? `Tu sitio sigue online hasta el ${fecha}. No se van a generar nuevos cobros.`
      : 'No se van a generar nuevos cobros.',
    'Guardamos tu contenido 30 días por si querés volver.',
  ];

  return {
    subject: 'Tu suscripción fue dada de baja',
    html: layout({
      titulo: 'Tu suscripción fue dada de baja',
      parrafos: [
        `${saludo} confirmamos la baja de tu plan ${esc(plan)}. No se van a generar nuevos cobros.`,
        fecha
          ? `Tu sitio sigue online hasta el <strong>${esc(fecha)}</strong>.`
          : 'Tu sitio deja de publicarse al terminar el período que ya pagaste.',
        'Guardamos tu contenido durante 30 días por si querés volver. Después de ese plazo se elimina.',
      ],
      cta: { texto: 'Reactivar mi plan', href: `${APP_URL}/cuenta` },
    }),
    text: textoPlano('Tu suscripción fue dada de baja', lineas, {
      texto: 'Reactivar mi plan',
      href: `${APP_URL}/cuenta`,
    }),
  };
}
