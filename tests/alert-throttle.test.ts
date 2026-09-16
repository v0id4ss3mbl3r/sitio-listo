import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  ALERT_MAX_PER_RATE_WINDOW,
  ALERT_RATE_WINDOW_MS,
  ALERT_WINDOW_MS,
  fingerprint,
  resetAlertThrottle,
  shouldSendAlert,
} from '@/lib/alertThrottle';
import { buildAlertText, sendTelegramAlert } from '@/lib/telegram';

const T0 = 1_700_000_000_000;

beforeEach(() => {
  resetAlertThrottle();
});

describe('fingerprint', () => {
  it('agrupa el mismo error aunque cambie el id', () => {
    const a = fingerprint(
      'No existe el sitio 8f2c1d3e-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
      'sites-post'
    );
    const b = fingerprint(
      'No existe el sitio 3b9d7c2a-1e4f-5a6b-7c8d-9e0f1a2b3c4d',
      'sites-post'
    );
    expect(a).toBe(b);
  });

  it('agrupa aunque cambien números, URLs y emails', () => {
    expect(fingerprint('Timeout tras 3000ms')).toBe(fingerprint('Timeout tras 8000ms'));
    expect(fingerprint('Falló POST https://a.com/x')).toBe(
      fingerprint('Falló POST https://b.com/y')
    );
    expect(fingerprint('Sin cuenta para ana@mail.com')).toBe(
      fingerprint('Sin cuenta para juan@otro.com')
    );
  });

  it('separa el mismo mensaje si viene de orígenes distintos', () => {
    expect(fingerprint('Error de conexión', 'checkout')).not.toBe(
      fingerprint('Error de conexión', 'sites-post')
    );
  });

  it('no confunde errores realmente distintos', () => {
    expect(fingerprint('Subdominio en uso', 'sites-post')).not.toBe(
      fingerprint('Plantilla inexistente', 'sites-post')
    );
  });
});

describe('shouldSendAlert — freno por firma', () => {
  it('avisa la primera vez', () => {
    expect(shouldSendAlert('a', T0)).toEqual({
      send: true,
      suppressed: 0,
      droppedByRate: 0,
    });
  });

  it('no repite el mismo error dentro de la ventana', () => {
    shouldSendAlert('a', T0);

    expect(shouldSendAlert('a', T0 + 1000)).toEqual({ send: false });
    expect(shouldSendAlert('a', T0 + ALERT_WINDOW_MS - 1)).toEqual({ send: false });
  });

  it('vuelve a avisar pasada la ventana, informando cuántas se tragó', () => {
    shouldSendAlert('a', T0);
    for (let i = 0; i < 37; i++) shouldSendAlert('a', T0 + 1000 + i);

    const result = shouldSendAlert('a', T0 + ALERT_WINDOW_MS);

    expect(result).toEqual({ send: true, suppressed: 37, droppedByRate: 0 });
  });

  it('el contador de tragadas se reinicia después de avisar', () => {
    shouldSendAlert('a', T0);
    shouldSendAlert('a', T0 + 1000);
    shouldSendAlert('a', T0 + ALERT_WINDOW_MS); // avisa con suppressed: 1

    const result = shouldSendAlert('a', T0 + ALERT_WINDOW_MS * 2);

    expect(result).toEqual({ send: true, suppressed: 0, droppedByRate: 0 });
  });

  it('firmas distintas no se frenan entre sí', () => {
    expect(shouldSendAlert('a', T0).send).toBe(true);
    expect(shouldSendAlert('b', T0).send).toBe(true);
  });
});

describe('shouldSendAlert — tope global por minuto', () => {
  it('corta cuando explotan muchos errores distintos a la vez', () => {
    for (let i = 0; i < ALERT_MAX_PER_RATE_WINDOW; i++) {
      expect(shouldSendAlert(`sig-${i}`, T0).send).toBe(true);
    }

    expect(shouldSendAlert('sig-desbordado', T0)).toEqual({ send: false });
  });

  it('informa los avisos descartados en el primer aviso de la ventana siguiente', () => {
    for (let i = 0; i < ALERT_MAX_PER_RATE_WINDOW; i++) {
      shouldSendAlert(`sig-${i}`, T0);
    }
    shouldSendAlert('descartado-1', T0);
    shouldSendAlert('descartado-2', T0);

    const result = shouldSendAlert('nuevo', T0 + ALERT_RATE_WINDOW_MS);

    expect(result).toEqual({ send: true, suppressed: 0, droppedByRate: 2 });
  });

  it('una firma frenada por el tope global avisa en la ventana siguiente', () => {
    for (let i = 0; i < ALERT_MAX_PER_RATE_WINDOW; i++) {
      shouldSendAlert(`sig-${i}`, T0);
    }
    shouldSendAlert('tarde', T0); // descartada por el tope

    const result = shouldSendAlert('tarde', T0 + ALERT_RATE_WINDOW_MS);

    expect(result.send).toBe(true);
  });
});

describe('buildAlertText', () => {
  it('arma el aviso con origen y mensaje', () => {
    const text = buildAlertText({
      message: 'No se pudo crear la preferencia de pago',
      source: 'checkout',
      suppressed: 0,
      droppedByRate: 0,
    });

    expect(text).toContain('[checkout] No se pudo crear la preferencia de pago');
    expect(text).not.toContain('desde el último aviso');
  });

  it('suma la línea de repetidos cuando las hubo', () => {
    const text = buildAlertText({
      message: 'Timeout',
      source: 'sites-post',
      suppressed: 37,
      droppedByRate: 2,
    });

    expect(text).toContain('+37 iguales desde el último aviso');
    expect(text).toContain('omitidos por tope de frecuencia');
  });

  it('incluye el contexto extra sin repetir el origen', () => {
    const text = buildAlertText({
      message: 'Falló',
      source: 'checkout',
      context: { source: 'checkout', userId: 'u-1', plan: 'pro' },
      suppressed: 0,
      droppedByRate: 0,
    });

    expect(text).toContain('userId: u-1');
    expect(text).toContain('plan: pro');
    // `source` ya va en el encabezado, no se repite como campo suelto.
    expect(text).not.toContain('source: checkout');
  });

  it('recorta el stack a unas pocas líneas', () => {
    const stack = ['Error: x', ...Array.from({ length: 20 }, (_, i) => `    at fn${i}`)].join(
      '\n'
    );

    const text = buildAlertText({
      message: 'x',
      stack,
      suppressed: 0,
      droppedByRate: 0,
    });

    expect(text).toContain('at fn0');
    expect(text).not.toContain('at fn9');
  });

  it('respeta el límite de 4096 caracteres de Telegram', () => {
    const text = buildAlertText({
      message: 'x'.repeat(9000),
      suppressed: 0,
      droppedByRate: 0,
    });

    expect(text.length).toBeLessThanOrEqual(4096);
  });
});

describe('sendTelegramAlert', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('no hace nada si el bot no está configurado', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await sendTelegramAlert('hola');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('postea al endpoint del bot con el chat y el texto', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token-123');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-456');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await sendTelegramAlert('se rompió algo');

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.telegram.org/bottoken-123/sendMessage');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      chat_id: 'chat-456',
      text: 'se rompió algo',
    });
  });

  it('no tira si Telegram responde con error', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token-123');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-456');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));

    await expect(sendTelegramAlert('x')).resolves.toBeUndefined();
  });

  it('no tira si la red falla', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token-123');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-456');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));

    await expect(sendTelegramAlert('x')).resolves.toBeUndefined();
  });
});
