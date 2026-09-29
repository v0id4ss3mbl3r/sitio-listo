import { describe, it, expect, beforeEach } from 'vitest';

import { clientKey, rateLimit, resetRateLimit } from '@/lib/rateLimit';
import { LIMITES } from '@/lib/api/limit';

const T0 = 1_700_000_000_000;

beforeEach(() => {
  resetRateLimit();
});

const pedir = (key: string, now: number, limit = 3, windowMs = 60_000) =>
  rateLimit({ key, limit, windowMs, now });

describe('rateLimit', () => {
  it('deja pasar hasta el tope y frena el siguiente', () => {
    expect(pedir('a', T0).allowed).toBe(true);
    expect(pedir('a', T0).allowed).toBe(true);
    expect(pedir('a', T0).allowed).toBe(true);
    expect(pedir('a', T0).allowed).toBe(false);
  });

  it('informa cuántos quedan', () => {
    expect(pedir('a', T0).remaining).toBe(2);
    expect(pedir('a', T0).remaining).toBe(1);
    expect(pedir('a', T0).remaining).toBe(0);
  });

  it('el Retry-After nunca es 0 cuando frena', () => {
    for (let i = 0; i < 4; i++) pedir('a', T0);
    // Justo al final de la ventana el resto en ms redondea a 0 segundos, y un
    // Retry-After de 0 le dice al cliente "reintentá ya", que es lo contrario
    // de lo que queremos.
    const alFilo = pedir('a', T0 + 59_999);
    expect(alFilo.allowed).toBe(false);
    expect(alFilo.retryAfter).toBeGreaterThanOrEqual(1);
  });

  it('libera cuando pasa la ventana', () => {
    for (let i = 0; i < 4; i++) pedir('a', T0);
    expect(pedir('a', T0 + 60_000).allowed).toBe(true);
  });

  it('las claves no se pisan entre sí', () => {
    for (let i = 0; i < 4; i++) pedir('a', T0);
    expect(pedir('a', T0).allowed).toBe(false);
    // Otro usuario no paga el cupo del primero.
    expect(pedir('b', T0).allowed).toBe(true);
  });
});

describe('clientKey', () => {
  const req = (headers: Record<string, string>) =>
    new Request('https://sitiolisto.com.ar/api/x', { headers });

  it('con sesión usa el usuario, no la IP', () => {
    // Varias personas detrás de la misma IP (una oficina, el CGNAT de una
    // telefónica) no tienen por qué gastarse el cupo entre sí.
    expect(clientKey(req({ 'x-forwarded-for': '1.2.3.4' }), 'u-1')).toBe('u:u-1');
  });

  it('sin sesión toma la primera IP de x-forwarded-for', () => {
    // La cabecera trae la cadena de proxies: el cliente real es el primero.
    expect(clientKey(req({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1, 10.0.0.2' }))).toBe('ip:1.2.3.4');
  });

  it('cae a x-real-ip y después a un valor fijo', () => {
    expect(clientKey(req({ 'x-real-ip': '5.6.7.8' }))).toBe('ip:5.6.7.8');
    expect(clientKey(req({}))).toBe('ip:desconocida');
  });

  it('dos usuarios distintos dan claves distintas', () => {
    expect(clientKey(req({}), 'u-1')).not.toBe(clientKey(req({}), 'u-2'));
  });
});

describe('los topes configurados', () => {
  it('son positivos y con ventana de al menos un minuto', () => {
    for (const [nombre, cfg] of Object.entries(LIMITES)) {
      expect(cfg.limit, nombre).toBeGreaterThan(0);
      expect(cfg.windowMs, nombre).toBeGreaterThanOrEqual(60_000);
    }
  });

  it('el checkout es el más restrictivo: cada intento llama a MercadoPago', () => {
    expect(LIMITES.checkout.limit).toBeLessThan(LIMITES.subdomainCheck.limit);
    expect(LIMITES.checkout.limit).toBeLessThan(LIMITES.guardarSitio.limit);
  });

  it('el chequeo de subdominio tolera el debounce del editor', () => {
    // El editor lo llama mientras se escribe: un tope bajo rompería el uso
    // normal en vez de frenar un abuso.
    expect(LIMITES.subdomainCheck.limit).toBeGreaterThanOrEqual(30);
  });
});
