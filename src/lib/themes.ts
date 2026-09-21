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
export type ThemeId =
  | 'oficina'
  | 'glow'
  | 'vivo'
  | 'taller'
  | 'kiosco'
  | 'estudio';

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
  /** Ancho de borde de cards y botones. '1px' en casi todos; '2px' en Kiosco,
   *  donde el borde grueso ES la identidad. */
  borderWidth: string;

  /* ── Banda del hero ──
   * Kiosco apoya el hero sobre un bloque de color plano; el resto de los
   * temas lo dejan sobre el fondo de la página. Sin estos tokens habría que
   * elegir entre una estructura que sirve a Kiosco o una que sirve al resto. */
  heroSurface: string;
  heroText: string;
  heroTextMuted: string;
  /** Color del CTA principal y del badge SOBRE la banda del hero.
   *  Kiosco apoya el hero en su color primario, así que ahí el CTA no puede
   *  ser primario también: usa el secundario. En los temas cuyo hero va sobre
   *  el fondo de página, el CTA sí es el primario. Sin este token el Hero
   *  usaba --color-secondary para todos y mezclaba paletas. */
  heroAccent: string;
  heroAccentText: string;

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
    heroSurface: '#FAF8F2',
    heroText: '#2A2A24',
    heroTextMuted: '#5C5C52',
    heroAccent: '#8B6F3F',
    heroAccentText: '#FFFFFF',
    borderWidth: '1px',

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
    heroSurface: '#0F172A',
    heroText: '#F8FAFC',
    heroTextMuted: '#94A3B8',
    heroAccent: '#6366f1',
    heroAccentText: '#FFFFFF',
    borderWidth: '1px',

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
    heroSurface: '#FFFFFF',
    heroText: '#111827',
    heroTextMuted: '#4B5563',
    heroAccent: '#db2777',
    heroAccentText: '#FFFFFF',
    borderWidth: '1px',

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

/**
 * KIOSCO — el look oficial de SitioListo desde 2026.
 * Popular y de alto contraste: azul y amarillo planos, bordes de 2px y
 * sombras duras SIN blur (el offset es la sombra). Un único radio en todos
 * los componentes: esa uniformidad es parte de la identidad, no un descuido.
 */
const KIOSCO: Theme = {
  id: 'kiosco',
  label: 'Kiosco',
  description: 'Popular y de alto contraste: azul y amarillo planos, bordes gruesos y sombras duras. El look oficial.',
  mode: 'light',
  tokens: {
    primary: '#2340E8',
    primaryLight: '#4C64F0',
    primaryDark: '#1B33C7',
    secondary: '#FFCC00',
    accent: '#FFCC00',

    bgBase: '#FFFFFF',
    bgSubtle: '#F4F5FA',
    bgCard: '#FFFFFF',
    bgCardHover: '#F4F5FA',

    textPrimary: '#0A0A0A',
    textSecondary: '#444444',
    textMuted: '#6B6B6B',

    borderSubtle: '#0A0A0A',
    borderHover: '#2340E8',
    heroSurface: '#2340E8',
    heroText: '#FFFFFF',
    heroTextMuted: 'rgba(255, 255, 255, 0.92)',
    heroAccent: '#FFCC00',
    heroAccentText: '#0A0A0A',
    borderWidth: '2px',

    surface: 'flat',
    useGradients: false,
    gradientHero: '#2340E8',
    gradientGlow: 'transparent',

    // Sombra dura: desplazamiento sin blur. Es lo que da el aire de cartel
    // impreso en vez de card de dashboard.
    shadowCard: '4px 4px 0 #0A0A0A',
    shadowElevated: '6px 6px 0 #0A0A0A',
    shadowGlow: 'none',

    radiusSm: '0.375rem',
    radiusMd: '0.375rem',
    radiusLg: '0.375rem',
    radiusXl: '0.375rem',

    fontHeading: 'var(--font-bricolage), system-ui, sans-serif',
    fontBody: 'var(--font-work-sans), system-ui, sans-serif',
    headingItalic: false,
    headingWeight: 800,
  },
};

/**
 * TALLER — editorial argentino, de imprenta.
 * Crema, tinta y terracota. CERO sombras: la jerarquía la hacen los hairlines
 * y el aire. Reusa el serif que el layout ya carga.
 */
const TALLER: Theme = {
  id: 'taller',
  label: 'Taller',
  description: 'Editorial y cálido: papel crema, tinta y terracota, títulos serif y cero sombras.',
  mode: 'light',
  tokens: {
    primary: '#B4462A',
    primaryLight: '#C9623F',
    primaryDark: '#8E3520',
    secondary: '#5C7060',
    accent: '#B4462A',

    bgBase: '#F2EEE5',
    bgSubtle: '#EAE4D8',
    bgCard: '#FBF9F4',
    bgCardHover: '#FFFFFF',

    textPrimary: '#1A1714',
    textSecondary: '#4A443B',
    textMuted: '#6B6255',

    borderSubtle: '#D6CFC0',
    borderHover: '#B4462A',
    heroSurface: '#F2EEE5',
    heroText: '#1A1714',
    heroTextMuted: '#4A443B',
    heroAccent: '#B4462A',
    heroAccentText: '#FBF9F4',
    borderWidth: '1px',

    surface: 'flat',
    useGradients: false,
    gradientHero: '#B4462A',
    gradientGlow: 'transparent',

    shadowCard: 'none',
    shadowElevated: 'none',
    shadowGlow: 'none',

    radiusSm: '0.5rem',
    radiusMd: '0.75rem',
    radiusLg: '0.75rem',
    radiusXl: '1rem',

    fontHeading: 'var(--font-serif), Georgia, serif',
    fontBody: 'var(--font-inter), system-ui, sans-serif',
    headingItalic: false,
    headingWeight: 600,
  },
};

/**
 * ESTUDIO — sobrio y técnico.
 * Casi negro con un verde apagado, bordes de 1px y nada decorativo.
 * Reusa las fuentes que el layout ya carga (Geist).
 */
const ESTUDIO: Theme = {
  id: 'estudio',
  label: 'Estudio',
  description: 'Sobrio y técnico: casi negro con verde apagado, bordes finos y cero decoración.',
  mode: 'dark',
  tokens: {
    primary: '#7FD1A0',
    primaryLight: '#A6E3BF',
    primaryDark: '#5FB183',
    secondary: '#7FD1A0',
    accent: '#7FD1A0',

    bgBase: '#0D0F0E',
    bgSubtle: '#141815',
    bgCard: '#141815',
    bgCardHover: '#1B201D',

    textPrimary: '#F3F5F2',
    textSecondary: '#99A39B',
    textMuted: '#7D867F',

    borderSubtle: 'rgba(255, 255, 255, 0.09)',
    borderHover: 'rgba(127, 209, 160, 0.45)',
    heroSurface: '#0D0F0E',
    heroText: '#F3F5F2',
    heroTextMuted: '#99A39B',
    heroAccent: '#7FD1A0',
    heroAccentText: '#0B1410',
    borderWidth: '1px',

    surface: 'flat',
    useGradients: false,
    gradientHero: '#7FD1A0',
    gradientGlow: 'transparent',

    shadowCard: '0 1px 2px rgba(0, 0, 0, 0.4)',
    shadowElevated: '0 8px 24px rgba(0, 0, 0, 0.5)',
    shadowGlow: 'none',

    radiusSm: '0.625rem',
    radiusMd: '0.625rem',
    radiusLg: '0.625rem',
    radiusXl: '0.875rem',

    fontHeading: 'var(--font-geist-sans), system-ui, sans-serif',
    fontBody: 'var(--font-geist-sans), system-ui, sans-serif',
    headingItalic: false,
    headingWeight: 600,
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * Personalización por skin
 *
 * El admin puede retocar un preset desde /admin/apariencia. Lo que elige se
 * guarda como override en app_settings.theme_overrides y se aplica ENCIMA del
 * preset del código, que nunca se pisa: borrar el override devuelve el tema
 * original tal cual.
 *
 * Las opciones son listas cerradas a propósito. Un selector de color libre
 * deja escribir amarillo sobre blanco; estas paletas no pueden.
 * ───────────────────────────────────────────────────────────────────────── */

export const BRAND_COLORS = [
  { id: 'azul', label: 'Azul', hex: '#2340E8' },
  { id: 'tinta', label: 'Tinta', hex: '#14161D' },
  { id: 'coral', label: 'Coral', hex: '#FF5A3C' },
  { id: 'amarillo', label: 'Amarillo', hex: '#FFCC00' },
  { id: 'verde', label: 'Verde', hex: '#1E9E6A' },
  { id: 'terracota', label: 'Terracota', hex: '#B4462A' },
  { id: 'violeta', label: 'Violeta', hex: '#6D4AFF' },
  { id: 'fucsia', label: 'Fucsia', hex: '#DB2777' },
] as const;

export type BrandColorId = typeof BRAND_COLORS[number]['id'];

// Solo familias que layout.tsx ya carga: next/font resuelve en build, así que
// no se puede ofrecer "cualquier fuente de Google". Sumar una es agregarla al
// layout y a esta lista.
export const BRAND_FONTS = [
  { id: 'bricolage', label: 'Bricolage Grotesque', stack: 'var(--font-bricolage), system-ui, sans-serif' },
  { id: 'work-sans', label: 'Work Sans', stack: 'var(--font-work-sans), system-ui, sans-serif' },
  { id: 'serif', label: 'Source Serif', stack: 'var(--font-serif), Georgia, serif' },
  { id: 'inter', label: 'Inter', stack: 'var(--font-inter), system-ui, sans-serif' },
  { id: 'geist', label: 'Geist', stack: 'var(--font-geist-sans), system-ui, sans-serif' },
  { id: 'jetbrains', label: 'JetBrains Mono', stack: 'var(--font-jetbrains), ui-monospace, monospace' },
] as const;

export type BrandFontId = typeof BRAND_FONTS[number]['id'];

export const BORDER_WIDTHS = [
  { id: 'none', label: 'Sin borde', value: '0px' },
  { id: 'thin', label: 'Fino', value: '1px' },
  { id: 'thick', label: 'Grueso', value: '2px' },
] as const;

export type BorderWidthId = typeof BORDER_WIDTHS[number]['id'];

export type ThemeOverride = {
  primary?: BrandColorId;
  secondary?: BrandColorId;
  fontHeading?: BrandFontId;
  fontBody?: BrandFontId;
  borderWidth?: BorderWidthId;
  /** Halos de fondo. Los lee la landing y las 24 plantillas de clientes. */
  surface?: SurfaceStyle;
  /** Degradé en el headline y en los acentos. */
  useGradients?: boolean;
};

export type ThemeOverrides = Partial<Record<ThemeId, ThemeOverride>>;

const hexDe = (id: BrandColorId): string | undefined =>
  BRAND_COLORS.find((c) => c.id === id)?.hex;

const stackDe = (id: BrandFontId): string | undefined =>
  BRAND_FONTS.find((f) => f.id === id)?.stack;

const anchoDe = (id: BorderWidthId): string | undefined =>
  BORDER_WIDTHS.find((b) => b.id === id)?.value;

// Aclara u oscurece un hex. Sirve para que cambiar el primario arrastre sus
// variantes: sin esto quedaban el light y el dark del color anterior.
function shade(hex: string, amount: number): string {
  const limpio = hex.replace('#', '');
  const full = limpio.length === 3
    ? limpio.split('').map((c) => c + c).join('')
    : limpio;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n) || full.length !== 6) return hex;

  const mezclar = (canal: number) =>
    Math.round(amount > 0 ? canal + (255 - canal) * amount : canal * (1 + amount));

  const r = mezclar((n >> 16) & 255);
  const g = mezclar((n >> 8) & 255);
  const b = mezclar(n & 255);
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Devuelve el tema con el override aplicado. Sin override, el mismo objeto.
 *
 * Los valores derivados se recalculan a mano en vez de dejarlos viejos: si el
 * acento del hero era el primario del preset, sigue siendo el primario nuevo;
 * si era el secundario, sigue el secundario. Esa es la diferencia entre
 * cambiar un color y romper el tema.
 */
export function applyThemeOverride(theme: Theme, override?: ThemeOverride): Theme {
  if (!override || Object.keys(override).length === 0) return theme;

  const t = { ...theme.tokens };

  const nuevoPrimario = override.primary ? hexDe(override.primary) : undefined;
  if (nuevoPrimario) {
    const anterior = t.primary;
    t.primary = nuevoPrimario;
    t.primaryLight = shade(nuevoPrimario, 0.22);
    t.primaryDark = shade(nuevoPrimario, -0.22);
    if (t.gradientHero === anterior) t.gradientHero = nuevoPrimario;
    if (t.heroAccent === anterior) t.heroAccent = nuevoPrimario;
    if (t.heroSurface === anterior) t.heroSurface = nuevoPrimario;
    if (t.accent === anterior) t.accent = nuevoPrimario;
  }

  const nuevoSecundario = override.secondary ? hexDe(override.secondary) : undefined;
  if (nuevoSecundario) {
    const anterior = t.secondary;
    t.secondary = nuevoSecundario;
    if (t.heroAccent === anterior) t.heroAccent = nuevoSecundario;
    if (t.accent === anterior) t.accent = nuevoSecundario;
  }

  if (override.fontHeading) t.fontHeading = stackDe(override.fontHeading) ?? t.fontHeading;
  if (override.fontBody) t.fontBody = stackDe(override.fontBody) ?? t.fontBody;
  if (override.borderWidth) t.borderWidth = anchoDe(override.borderWidth) ?? t.borderWidth;
  if (override.surface) {
    t.surface = override.surface;
    // Un tema plano no puede quedarse con un halo dibujado, ni al revés.
    if (override.surface === 'flat') t.gradientGlow = 'transparent';
  }
  if (typeof override.useGradients === 'boolean') t.useGradients = override.useGradients;

  return { ...theme, tokens: t };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Registro y helpers
 * ───────────────────────────────────────────────────────────────────────── */

export const THEMES: Record<ThemeId, Theme> = {
  kiosco: KIOSCO,
  taller: TALLER,
  estudio: ESTUDIO,
  oficina: OFICINA,
  glow: GLOW,
  vivo: VIVO,
};

// El orden es el que ve el admin en /admin/apariencia: primero el oficial,
// después las alternativas.
export const THEME_LIST: Theme[] = [KIOSCO, TALLER, ESTUDIO, OFICINA, GLOW, VIVO];

/** Tema por defecto de las superficies propias (landing/admin). */
export const DEFAULT_THEME_ID: ThemeId = 'kiosco';

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
  'fotografia-estudio': 'glow',
  'belleza-estetica': 'oficina',
  'gimnasio-fitness': 'glow',
  'comercio-local': 'oficina',
  // Lote 1
  'cafeteria': 'oficina',
  'bar-cerveceria': 'glow',
  'pasteleria': 'vivo',
  'barberia': 'glow',
  // Lote 2
  'consultorio-medico': 'oficina',
  'odontologia': 'vivo',
  'spa': 'oficina',
  'veterinaria': 'vivo',
  // Lote 3
  'estudio-juridico': 'oficina',
  'estudio-contable': 'glow',
  'arquitectura': 'oficina',
  'taller-mecanico': 'glow',
  // Lote 4
  'tecnologia-reparaciones': 'glow',
  'academia': 'vivo',
  'inmobiliaria': 'oficina',
  'hotel-cabanas': 'oficina',
  // Lote 5
  'agencia-viajes': 'vivo',
  'floreria': 'vivo',
  'eventos-dj': 'glow',
  'ong-fundacion': 'oficina',
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
// #RRGGBB → rgba(r, g, b, alpha). Sirve para derivar el anillo de foco del
// color primario en vez de pedir otro token por preset.
function withAlpha(hex: string, alpha: number): string {
  const limpio = hex.replace('#', '');
  const full = limpio.length === 3
    ? limpio.split('').map((c) => c + c).join('')
    : limpio;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n) || full.length !== 6) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

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
    '--border-width': t.borderWidth,

    '--hero-surface': t.heroSurface,
    '--hero-text': t.heroText,
    '--hero-text-muted': t.heroTextMuted,
    '--hero-accent': t.heroAccent,
    '--hero-accent-text': t.heroAccentText,

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
    // Estos cuatro estaban en el contrato desde el principio y no se emitían:
    // el tema declaraba una tipografía de cuerpo y un peso de título que no
    // llegaban nunca al CSS.
    '--font-body': t.fontBody,
    '--heading-weight': String(t.headingWeight),
    '--heading-style': t.headingItalic ? 'italic' : 'normal',
    // El anillo de foco se derivaba de globals.css, así que TODOS los temas
    // usaban el del tema por defecto. Ahora sale del primario de cada uno.
    '--ring-primary': `0 0 0 3px ${withAlpha(t.primary, 0.35)}`,
  };
}

/**
 * Genera el bloque CSS `:root { ... }` que aplica un tema a las superficies
 * propias (landing + panel), pensado para inyectarse en un <style> del layout
 * raíz DESPUÉS del import de globals.css (así gana por orden de cascada).
 *
 * El tema por defecto devuelve '' a propósito y NO inyecta nada: sus valores
 * viven en globals.css (:root para claro, .dark para oscuro), así el toggle
 * claro/oscuro sigue funcionando en la superficie que ve el visitante.
 *
 * CUIDADO: esto ata DEFAULT_THEME_ID a globals.css. Si cambiás el default,
 * hay que mover también :root y .dark a los valores de ese tema, o la app
 * renderiza el tema viejo mientras dice que usa el nuevo.
 *
 * Los demás temas pisan el set completo (incluido el fondo), por eso se ven
 * netamente distintos — y por eso en ellos el toggle claro/oscuro no aplica:
 * cada preset ya declara su `mode`.
 */
export function themeRootCss(theme: Theme): string {
  // El atajo solo vale para el preset por DEFECTO SIN TOCAR. Si el admin lo
  // personalizó, `applyThemeOverride` devolvió un objeto nuevo y hay que
  // inyectar sí o sí: si no, globals.css renderizaría el preset original y la
  // personalización se perdería en silencio.
  const sinPersonalizar = theme === THEMES[theme.id];
  if (theme.id === DEFAULT_THEME_ID && sinPersonalizar) return '';
  const vars = themeToCssVars(theme);
  const decls = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  return `:root{${decls}}`;
}
