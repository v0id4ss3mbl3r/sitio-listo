import { describe, it, expect } from 'vitest';

import { createPageSchema, updatePageSchema } from '@/lib/schemas';

describe('createPageSchema', () => {
  it('acepta payload mínimo válido', () => {
    const r = createPageSchema.safeParse({
      slug: 'contacto',
      title: 'Contactanos',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.content).toEqual({});
      expect(r.data.is_home).toBe(false);
      expect(r.data.is_published).toBe(true);
    }
  });

  it('acepta slug vacío (home)', () => {
    const r = createPageSchema.safeParse({
      slug: '',
      title: 'Inicio',
      is_home: true,
    });
    expect(r.success).toBe(true);
  });

  it('rechaza title vacío', () => {
    const r = createPageSchema.safeParse({ slug: 'foo', title: '' });
    expect(r.success).toBe(false);
  });

  it('rechaza slug con caracteres inválidos', () => {
    expect(createPageSchema.safeParse({ slug: 'Foo Bar', title: 'X' }).success).toBe(false);
    expect(createPageSchema.safeParse({ slug: 'foo/bar', title: 'X' }).success).toBe(false);
    expect(createPageSchema.safeParse({ slug: 'foo.bar', title: 'X' }).success).toBe(false);
    expect(createPageSchema.safeParse({ slug: '-foo', title: 'X' }).success).toBe(false);
    expect(createPageSchema.safeParse({ slug: 'foo-', title: 'X' }).success).toBe(false);
  });

  it('rechaza title más largo que 120 chars', () => {
    const r = createPageSchema.safeParse({
      slug: 'foo',
      title: 'a'.repeat(121),
    });
    expect(r.success).toBe(false);
  });

  it('acepta content arbitrario', () => {
    const r = createPageSchema.safeParse({
      slug: 'foo',
      title: 'Foo',
      content: { body: 'hola', sections: [{ heading: 'h', body: 'b' }] },
    });
    expect(r.success).toBe(true);
  });
});

describe('updatePageSchema', () => {
  it('acepta payload parcial', () => {
    expect(updatePageSchema.safeParse({}).success).toBe(true);
    expect(updatePageSchema.safeParse({ title: 'Otro' }).success).toBe(true);
    expect(updatePageSchema.safeParse({ is_published: false }).success).toBe(true);
  });

  it('valida slug aún en update', () => {
    expect(updatePageSchema.safeParse({ slug: 'NotValid' }).success).toBe(false);
    expect(updatePageSchema.safeParse({ slug: 'ok-slug' }).success).toBe(true);
    expect(updatePageSchema.safeParse({ slug: '' }).success).toBe(true);
  });

  it('rechaza title vacío', () => {
    expect(updatePageSchema.safeParse({ title: '' }).success).toBe(false);
  });
});
