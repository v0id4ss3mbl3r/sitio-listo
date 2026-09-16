import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DOMAIN_APEX_IP, DOMAIN_CNAME_TARGET, canUseCustomDomain } from '@/lib/constants';

// Mockeamos el resolver de Node: los tests no salen a internet.
const resolveCname = vi.fn();
const resolve4 = vi.fn();

vi.mock('node:dns/promises', () => ({
  Resolver: class {
    resolveCname = resolveCname;
    resolve4 = resolve4;
  },
}));

const { checkDomainDns } = await import('@/lib/domainDns');

// Cuando un nombre existe pero no tiene el tipo de registro consultado, Node
// tira ENODATA; cuando no existe, ENOTFOUND. En los dos casos no hay match.
function dnsError(code: string) {
  return Object.assign(new Error(`query failed: ${code}`), { code });
}

beforeEach(() => {
  resolveCname.mockReset();
  resolve4.mockReset();
});

describe('checkDomainDns', () => {
  it('verifica cuando el CNAME apunta a nuestro target', async () => {
    resolveCname.mockResolvedValue([DOMAIN_CNAME_TARGET]);

    const result = await checkDomainDns('www.tienda.com.ar');

    expect(result.status).toBe('verified');
    expect(resolve4).not.toHaveBeenCalled();
  });

  it('normaliza el punto final y las mayúsculas del CNAME', async () => {
    resolveCname.mockResolvedValue([`${DOMAIN_CNAME_TARGET.toUpperCase()}.`]);

    const result = await checkDomainDns('www.tienda.com.ar');

    expect(result.status).toBe('verified');
    expect(result.records).toEqual([DOMAIN_CNAME_TARGET]);
  });

  it('verifica el dominio raíz por registro A cuando no hay CNAME', async () => {
    resolveCname.mockRejectedValue(dnsError('ENODATA'));
    resolve4.mockResolvedValue([DOMAIN_APEX_IP]);

    const result = await checkDomainDns('tienda.com.ar');

    expect(result.status).toBe('verified');
    expect(result.records).toEqual([DOMAIN_APEX_IP]);
  });

  it('falla cuando el dominio resuelve a otro lado', async () => {
    resolveCname.mockRejectedValue(dnsError('ENODATA'));
    resolve4.mockResolvedValue(['203.0.113.10']);

    const result = await checkDomainDns('tienda.com.ar');

    expect(result.status).toBe('failed');
    // Le devolvemos al cliente lo que su dominio responde hoy.
    expect(result.records).toEqual(['203.0.113.10']);
  });

  it('falla cuando el CNAME quedó apuntando al hosting anterior', async () => {
    resolveCname.mockResolvedValue(['otro-hosting.com']);
    resolve4.mockRejectedValue(dnsError('ENODATA'));

    const result = await checkDomainDns('www.tienda.com.ar');

    expect(result.status).toBe('failed');
    expect(result.records).toEqual(['otro-hosting.com']);
  });

  it('queda pendiente cuando el dominio todavía no resuelve nada', async () => {
    resolveCname.mockRejectedValue(dnsError('ENOTFOUND'));
    resolve4.mockRejectedValue(dnsError('ENOTFOUND'));

    const result = await checkDomainDns('recien-comprado.com.ar');

    expect(result.status).toBe('pending');
    expect(result.records).toEqual([]);
  });

  it('queda pendiente si el resolver corta por timeout', async () => {
    resolveCname.mockRejectedValue(dnsError('ETIMEOUT'));
    resolve4.mockRejectedValue(dnsError('ETIMEOUT'));

    const result = await checkDomainDns('lento.com.ar');

    expect(result.status).toBe('pending');
  });
});

describe('canUseCustomDomain', () => {
  it('habilita dominio propio en los planes pagos', () => {
    expect(canUseCustomDomain('pro')).toBe(true);
    expect(canUseCustomDomain('extremo')).toBe(true);
    expect(canUseCustomDomain('personalizado')).toBe(true);
  });

  it('no lo habilita en free ni basic', () => {
    expect(canUseCustomDomain('free')).toBe(false);
    expect(canUseCustomDomain('basic')).toBe(false);
    expect(canUseCustomDomain('')).toBe(false);
  });
});
