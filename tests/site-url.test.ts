import { describe, it, expect } from 'vitest';

import { CANONICAL_SITE_URL, resolveSiteUrl } from '@/lib/env';

// SITE_URL termina en el sitemap y en robots.txt. Si sale mal, el deploy
// funciona igual y el error solo se nota cuando Google no indexa nada.
describe('resolveSiteUrl', () => {
  it('usa la variable de entorno cuando es válida', () => {
    expect(resolveSiteUrl('https://sitiolisto.com.ar', true)).toBe('https://sitiolisto.com.ar');
  });

  it('saca la barra final para no generar URLs con doble barra', () => {
    expect(resolveSiteUrl('https://sitiolisto.com.ar/', true)).toBe('https://sitiolisto.com.ar');
  });

  it('en desarrollo respeta localhost', () => {
    expect(resolveSiteUrl('http://localhost:3000', false)).toBe('http://localhost:3000');
  });

  it('en producción NO publica una URL local', () => {
    for (const local of [
      'http://localhost:3000',
      'http://localhost',
      'http://127.0.0.1:3000',
      'https://localhost:3000',
    ]) {
      expect(resolveSiteUrl(local, true)).toBe(CANONICAL_SITE_URL);
    }
  });

  it('cae al dominio oficial si la variable falta o está vacía', () => {
    expect(resolveSiteUrl(undefined, true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('   ', false)).toBe(CANONICAL_SITE_URL);
  });

  it('no confunde un dominio real que contenga "localhost"', () => {
    // El guard mira el host completo, no una subcadena.
    expect(resolveSiteUrl('https://localhost.sitiolisto.com.ar', true)).toBe(
      'https://localhost.sitiolisto.com.ar'
    );
  });
});
