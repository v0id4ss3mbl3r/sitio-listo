import { describe, it, expect } from 'vitest';

import { checkoutSchema, createSiteSchema } from '@/lib/schemas';

describe('createSiteSchema', () => {
  it('acepta payload válido', () => {
    const r = createSiteSchema.safeParse({
      subdomain: 'mi-tienda',
      custom_domain: null,
      template_id: 'sabor-urbano',
      config: { name: 'Mi Tienda' },
    });
    expect(r.success).toBe(true);
  });

  it('acepta name opcional', () => {
    const r = createSiteSchema.safeParse({
      subdomain: 'mi-tienda',
      template_id: 'sabor-urbano',
      name: 'Mi Tienda',
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe('Mi Tienda');
  });

  it('name puede estar ausente', () => {
    const r = createSiteSchema.safeParse({
      subdomain: 'mi-tienda',
      template_id: 'sabor-urbano',
    });
    expect(r.success).toBe(true);
  });

  it('rechaza subdomain vacío', () => {
    const r = createSiteSchema.safeParse({
      subdomain: '',
      template_id: 'sabor-urbano',
    });
    expect(r.success).toBe(false);
  });

  it('rechaza template_id ausente', () => {
    const r = createSiteSchema.safeParse({ subdomain: 'mi-tienda' });
    expect(r.success).toBe(false);
  });

  it('rechaza tipos incorrectos', () => {
    const r = createSiteSchema.safeParse({
      subdomain: 123,
      template_id: 'foo',
    });
    expect(r.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('acepta planes válidos del checkout', () => {
    for (const planSlug of ['basic', 'pro', 'extremo', 'test']) {
      const r = checkoutSchema.safeParse({ planSlug });
      expect(r.success).toBe(true);
    }
  });

  it('rechaza "personalizado" (no entra al checkout)', () => {
    const r = checkoutSchema.safeParse({ planSlug: 'personalizado' });
    expect(r.success).toBe(false);
  });

  it('rechaza slug desconocido', () => {
    const r = checkoutSchema.safeParse({ planSlug: 'agency' });
    expect(r.success).toBe(false);
  });
});
