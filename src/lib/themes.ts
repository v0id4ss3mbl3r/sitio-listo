/* ─────────────────────────────────────────────────────────────────────────
 * Contrato de Temas — SitioListo
 *
 * Vocabulario único de tokens de diseño que pueden consumir DOS capas:
 *
 *   1. Superficies propias (landing + panel admin): vía `themeToCssVars()`,
 *      que vuelca el tema a los nombres de CSS custom properties que
 *      globals.css ya usa (--color-primary, --bg-card, --shadow-card, ...).
 *
 *   2. Plantillas de clientes ([domain]/templates/*): reciben el objeto
 *      `Theme` como prop y derivan sus estilos de `theme.tokens` en vez de
 *      tener los valores hardcodeados.
 *
 * IMPORTANTE: este archivo es solo el CONTRATO + los PRESETS. Todavía no
 * está enchufado a ninguna superficie — agregarlo no cambia nada del render
 * actual. La aplicación a cada capa es un paso posterior.
 *
 * Quién elige el tema: por ahora es decisión de admin (no hay selector de
 * cliente en el editor). Ver DEFAULT_THEME_ID y TEMPLATE_DEFAULT_THEME abajo.
 * ───────────────────────────────────────────────────────────────────────── */

/** Tratamiento de superficie: 'glow' usa gradientes + sombras con halo;
 *  'flat' usa colores sólidos + sombras planas/sutiles. */
export type SurfaceStyle = 'glow' | 'flat';

/** Esquema de color base de la superficie raíz. */
export type ColorMode = 'light' | 'dark';

/** Identificadores estables de los presets. Si esto se persiste en DB
 *  (theme_id), mantener estos strings inmutables. */
export type ThemeId = 'oficina' | 'glow' | 'vivo';

/**
 * Tokens de diseño de un tema. Todos los valores son strings/primitivos
 * serializables, para poder volcarlos directo a CSS custom properties.
 */
export interface ThemeTokens {
  /* ── Paleta de marca ── */
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;

  /* ── Capas de fondo (de más al fondo a la card) ── */
  bgBase: string;
  bgSubtle: string;
  bgCard: string;
  bgCardHover: string;

  /* ── Texto ── */
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  /* ── Bordes ── */
  borderSubtle: string;
  borderHover: string;

  /* ── Tratamiento de superficie ──
   * `surface` y `useGradients` son los switches semánticos que distinguen
   * un tema "glowie" de uno "oficina". Los valores resueltos (gradientHero,
   * gradientGlow, sombras) ya vienen calculados para no recomputar en cada
   * componente. */
  surface: SurfaceStyle;
  useGradients: boolean;
  /** Gradiente del headline principal. Si useGradients=false, es un color sólido. */
  gradientHero: string;
  /** Halo de fondo decorativo. Si surface='flat', suele ser 'transparent'. */
  gradientGlow: string;

  /* ── Sombras ── */
  shadowCard: string;
  shadowElevated: string;
  /** Halo de glow en hover/CTA. 'none' en temas flat. */
  shadowGlow: string;

  /* ── Escala de radios ── */
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;

  /* ── Tipografía ──
   * Valores de font-family completos que referencian las vars de fuente ya
   * cargadas en layout.tsx (--font-serif, --font-inter, --font-geist-sans). */
  fontHeading: string;
  fontBody: string;
  headingItalic: boolean;
  /** Peso del heading (900 para impacto, 700 para editorial sobrio). */
  headingWeight: number;
}

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  /** Esquema base — define si la superficie raíz es clara u oscura. */
  mode: ColorMode;
  tokens: ThemeTokens;
}

/* ─────────────────────────────────────────────────────────────────────────
 * PRESETS
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * OFICINA — el look minimal/warm que mantenemos en la página oficial.
 * Sólidos, sombras planas, serif para títulos, papel crema / carbón cálido.
 * Espejo de los tokens actuales de globals.css (:root).
 */
const OFICINA: Theme = {
  id: 'oficina',
  label: 'Oficina',
  description: 'Minimal y cálido: colores sólidos, sombras planas, títulos serif. El look de la página oficial.',
  mode: 'light',
  tokens: {
    primary: '#8B6F3F',
    primaryLight: '#A88656',
    primaryDark: '#6B5530',
    secondary: '#5C7060',
    accent: '#B8956A',

    bgBase: '#FAF8F2',
    bgSubtle: '#F4F1E8',
    bgCard: '#FFFFFF',
    bgCardHover: '#FAF8F2',

    textPrimary: '#2A2A24',
    textSecondary: '#5C5C52',
    textMuted: '#8B8B7E',

    borderSubtle: 'rgba(42, 42, 36, 0.10)',
    borderHover: 'rgba(139, 111, 63, 0.30)',

    surface: 'flat',
    useGradients: false,
    gradientHero: '#8B6F3F',
    gradientGlow: 'transparent',

    shadowCard: '0 1px 3px rgba(42, 42, 36, 0.04)',
    shadowElevated: '0 4px 16px rgba(42, 42, 36, 0.06)',
    shadowGlow: 'none',

    radiusSm: '0.5rem',
    radiusMd: '0.75rem',
    radiusLg: '1rem',
    radiusXl: '1.5rem',

    fontHeading: "var(--font-serif), Georgia, serif",
    fontBody: "var(--font-inter), system-ui, sans-serif",
    headingItalic: true,
    headingWeight: 700,
  },
};

/**
 * GLOW — dark/tech con gradientes y halos. La estética de LandingPro:
 * fondo slate, indigo→ámbar en botones y headline, sombras con glow.
 */
const GLOW: Theme = {
  id: 'glow',
  label: 'Glow',
  description: 'Oscuro y vibrante: gradientes indigo/ámbar, halos de glow, títulos en sans pesado e itálico.',
  mode: 'dark',
  tokens: {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#f59e0b',
    accent: '#a855f7',

    bgBase: '#0f172a',
    bgSubtle: '#111c34',
    bgCard: 'rgba(255,255,255,0.03)',
    bgCardHover: 'rgba(255,255,255,0.05)',

    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',

    borderSubtle: 'rgba(99, 102, 241, 0.15)',
    borderHover: 'rgba(99, 102, 241, 0.40)',

    surface: 'glow',
    useGradients: true,
    gradientHero: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f59e0b 100%)',
    gradientGlow: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)',

    shadowCard: '0 8px 24px -8px rgba(0, 0, 0, 0.5)',
    shadowElevated: '0 32px 60px -12px rgba(99, 102, 241, 0.35)',
    shadowGlow: '0 0 24px rgba(99, 102, 241, 0.45)',

    radiusSm: '0.625rem',
    radiusMd: '1rem',
    radiusLg: '1.25rem',
    radiusXl: '2rem',

    fontHeading: "var(--font-inter), system-ui, sans-serif",
    fontBody: "var(--font-inter), system-ui, sans-serif",
    headingItalic: true,
    headingWeight: 900,
  },
};

/**
 * VIVO — claro y colorido, sobre fondo blanco. Para tienda/portfolio:
 * gradientes alegres en cards, acentos fucsia/ámbar, sombras suaves con tinte.
 */
const VIVO: Theme = {
  id: 'vivo',
  label: 'Vivo',
  description: 'Claro y colorido: gradientes alegres sobre blanco, acentos fucsia/ámbar. Ideal para tienda y portfolio.',
  mode: 'light',
  tokens: {
    primary: '#db2777',
    primaryLight: '#ec4899',
    primaryDark: '#be185d',
    secondary: '#f59e0b',
    accent: '#8b5cf6',

    bgBase: '#ffffff',
    bgSubtle: '#fdf2f8',
    bgCard: '#ffffff',
    bgCardHover: '#fdf2f8',

    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',

    borderSubtle: 'rgba(17, 24, 39, 0.08)',
    borderHover: 'rgba(219, 39, 119, 0.35)',

    surface: 'glow',
    useGradients: true,
    gradientHero: 'linear-gradient(135deg, #db2777 0%, #8b5cf6 100%)',
    gradientGlow: 'radial-gradient(circle, rgba(219,39,119,0.10) 0%, transparent 65%)',

    shadowCard: '0 4px 16px rgba(17, 24, 39, 0.06)',
    shadowElevated: '0 20px 40px -12px rgba(219, 39, 119, 0.20)',
    shadowGlow: '0 0 20px rgba(219, 39, 119, 0.30)',

    radiusSm: '0.625rem',
    radiusMd: '1rem',
    radiusLg: '1.25rem',
    radiusXl: '1.75rem',

    fontHeading: "var(--font-serif), Georgia, serif",
    fontBody: "var(--font-inter), system-ui, sans-serif",
    headingItalic: true,
    headingWeight: 700,
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * Registro y helpers
 * ───────────────────────────────────────────────────────────────────────── */

export const THEMES: Record<ThemeId, Theme> = {
  oficina: OFICINA,
  glow: GLOW,
  vivo: VIVO,
};

export const THEME_LIST: Theme[] = [OFICINA, GLOW, VIVO];

/** Tema por defecto de las superficies propias (landing/admin). */
export const DEFAULT_THEME_ID: ThemeId = 'oficina';

/**
 * Tema por defecto de cada plantilla de cliente (decisión de admin/diseño).
 * Conserva el look actual de cada una para que enchufar el sistema no cambie
 * la apariencia hasta que se decida lo contrario.
 */
export const TEMPLATE_DEFAULT_THEME: Record<string, ThemeId> = {
  'landing-pro': 'glow',
  'portfolio-minimal': 'oficina',
  'servicios-pro': 'oficina',
  'tienda-express': 'vivo',
  'tienda-catalogo': 'vivo',
  'sabor-urbano': 'glow',
};

/** Resuelve un id (posiblemente inválido/ausente) a un Theme concreto. */
export function getTheme(id?: string | null): Theme {
  if (id && id in THEMES) return THEMES[id as ThemeId];
  return THEMES[DEFAULT_THEME_ID];
}

/**
 * Vuelca un tema a las CSS custom properties que globals.css ya consume.
 * Pensado para inyectarse en un style/atributo de la superficie propia
 * (landing/admin) sin tener que renombrar variables existentes.
 *
 * Devuelve un objeto apto para `style={...}` de React o para serializar.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const t = theme.tokens;
  return {
    '--color-primary': t.primary,
    '--color-primary-light': t.primaryLight,
    '--color-primary-dark': t.primaryDark,
    '--color-secondary': t.secondary,
    '--color-accent': t.accent,

    '--bg-dark': t.bgBase,
    '--bg-dark-secondary': t.bgSubtle,
    '--bg-card': t.bgCard,
    '--bg-card-hover': t.bgCardHover,

    '--text-primary': t.textPrimary,
    '--text-secondary': t.textSecondary,
    '--text-muted': t.textMuted,

    '--border-subtle': t.borderSubtle,
    '--border-hover': t.borderHover,

    '--gradient-primary': t.useGradients ? t.gradientHero : t.primary,
    '--gradient-hero': t.gradientHero,
    '--gradient-glow': t.gradientGlow,

    '--shadow-card': t.shadowCard,
    '--shadow-elevated': t.shadowElevated,
    '--shadow-glow': t.shadowGlow === 'none' ? '0 0 0 0 transparent' : t.shadowGlow,

    '--radius-sm': t.radiusSm,
    '--radius-md': t.radiusMd,
    '--radius-lg': t.radiusLg,
    '--radius-xl': t.radiusXl,

    '--background': t.bgBase,
    '--foreground': t.textPrimary,
    '--font-heading': t.fontHeading,
  };
}

/**
 * Genera el bloque CSS `:root { ... }` que aplica un tema a las superficies
 * propias (landing + panel), pensado para inyectarse en un <style> del layout
 * raíz DESPUÉS del import de globals.css (así gana por orden de cascada).
 *
 * El tema por defecto (oficina) devuelve '' a propósito: no inyecta nada y la
 * app queda EXACTAMENTE como hoy, conservando el toggle claro/oscuro de
 * globals.css (:root / .dark). Los demás temas sí pisan el set completo de
 * variables (incluido fondo), por eso se ven netamente distintos.
 */
export function themeRootCss(theme: Theme): string {
  if (theme.id === DEFAULT_THEME_ID) return '';
  const vars = themeToCssVars(theme);
  const decls = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  return `:root{${decls}}`;
}
