import { describe, it, expect } from 'vitest';

import {
  BORDER_WIDTHS,
  BRAND_COLORS,
  BRAND_FONTS,
  THEMES,
  THEME_LIST,
  applyThemeOverride,
  getTheme,
} from '@/lib/themes';

const kiosco = getTheme('kiosco');
const glow = getTheme('glow');

describe('applyThemeOverride', () => {
  it('sin override devuelve el MISMO objeto, no una copia', () => {
    // No es un detalle: themeRootCss usa esta identidad para saber si el tema
    // por defecto está sin tocar y puede saltarse la inyección de CSS.
    expect(applyThemeOverride(kiosco, undefined)).toBe(kiosco);
    expect(applyThemeOverride(kiosco, {})).toBe(kiosco);
  });

  it('nunca muta el preset original', () => {
    const primarioOriginal = kiosco.tokens.primary;
    applyThemeOverride(kiosco, { primary: 'coral' });
    expect(THEMES.kiosco.tokens.primary).toBe(primarioOriginal);
  });

  it('cambiar el primario arrastra sus variantes claras y oscuras', () => {
    const r = applyThemeOverride(kiosco, { primary: 'coral' });
    const coral = BRAND_COLORS.find((c) => c.id === 'coral')!.hex;

    expect(r.tokens.primary).toBe(coral);
    // Sin esto quedaban el light y el dark del color anterior.
    expect(r.tokens.primaryLight).not.toBe(kiosco.tokens.primaryLight);
    expect(r.tokens.primaryDark).not.toBe(kiosco.tokens.primaryDark);
  });

  it('el fondo del hero sigue al primario cuando eran el mismo color', () => {
    // Kiosco apoya el hero sobre su primario: si cambia uno tiene que cambiar
    // el otro, o queda una banda del color viejo.
    expect(kiosco.tokens.heroSurface).toBe(kiosco.tokens.primary);

    const r = applyThemeOverride(kiosco, { primary: 'verde' });
    expect(r.tokens.heroSurface).toBe(r.tokens.primary);
  });

  it('el acento del hero sigue al secundario cuando eran el mismo color', () => {
    expect(kiosco.tokens.heroAccent).toBe(kiosco.tokens.secondary);

    const r = applyThemeOverride(kiosco, { secondary: 'violeta' });
    expect(r.tokens.heroAccent).toBe(r.tokens.secondary);
  });

  it('no arrastra valores que NO coincidían con el color cambiado', () => {
    // El acento del hero de Kiosco es el secundario, no el primario: cambiar
    // el primario no debe tocarlo.
    const r = applyThemeOverride(kiosco, { primary: 'fucsia' });
    expect(r.tokens.heroAccent).toBe(kiosco.tokens.heroAccent);
  });

  it('aplica tipografías y ancho de borde desde las listas cerradas', () => {
    const r = applyThemeOverride(kiosco, {
      fontHeading: 'serif',
      fontBody: 'inter',
      borderWidth: 'none',
    });

    expect(r.tokens.fontHeading).toBe(BRAND_FONTS.find((f) => f.id === 'serif')!.stack);
    expect(r.tokens.fontBody).toBe(BRAND_FONTS.find((f) => f.id === 'inter')!.stack);
    expect(r.tokens.borderWidth).toBe(BORDER_WIDTHS.find((b) => b.id === 'none')!.value);
  });

  it('pasar un tema a plano le apaga el halo', () => {
    expect(glow.tokens.surface).toBe('glow');
    expect(glow.tokens.gradientGlow).not.toBe('transparent');

    const r = applyThemeOverride(glow, { surface: 'flat' });
    // Un tema plano no puede quedarse con un halo dibujado.
    expect(r.tokens.gradientGlow).toBe('transparent');
  });

  it('los degradés se prenden y apagan, incluido apagarlos en Glow', () => {
    expect(applyThemeOverride(kiosco, { useGradients: true }).tokens.useGradients).toBe(true);
    // `false` es un valor válido, no "sin definir": si esto se rompe, apagar
    // los degradés en Glow no haría nada.
    expect(applyThemeOverride(glow, { useGradients: false }).tokens.useGradients).toBe(false);
  });

  it('ignora un id que no está en la lista en vez de romper el tema', () => {
    const r = applyThemeOverride(kiosco, {
      // @ts-expect-error — simula una fila vieja en la base con un id retirado
      primary: 'un-color-que-no-existe',
    });
    expect(r.tokens.primary).toBe(kiosco.tokens.primary);
  });
});

describe('las listas cerradas', () => {
  it('no tienen ids repetidos', () => {
    for (const lista of [BRAND_COLORS, BRAND_FONTS, BORDER_WIDTHS]) {
      const ids = lista.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('todos los colores son hex de 6 dígitos', () => {
    for (const c of BRAND_COLORS) {
      expect(c.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('todas las fuentes apuntan a una var que el layout carga', () => {
    // next/font resuelve en build: una familia que no esté en layout.tsx
    // silenciosamente cae al fallback.
    for (const f of BRAND_FONTS) {
      expect(f.stack).toMatch(/^var\(--font-[a-z-]+\)/);
    }
  });

  it('cada preset se puede personalizar sin quedar a medias', () => {
    // Recorre los seis: si un preset le falta un token que el override toca,
    // esto lo caza.
    for (const t of THEME_LIST) {
      const r = applyThemeOverride(t, { primary: 'azul', borderWidth: 'thick' });
      expect(r.tokens.primary).toBe('#2340E8');
      expect(r.tokens.borderWidth).toBe('2px');
      expect(r.id).toBe(t.id);
    }
  });
});
