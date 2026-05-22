import { describe, it, expect } from 'vitest';

import {
  adminUpdateSiteSchema,
  adminUpdateSubscriptionSchema,
  adminUpdateTemplateSchema,
  blockUserSchema,
  notifyUserSchema,
  setPasswordSchema,
} from '@/lib/schemas';

describe('blockUserSchema', () => {
  it('acepta ISO datetime válido', () => {
    const r = blockUserSchema.safeParse({ until: '2026-12-31T23:59:59.000Z' });
    expect(r.success).toBe(true);
  });

  it('rechaza string que no sea datetime ISO', () => {
    expect(blockUserSchema.safeParse({ until: 'mañana' }).success).toBe(false);
    expect(blockUserSchema.safeParse({ until: '2026-12-31' }).success).toBe(false);
  });

  it('acepta razón opcional', () => {
    const r = blockUserSchema.safeParse({
      until: '2026-12-31T23:59:59.000Z',
      reason: 'Spam reiterado',
    });
    expect(r.success).toBe(true);
  });

  it('rechaza razón demasiado larga', () => {
    const r = blockUserSchema.safeParse({
      until: '2026-12-31T23:59:59.000Z',
      reason: 'a'.repeat(501),
    });
    expect(r.success).toBe(false);
  });
});

describe('notifyUserSchema', () => {
  it('acepta payload válido', () => {
    expect(notifyUserSchema.safeParse({ title: 'Hola', body: 'Cuerpo' }).success).toBe(true);
  });

  it('rechaza title vacío', () => {
    expect(notifyUserSchema.safeParse({ title: '', body: 'x' }).success).toBe(false);
  });

  it('rechaza body vacío', () => {
    expect(notifyUserSchema.safeParse({ title: 'x', body: '' }).success).toBe(false);
  });

  it('rechaza title > 120 chars', () => {
    expect(
      notifyUserSchema.safeParse({ title: 'a'.repeat(121), body: 'x' }).success
    ).toBe(false);
  });
});

describe('setPasswordSchema', () => {
  it('acepta password de 8+ chars', () => {
    expect(setPasswordSchema.safeParse({ password: '12345678' }).success).toBe(true);
  });

  it('rechaza password < 8 chars', () => {
    expect(setPasswordSchema.safeParse({ password: '1234567' }).success).toBe(false);
  });

  it('rechaza password > 72 chars', () => {
    expect(setPasswordSchema.safeParse({ password: 'a'.repeat(73) }).success).toBe(false);
  });
});

describe('adminUpdateSiteSchema', () => {
  it('acepta payload parcial', () => {
    expect(adminUpdateSiteSchema.safeParse({}).success).toBe(true);
    expect(adminUpdateSiteSchema.safeParse({ is_banned: true }).success).toBe(true);
    expect(adminUpdateSiteSchema.safeParse({ subdomain: 'nueva-tienda' }).success).toBe(true);
  });

  it('acepta custom_domain null', () => {
    expect(adminUpdateSiteSchema.safeParse({ custom_domain: null }).success).toBe(true);
  });

  it('rechaza subdomain < 3 chars', () => {
    expect(adminUpdateSiteSchema.safeParse({ subdomain: 'ab' }).success).toBe(false);
  });
});

describe('adminUpdateSubscriptionSchema', () => {
  it('acepta status válido', () => {
    for (const status of ['authorized', 'paused', 'cancelled', 'pending']) {
      expect(adminUpdateSubscriptionSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it('rechaza status inválido', () => {
    expect(adminUpdateSubscriptionSchema.safeParse({ status: 'foo' }).success).toBe(false);
  });
});

describe('adminUpdateTemplateSchema', () => {
  it('acepta payload parcial', () => {
    expect(adminUpdateTemplateSchema.safeParse({}).success).toBe(true);
    expect(adminUpdateTemplateSchema.safeParse({ is_active: false }).success).toBe(true);
  });

  it('acepta tags válidos', () => {
    expect(
      adminUpdateTemplateSchema.safeParse({ tags: ['gastronomia', 'premium'] }).success
    ).toBe(true);
  });

  it('rechaza más de 20 tags', () => {
    const tags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
    expect(adminUpdateTemplateSchema.safeParse({ tags }).success).toBe(false);
  });

  it('rechaza category inválida', () => {
    expect(
      adminUpdateTemplateSchema.safeParse({ category: 'no-existe' }).success
    ).toBe(false);
  });

  it('acepta min_plan null (quitar restricción)', () => {
    expect(adminUpdateTemplateSchema.safeParse({ min_plan: null }).success).toBe(true);
  });
});
