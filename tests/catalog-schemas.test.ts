import { describe, it, expect } from 'vitest';

import {
  createCategorySchema,
  createProductSchema,
  updateProductSchema,
  updateStoreSettingsSchema,
} from '@/lib/schemas';

describe('createCategorySchema', () => {
  it('acepta payload válido', () => {
    const r = createCategorySchema.safeParse({ name: 'Indumentaria', slug: 'indumentaria' });
    expect(r.success).toBe(true);
  });

  it('rechaza slug con caracteres inválidos', () => {
    expect(createCategorySchema.safeParse({ name: 'X', slug: 'NoValido' }).success).toBe(false);
    expect(createCategorySchema.safeParse({ name: 'X', slug: 'con espacio' }).success).toBe(false);
  });

  it('rechaza name vacío', () => {
    expect(createCategorySchema.safeParse({ name: '', slug: 'foo' }).success).toBe(false);
  });
});

describe('createProductSchema', () => {
  it('acepta payload mínimo', () => {
    const r = createProductSchema.safeParse({
      name: 'Camisa azul',
      slug: 'camisa-azul',
      price: 15000,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.in_stock).toBe(true);
      expect(r.data.is_featured).toBe(false);
      expect(r.data.image_urls).toEqual([]);
    }
  });

  it('rechaza precio negativo', () => {
    const r = createProductSchema.safeParse({
      name: 'X',
      slug: 'x',
      price: -1,
    });
    expect(r.success).toBe(false);
  });

  it('rechaza image_url no-https', () => {
    const r = createProductSchema.safeParse({
      name: 'X',
      slug: 'x',
      price: 100,
      image_url: 'ftp://foo.com/img.png',
    });
    expect(r.success).toBe(false);
  });

  it('acepta image_url null', () => {
    const r = createProductSchema.safeParse({
      name: 'X',
      slug: 'x',
      price: 100,
      image_url: null,
    });
    expect(r.success).toBe(true);
  });

  it('rechaza más de 8 imágenes en galería', () => {
    const urls = Array.from({ length: 9 }, (_, i) => `https://img.com/${i}.jpg`);
    const r = createProductSchema.safeParse({
      name: 'X',
      slug: 'x',
      price: 100,
      image_urls: urls,
    });
    expect(r.success).toBe(false);
  });

  it('rechaza category_id no-uuid', () => {
    const r = createProductSchema.safeParse({
      name: 'X',
      slug: 'x',
      price: 100,
      category_id: 'not-a-uuid',
    });
    expect(r.success).toBe(false);
  });
});

describe('updateProductSchema', () => {
  it('acepta payload parcial', () => {
    expect(updateProductSchema.safeParse({}).success).toBe(true);
    expect(updateProductSchema.safeParse({ price: 200 }).success).toBe(true);
    expect(updateProductSchema.safeParse({ in_stock: false }).success).toBe(true);
  });
});

describe('updateStoreSettingsSchema', () => {
  it('acepta theme_color hex válido', () => {
    expect(updateStoreSettingsSchema.safeParse({ theme_color: '#ff0000' }).success).toBe(true);
    expect(updateStoreSettingsSchema.safeParse({ theme_color: '#FFAA00' }).success).toBe(true);
  });

  it('rechaza theme_color inválido', () => {
    expect(updateStoreSettingsSchema.safeParse({ theme_color: 'red' }).success).toBe(false);
    expect(updateStoreSettingsSchema.safeParse({ theme_color: '#fff' }).success).toBe(false);
  });

  it('acepta whatsapp_numbers válidos', () => {
    const r = updateStoreSettingsSchema.safeParse({
      whatsapp_numbers: [
        { id: '1', label: 'Ventas', phone: '5492235922077' },
      ],
    });
    expect(r.success).toBe(true);
  });

  it('rechaza whatsapp phone con caracteres no-dígitos', () => {
    const r = updateStoreSettingsSchema.safeParse({
      whatsapp_numbers: [{ id: '1', label: 'Ventas', phone: '+54 9 223...' }],
    });
    expect(r.success).toBe(false);
  });

  it('rechaza más de 3 vendedores', () => {
    const r = updateStoreSettingsSchema.safeParse({
      whatsapp_numbers: Array.from({ length: 4 }, (_, i) => ({
        id: String(i),
        label: 'Ventas',
        phone: '5492235922077',
      })),
    });
    expect(r.success).toBe(false);
  });
});
