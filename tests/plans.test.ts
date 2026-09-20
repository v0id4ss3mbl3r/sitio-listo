import { describe, it, expect } from 'vitest';

import {
  PLAN_PAGE_LIMITS,
  PLAN_SITE_LIMITS,
  PLANS,
  TEMPLATES,
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
    expect(PLAN_SITE_LIMITS.extremo).toBe(2);
    expect(PLAN_SITE_LIMITS.personalizado).toBe(Infinity);
  });
});

// El copy de PLANS se muestra en la landing y en /cuenta. Si estos números
// dejan de coincidir con el reparto real, le estamos prometiendo al cliente
// algo que canUseTemplate no le entrega.
describe('el copy de los planes coincide con el reparto real', () => {
  const accesibles = (plan: string) =>
    TEMPLATES.filter((t) => canUseTemplate(plan, t.id)).length;

  it('Basic accede a entre 5 y 10 plantillas', () => {
    expect(accesibles('basic')).toBeGreaterThanOrEqual(5);
    expect(accesibles('basic')).toBeLessThanOrEqual(10);
  });

  it('Pro accede a 25, que es lo que dice su copy', () => {
    expect(accesibles('pro')).toBe(25);
    expect(PLANS.pro.features).toContain('Hasta 25 plantillas');
  });

  it('Extremo accede a todas', () => {
    expect(accesibles('extremo')).toBe(TEMPLATES.length);
  });

  it('el acceso es acumulativo: cada tier ve lo del anterior', () => {
    for (const tpl of TEMPLATES) {
      if (canUseTemplate('basic', tpl.id)) {
        expect(canUseTemplate('pro', tpl.id)).toBe(true);
      }
      if (canUseTemplate('pro', tpl.id)) {
        expect(canUseTemplate('extremo', tpl.id)).toBe(true);
      }
    }
  });

  it('Basic ya no dice "todas las plantillas"', () => {
    expect(PLANS.basic.features).toContain('Plantillas básicas de landing page');
    expect(PLANS.basic.features.some((f) => /todas las plantillas/i.test(f))).toBe(false);
  });

  it('Extremo ofrece 2 sitios, no 4', () => {
    expect(PLANS.extremo.features).toContain('Hasta 2 sitios independientes');
  });
});

describe('canUseTemplate', () => {
  it('"free" (sin plan) no puede usar ninguna plantilla', () => {
    expect(canUseTemplate('free', 'sabor-urbano')).toBe(false);
    expect(canUseTemplate('', 'sabor-urbano')).toBe(false);
  });

  it('Básico accede a plantillas basic pero NO a pro ni extremo', () => {
    expect(canUseTemplate('basic', 'sabor-urbano')).toBe(true);
    expect(canUseTemplate('basic', 'portfolio-minimal')).toBe(true);
    expect(canUseTemplate('basic', 'tienda-express')).toBe(false);
    expect(canUseTemplate('basic', 'tienda-catalogo')).toBe(false);
  });

  it('Pro accede a las basic y pro, pero NO a las exclusivas de Extremo', () => {
    expect(canUseTemplate('pro', 'sabor-urbano')).toBe(true);
    expect(canUseTemplate('pro', 'tienda-express')).toBe(true);
    expect(canUseTemplate('pro', 'tienda-catalogo')).toBe(false);
    expect(canUseTemplate('pro', 'inmobiliaria')).toBe(false);
  });

  it('Extremo y Personalizado acceden a todo', () => {
    for (const plan of ['extremo', 'personalizado']) {
      expect(canUseTemplate(plan, 'sabor-urbano')).toBe(true);
      expect(canUseTemplate(plan, 'tienda-express')).toBe(true);
      expect(canUseTemplate(plan, 'tienda-catalogo')).toBe(true);
    }
  });

  it('rechaza template_id desconocido', () => {
    expect(canUseTemplate('extremo', 'no-existe')).toBe(false);
  });
});
