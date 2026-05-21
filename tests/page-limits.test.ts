import { describe, it, expect } from 'vitest';

import { PLAN_PAGE_LIMITS } from '@/lib/constants';

// Verifica la matriz exacta de límites de páginas por plan, contando la
// home inclusive. Si cambian estos números, hay que actualizar también el
// copy de `src/lib/constants.ts > PLANS` y el bloqueo del PagesManager.

describe('PLAN_PAGE_LIMITS', () => {
  it('los números coinciden con lo decidido en el roadmap', () => {
    expect(PLAN_PAGE_LIMITS.basic).toBe(1);
    expect(PLAN_PAGE_LIMITS.test).toBe(1);
    expect(PLAN_PAGE_LIMITS.pro).toBe(5);
    expect(PLAN_PAGE_LIMITS.extremo).toBe(15);
    expect(PLAN_PAGE_LIMITS.personalizado).toBe(Infinity);
  });

  it('basic solo permite la página home (0 adicionales)', () => {
    const pagesUsed = 1; // home
    const remaining = PLAN_PAGE_LIMITS.basic - pagesUsed;
    expect(remaining).toBe(0);
  });

  it('pro permite home + 4 adicionales', () => {
    const remaining = PLAN_PAGE_LIMITS.pro - 1;
    expect(remaining).toBe(4);
  });

  it('extremo permite home + 14 adicionales', () => {
    const remaining = PLAN_PAGE_LIMITS.extremo - 1;
    expect(remaining).toBe(14);
  });
});
