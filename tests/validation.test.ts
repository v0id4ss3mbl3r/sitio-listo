import { describe, it, expect } from 'vitest';

import {
  sanitizeTenantParam,
  validateCustomDomain,
  validateSubdomain,
} from '@/lib/validation';

describe('validateSubdomain', () => {
  it('acepta subdominios válidos', () => {
    expect(validateSubdomain('mi-tienda')).toEqual({
      ok: true,
      value: 'mi-tienda',
    });
    expect(validateSubdomain('cafe123')).toEqual({ ok: true, value: 'cafe123' });
  });

  it('normaliza a minúsculas y trim', () => {
    expect(validateSubdomain('  MiTienda  ')).toEqual({
      ok: true,
      value: 'mitienda',
    });
  });

  it('rechaza menos de 3 caracteres', () => {
    const r = validateSubdomain('ab');
    expect(r.ok).toBe(false);
  });

  it('rechaza más de 63 caracteres', () => {
    const r = validateSubdomain('a'.repeat(64));
    expect(r.ok).toBe(false);
  });

  it('rechaza guion al principio o al final', () => {
    expect(validateSubdomain('-foo').ok).toBe(false);
    expect(validateSubdomain('foo-').ok).toBe(false);
  });

  it('rechaza caracteres inválidos', () => {
    expect(validateSubdomain('foo bar').ok).toBe(false);
    expect(validateSubdomain('foo.bar').ok).toBe(false);
    expect(validateSubdomain('foo_bar').ok).toBe(false);
  });

  it('rechaza subdominios reservados', () => {
    expect(validateSubdomain('app').ok).toBe(false);
    expect(validateSubdomain('admin').ok).toBe(false);
    expect(validateSubdomain('api').ok).toBe(false);
    expect(validateSubdomain('sitiolisto').ok).toBe(false);
  });

  it('rechaza tipos no-string', () => {
    expect(validateSubdomain(123).ok).toBe(false);
    expect(validateSubdomain(null).ok).toBe(false);
    expect(validateSubdomain(undefined).ok).toBe(false);
  });
});

describe('validateCustomDomain', () => {
  it('acepta string vacío como "sin dominio"', () => {
    expect(validateCustomDomain('')).toEqual({ ok: true, value: '' });
    expect(validateCustomDomain(null)).toEqual({ ok: true, value: '' });
    expect(validateCustomDomain(undefined)).toEqual({ ok: true, value: '' });
  });

  it('acepta FQDN válido', () => {
    expect(validateCustomDomain('mitienda.com.ar')).toEqual({
      ok: true,
      value: 'mitienda.com.ar',
    });
    expect(validateCustomDomain('WWW.MITIENDA.COM')).toEqual({
      ok: true,
      value: 'www.mitienda.com',
    });
  });

  it('rechaza single-label (no FQDN)', () => {
    expect(validateCustomDomain('localhost').ok).toBe(false);
    expect(validateCustomDomain('foo').ok).toBe(false);
  });

  it('bloquea dominios propios de la marca', () => {
    expect(validateCustomDomain('sitiolisto.com.ar').ok).toBe(false);
    expect(validateCustomDomain('app.sitiolisto.com.ar').ok).toBe(false);
    expect(validateCustomDomain('mi-tienda.sitiolisto.com.ar').ok).toBe(false);
  });

  it('rechaza string con protocolo o path', () => {
    expect(validateCustomDomain('https://foo.com').ok).toBe(false);
    expect(validateCustomDomain('foo.com/path').ok).toBe(false);
  });
});

describe('sanitizeTenantParam', () => {
  it('acepta subdominios válidos', () => {
    expect(sanitizeTenantParam('mi-tienda')).toBe('mi-tienda');
  });

  it('acepta FQDN válido', () => {
    expect(sanitizeTenantParam('mitienda.com.ar')).toBe('mitienda.com.ar');
  });

  it('devuelve null para entradas con caracteres peligrosos (inyección .or())', () => {
    expect(sanitizeTenantParam('foo,bar')).toBe(null);
    expect(sanitizeTenantParam('foo(eq.xxx')).toBe(null);
    expect(sanitizeTenantParam('foo;DROP')).toBe(null);
    expect(sanitizeTenantParam("foo'")).toBe(null);
  });
});
