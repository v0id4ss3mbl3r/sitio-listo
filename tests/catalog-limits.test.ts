import { describe, it, expect } from 'vitest';

import {
  PLAN_CATEGORY_LIMITS,
  PLAN_PRODUCT_LIMITS,
  hasCatalogFeature,
} from '@/lib/constants';

describe('PLAN_PRODUCT_LIMITS y PLAN_CATEGORY_LIMITS', () => {
  it('basic no tiene acceso al catálogo (límite 0)', () => {
    expect(PLAN_PRODUCT_LIMITS.basic).toBe(0);
    expect(PLAN_CATEGORY_LIMITS.basic).toBe(0);
  });

  it('pro permite 50 productos y 10 categorías', () => {
    expect(PLAN_PRODUCT_LIMITS.pro).toBe(50);
    expect(PLAN_CATEGORY_LIMITS.pro).toBe(10);
  });

  it('extremo es ilimitado', () => {
    expect(PLAN_PRODUCT_LIMITS.extremo).toBe(Infinity);
    expect(PLAN_CATEGORY_LIMITS.extremo).toBe(Infinity);
  });

  it('personalizado es ilimitado', () => {
    expect(PLAN_PRODUCT_LIMITS.personalizado).toBe(Infinity);
    expect(PLAN_CATEGORY_LIMITS.personalizado).toBe(Infinity);
  });
});

describe('hasCatalogFeature', () => {
  it('basic no tiene ninguna feature', () => {
    expect(hasCatalogFeature('basic', 'banner_custom')).toBe(false);
    expect(hasCatalogFeature('basic', 'featured_products')).toBe(false);
    expect(hasCatalogFeature('basic', 'multiple_images')).toBe(false);
    expect(hasCatalogFeature('basic', 'csv_import')).toBe(false);
  });

  it('pro NO tiene features avanzadas (banner, destacados, galería, CSV)', () => {
    expect(hasCatalogFeature('pro', 'banner_custom')).toBe(false);
    expect(hasCatalogFeature('pro', 'featured_products')).toBe(false);
    expect(hasCatalogFeature('pro', 'multiple_images')).toBe(false);
    expect(hasCatalogFeature('pro', 'csv_import')).toBe(false);
  });

  it('extremo tiene TODAS las features', () => {
    expect(hasCatalogFeature('extremo', 'banner_custom')).toBe(true);
    expect(hasCatalogFeature('extremo', 'featured_products')).toBe(true);
    expect(hasCatalogFeature('extremo', 'multiple_images')).toBe(true);
    expect(hasCatalogFeature('extremo', 'csv_import')).toBe(true);
  });

  it('plan inexistente retorna false', () => {
    expect(hasCatalogFeature('inexistente', 'banner_custom')).toBe(false);
    expect(hasCatalogFeature('', 'banner_custom')).toBe(false);
  });
});
