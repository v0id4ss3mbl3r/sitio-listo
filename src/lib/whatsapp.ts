/* ─────────────────────────────────────────────────────────────────────────
 * Helper de WhatsApp — reutilizable por todas las plantillas.
 *
 * Centraliza la construcción de links wa.me y los mensajes pre-cargados, que
 * antes vivían sueltos en TiendaCatalogo (pedidos) y TiendaExpress (links).
 * Sirve para pedidos (catálogo/tienda) y turnos (belleza, barbería, fotografía).
 * ───────────────────────────────────────────────────────────────────────── */

/** Deja solo dígitos (formato que espera wa.me). */
export function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

/** Formatea un número como precio en ARS. */
export function formatARS(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

/**
 * URL de wa.me con (opcionalmente) un mensaje pre-cargado. Si el mensaje está
 * vacío, no agrega `?text=` (equivale a abrir el chat sin texto).
 */
export function buildWhatsappUrl(phone: string, message = ''): string {
  const digits = normalizePhone(phone);
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

/** Mensaje de PEDIDO (catálogo / tienda). Formato idéntico al previo de TiendaCatalogo. */
export function buildOrderMessage(opts: {
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}): string {
  const lines: string[] = [];
  lines.push('*NUEVO PEDIDO* 🛒');
  lines.push('');
  if (opts.customerName) lines.push(`*Cliente:* ${opts.customerName}`);
  if (opts.customerPhone) lines.push(`*Teléfono:* ${opts.customerPhone}`);
  if (opts.notes) lines.push(`*Observaciones:* ${opts.notes}`);
  lines.push('');
  lines.push('*Detalle:*');
  opts.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} x ${item.quantity} — ${formatARS(item.price * item.quantity)}`);
  });
  lines.push('');
  lines.push(`*TOTAL: ${formatARS(opts.total)}*`);
  return lines.join('\n');
}

/** Mensaje de TURNO / reserva (belleza, barbería, fotografía). */
export function buildBookingMessage(opts: {
  services: string[];
  customerName: string;
  customerPhone: string;
  date?: string;
  time?: string;
  notes?: string;
}): string {
  const lines: string[] = [];
  lines.push('*NUEVO TURNO* 📅');
  lines.push('');
  lines.push(`*Cliente:* ${opts.customerName}`);
  lines.push(`*Teléfono:* ${opts.customerPhone}`);
  if (opts.date) lines.push(`*Fecha:* ${opts.date}`);
  if (opts.time) lines.push(`*Horario:* ${opts.time}`);
  if (opts.services.length > 0) {
    lines.push('');
    lines.push('*Servicios:*');
    opts.services.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  }
  if (opts.notes) {
    lines.push('');
    lines.push(`*Observaciones:* ${opts.notes}`);
  }
  return lines.join('\n');
}
