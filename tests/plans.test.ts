import { describe, it, expect } from 'vitest';

import {
  PLAN_PAGE_LIMITS,
  PLAN_SITE_LIMITS,
  PLANS,
  canUseTemplate,
} from '@/lib/constants';

describe('PLANS', () => {
  it('tiene los slugs esperados', () => {
    expect(Object.keys(PLANS).sort()).toEqual(
      ['basic', 'extremo', 'personalizado', 'pro', 'test'].sort()
    );
  });

  it('solo "personalizado" tiene price null (no entra a checkout)', () => {
    expect(PLANS.personalizado.price).toBeNull();
    expect(PLANS.basic.price).toBeGreaterThan(0);
    expect(PLANS.pro.price).toBeGreaterThan(0);
    expect(PLANS.extremo.price).toBeGreaterThan(0);
  });
});

describe('PLAN_PAGE_LIMITS y PLAN_SITE_LIMITS', () => {
  it('los límites de páginas crecen con el tier', () => {
    expect(PLAN_PAGE_LIMITS.basic).toBeLessThan(PLAN_PAGE_LIMITS.pro);
    expect(PLAN_PAGE_LIMITS.pro).toBeLessThan(PLAN_PAGE_LIMITS.extremo);
    expect(PLAN_PAGE_LIMITS.extremo).toBeLessThan(PLAN_PAGE_LIMITS.personalizado);
  });

  it('los límites de sitios independientes: solo Extremo y Personalizado > 1', () => {
    expect(PLAN_SITE_LIMITS.basic).toBe(1);
    expect(PLAN_SITE_LIMITS.pro).toBe(1);
    expect(PLAN_SITE_LIMITS.extremo).toBeGreaterThan(1);
    expect(PLAN_SITE_LIMITS.personalizado).toBe(Infinity);
  });
});

describe('canUseTemplate', () => {
  it('"free" (sin plan) no puede usar ninguna plantilla', () => {
    expect(canUseTemplate('free', 'sabor-urbano')).toBe(false);
    expect(canUseTemplate('', 'sabor-urbano')).toBe(false);
  });

  it('Básico accede a plantillas basic pero NO a pro', () => {
    expect(canUseTemplate('basic', 'sabor-urbano')).toBe(true);
    expect(canUseTemplate('basic', 'portfolio-minimal')).toBe(true);
    expect(canUseTemplate('basic', 'tienda-express')).toBe(false);
  });

  it('Pro/Extremo acceden a todas las plantillas', () => {
    for (const plan of ['pro', 'extremo', 'personalizado']) {
      expect(canUseTemplate(plan, 'sabor-urbano')).toBe(true);
      expect(canUseTemplate(plan, 'tienda-express')).toBe(true);
    }
  });

  it('rechaza template_id desconocido', () => {
    expect(canUseTemplate('extremo', 'no-existe')).toBe(false);
  });
});
