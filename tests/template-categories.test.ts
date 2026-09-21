import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/constants';

// Este archivo existe por un bug real: la tabla `templates` se creó con un
// CHECK de 5 categorías y nadie lo amplió al sumar plantillas. Los seeds
// fallaban en Supabase con 23514 y las 24 plantillas nuevas nunca llegaron a
// la base, mientras el código de la app las daba por existentes.
//
// El desfase no se veía en ningún test porque vivía entre dos archivos que
// nadie comparaba: constants.ts y el SQL.

const migration = readFileSync(
  path.resolve(__dirname, '../migrations/0025_templates_category_check.sql'),
  'utf8'
);

// Los valores dentro del CHECK (...) de la migración.
//
// Se ancla en ADD CONSTRAINT a propósito: la cabecera del archivo CITA el
// CHECK viejo para explicar el bug, y buscar 'CHECK (category IN (' a secas
// encontraba ese comentario y leía las 5 categorías originales.
function categoriasDeLaMigracion(): string[] {
  const alter = migration.slice(
    migration.indexOf('ADD CONSTRAINT templates_category_check')
  );
  const lista = alter.slice(alter.indexOf('IN ('), alter.indexOf('))'));
  return [...lista.matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
}

describe('templates.category — el CHECK de la base y el código no pueden separarse', () => {
  it('la migración permite exactamente las categorías de TEMPLATE_CATEGORIES', () => {
    const enSql = [...categoriasDeLaMigracion()].sort();
    const enCodigo = TEMPLATE_CATEGORIES.map((c) => c.slug).sort();

    expect(enSql).toEqual(enCodigo);
  });

  it('toda plantilla tiene una categoría que la base va a aceptar', () => {
    const permitidas = new Set(categoriasDeLaMigracion());
    const rechazadas = TEMPLATES.filter((t) => !permitidas.has(t.type));

    expect(rechazadas.map((t) => `${t.id} (${t.type})`)).toEqual([]);
  });

  it('no hay categorías declaradas que ninguna plantilla use', () => {
    const usadas = new Set<string>(TEMPLATES.map((t) => t.type));
    const huerfanas = TEMPLATE_CATEGORIES.filter((c) => !usadas.has(c.slug));

    expect(huerfanas.map((c) => c.slug)).toEqual([]);
  });
});
