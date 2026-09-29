import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  pagoRechazado,
  suscripcionActivada,
  suscripcionCancelada,
} from '@/lib/emailTemplates';
import { isEmailConfigured, sendEmail } from '@/lib/email';

describe('plantillas de email', () => {
  it('la de activación lleva el sitio del cliente cuando ya está publicado', () => {
    const m = suscripcionActivada({ nombre: 'Ana', plan: 'pro', subdominio: 'panaderia' });

    expect(m.subject).toContain('pro');
    expect(m.html).toContain('panaderia.sitiolisto.com.ar');
    expect(m.text).toContain('panaderia.sitiolisto.com.ar');
  });

  it('sin sitio publicado manda al panel en vez de a una URL rota', () => {
    const m = suscripcionActivada({ nombre: 'Ana', plan: 'basic', subdominio: null });

    // El pie del mail SIEMPRE linkea al panel, así que no alcanza con buscar
    // el dominio: lo que importa es que el CTA no apunte a un sitio inexistente.
    expect(m.html).toContain('Ir al panel');
    expect(m.html).toContain('app.sitiolisto.com.ar/editor');
    expect(m.html).not.toContain('null.sitiolisto.com.ar');
  });

  it('la de pago rechazado aclara que el sitio sigue online', () => {
    // Si el mail no lo dice, el cliente entra en pánico creyendo que se le
    // cayó el sitio.
    const m = pagoRechazado({ nombre: 'Juan', plan: 'pro' });

    expect(m.html).toContain('sigue online');
    expect(m.text).toContain('sigue online');
  });

  it('la de baja informa hasta cuándo sigue publicado', () => {
    const m = suscripcionCancelada({
      nombre: 'Ana',
      plan: 'pro',
      hasta: '2026-12-31T00:00:00Z',
    });

    expect(m.html).toContain('diciembre');
    expect(m.text).toContain('diciembre');
  });

  it('funciona sin fecha de fin', () => {
    const m = suscripcionCancelada({ nombre: null, plan: 'basic', hasta: null });

    expect(m.subject).toBeTruthy();
    expect(m.html).not.toContain('Invalid Date');
    expect(m.text).not.toContain('Invalid Date');
  });

  it('escapa el nombre: viene de la base y termina dentro del HTML', () => {
    const m = suscripcionActivada({
      nombre: '<script>alert(1)</script>',
      plan: 'pro',
      subdominio: null,
    });

    expect(m.html).not.toContain('<script>');
    expect(m.html).toContain('&lt;script&gt;');
  });

  it('las tres llevan asunto, HTML y texto plano', () => {
    const todas = [
      suscripcionActivada({ nombre: 'A', plan: 'pro', subdominio: 'x' }),
      pagoRechazado({ nombre: 'A', plan: 'pro' }),
      suscripcionCancelada({ nombre: 'A', plan: 'pro', hasta: null }),
    ];

    for (const m of todas) {
      expect(m.subject.length).toBeGreaterThan(0);
      expect(m.html).toContain('<!doctype html>');
      // El texto plano no es opcional: sube la entregabilidad y es lo que ven
      // los clientes que bloquean HTML.
      expect(m.text.length).toBeGreaterThan(0);
      expect(m.text).not.toContain('<');
    }
  });
});

describe('sendEmail', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('no hace nada si falta configuración', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('EMAIL_FROM', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(isEmailConfigured()).toBe(false);
    const r = await sendEmail({ to: 'a@b.com', subject: 's', html: 'h', text: 't' });

    expect(r.sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('postea a Resend con el remitente configurado', async () => {
    vi.stubEnv('RESEND_API_KEY', 'key-123');
    vi.stubEnv('EMAIL_FROM', 'SitioListo <hola@sitiolisto.com.ar>');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const r = await sendEmail({ to: 'ana@mail.com', subject: 'Hola', html: '<p>h</p>', text: 'h' });

    expect(r.sent).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer key-123');
    expect(JSON.parse(init.body)).toMatchObject({
      from: 'SitioListo <hola@sitiolisto.com.ar>',
      to: 'ana@mail.com',
      subject: 'Hola',
    });
  });

  it('no tira si Resend responde con error ni si se cae la red', async () => {
    vi.stubEnv('RESEND_API_KEY', 'key-123');
    vi.stubEnv('EMAIL_FROM', 'x@y.com');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422 }));
    await expect(sendEmail({ to: 'a@b.com', subject: 's', html: 'h', text: 't' }))
      .resolves.toMatchObject({ sent: false });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));
    await expect(sendEmail({ to: 'a@b.com', subject: 's', html: 'h', text: 't' }))
      .resolves.toMatchObject({ sent: false });
  });

  it('sin destinatario no llama a la red', async () => {
    vi.stubEnv('RESEND_API_KEY', 'key-123');
    vi.stubEnv('EMAIL_FROM', 'x@y.com');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const r = await sendEmail({ to: '', subject: 's', html: 'h', text: 't' });

    expect(r.sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
