export const PLANS = {
  test: {
    name: 'Prueba (Test)',
    slug: 'test',
    price: 100,
    priceDisplay: '$100',
    description: 'Plan de prueba para verificar MercadoPago',
    features: ['Suscripción de prueba'],
    highlighted: false,
  },
  basic: {
    name: 'Básico',
    slug: 'basic',
    price: 29999,
    priceDisplay: '$29.999',
    description: 'Todo lo que necesitás para estar online desde hoy',
    features: [
      '1 sitio con página principal',
      'Todas las plantillas',
      'Subdominio .sitiolisto.com.ar',
      'SSL incluido',
      'Soporte por email',
      '14 días de prueba gratis',
    ],
    highlighted: false,
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    price: 39999,
    priceDisplay: '$39.999',
    description: 'Para negocios que quieren su dominio propio y más control',
    features: [
      '1 sitio con hasta 5 secciones',
      'Todas las plantillas',
      'Dominio personalizado incluido',
      'Sin marca "Creado con SitioListo"',
      'SSL incluido',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  extremo: {
    name: 'Extremo',
    slug: 'extremo',
    price: 79999,
    priceDisplay: '$79.999',
    description: 'Para franquicias y grandes negocios con múltiples presencias',
    features: [
      'Hasta 4 sitios independientes',
      'Hasta 15 secciones por sitio',
      'Todas las plantillas',
      'Dominios personalizados',
      'Sin marca "Creado con SitioListo"',
      'SSL incluido',
      'Soporte dedicado 24/7',
    ],
    highlighted: false,
  },
  personalizado: {
    name: 'Personalizado',
    slug: 'personalizado',
    price: null,
    priceDisplay: 'A consultar',
    description: 'Solución a medida para tu negocio. Hablemos.',
    features: [
      'Sitios y secciones ilimitados',
      'Integraciones a medida',
      'SLA garantizado',
      'Manager dedicado',
    ],
    highlighted: false,
  },
} as const;

export type PlanType = keyof typeof PLANS;

// Límite de secciones (páginas) dentro de un mismo sitio, por plan.
// Aplicar en el endpoint de creación de páginas (Sprint 1.5).
export const PLAN_PAGE_LIMITS: Record<PlanType, number> = {
  test: 1,
  basic: 1,
  pro: 5,
  extremo: 15,
  personalizado: Infinity,
};

// Límite de sitios independientes (con dominio propio) por usuario, por plan.
// Aplicar en el endpoint POST /api/sites (Sprint 1.5).
export const PLAN_SITE_LIMITS: Record<PlanType, number> = {
  test: 1,
  basic: 1,
  pro: 1,
  extremo: 4,
  personalizado: Infinity,
};

// ── Catálogo (template tienda-catalogo) ──────────────────────
// Límite de productos por sitio. Aplicar en POST /api/catalog/products.
export const PLAN_PRODUCT_LIMITS: Record<PlanType, number> = {
  test: 50,
  basic: 0, // basic no tiene acceso al template
  pro: 50,
  extremo: Infinity,
  personalizado: Infinity,
};

// Límite de categorías de productos por sitio.
export const PLAN_CATEGORY_LIMITS: Record<PlanType, number> = {
  test: 10,
  basic: 0,
  pro: 10,
  extremo: Infinity,
  personalizado: Infinity,
};

// Features del catálogo gateadas por plan. true = el plan tiene acceso.
// Usar en UI y endpoints para mostrar/permitir.
export type CatalogFeature =
  | 'banner_custom'        // editar banner_title / subtitle / image
  | 'featured_products'    // marcar productos como is_featured (badge "Oferta")
  | 'multiple_images'      // image_urls (gallery)
  | 'csv_import';          // importar productos desde CSV/Excel

export const PLAN_CATALOG_FEATURES: Record<PlanType, ReadonlySet<CatalogFeature>> = {
  test: new Set<CatalogFeature>(['banner_custom', 'featured_products', 'multiple_images', 'csv_import']),
  basic: new Set<CatalogFeature>(),
  pro: new Set<CatalogFeature>(),
  extremo: new Set<CatalogFeature>(['banner_custom', 'featured_products', 'multiple_images', 'csv_import']),
  personalizado: new Set<CatalogFeature>(['banner_custom', 'featured_products', 'multiple_images', 'csv_import']),
};

export function hasCatalogFeature(plan: string, feature: CatalogFeature): boolean {
  const features = PLAN_CATALOG_FEATURES[plan as PlanType];
  return features?.has(feature) ?? false;
}

// Subdominios que NO pueden ser reclamados por usuarios — chocan con el routing
// del producto, con servicios estándar o son confusos para la marca.
export const RESERVED_SUBDOMAINS: ReadonlySet<string> = new Set([
  'app',
  'www',
  'api',
  'admin',
  'mail',
  'email',
  'smtp',
  'imap',
  'pop',
  'ftp',
  'blog',
  'docs',
  'help',
  'support',
  'status',
  'cdn',
  'static',
  'assets',
  'media',
  'auth',
  'login',
  'signup',
  'register',
  'account',
  'cuenta',
  'panel',
  'dashboard',
  'shop',
  'store',
  'tienda',
  'pay',
  'pagos',
  'checkout',
  'webhook',
  'webhooks',
  'sitiolisto',
  'site',
  'sitio',
  'staging',
  'test',
  'dev',
  'preview',
]);

// Subdominio válido: lowercase, alfanumérico con guiones internos, 3-63 chars.
export const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/;

// FQDN: etiquetas alfanuméricas (3+) separadas por puntos, sin protocolo ni path.
// Permitimos hasta 253 caracteres y al menos un punto (descarta valores como
// "localhost" o un solo label).
export const CUSTOM_DOMAIN_REGEX =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

// Dominios propios de la marca: no se pueden reclamar como custom_domain.
export const RESERVED_DOMAIN_SUFFIXES: readonly string[] = [
  'sitiolisto.com.ar',
];

export const TEMPLATE_CATEGORIES = [
  { slug: 'restaurant', name: 'Restaurantes', icon: '🍽️' },
  { slug: 'portfolio', name: 'Portfolios', icon: '🎨' },
  { slug: 'ecommerce', name: 'Tiendas', icon: '🛍️' },
  { slug: 'landing', name: 'Landing Pages', icon: '🚀' },
  { slug: 'services', name: 'Servicios', icon: '🔧' },
] as const;

export const TEMPLATES = [
  {
    id: 'sabor-urbano',
    name: 'Sabor Urbano',
    type: 'restaurant',
    plan: 'basic',
    component: 'SaborUrbano',
  },
  {
    id: 'portfolio-minimal',
    name: 'Portfolio Minimal',
    type: 'portfolio',
    plan: 'basic',
    component: 'PortfolioMinimal',
  },
  {
    id: 'landing-pro',
    name: 'Landing Pro',
    type: 'landing',
    plan: 'basic',
    component: 'LandingPro',
  },
  {
    id: 'servicios-pro',
    name: 'Servicios Pro',
    type: 'services',
    plan: 'basic',
    component: 'ServiciosPro',
  },
  {
    id: 'tienda-express',
    name: 'Tienda Express',
    type: 'ecommerce',
    plan: 'pro',
    component: 'TiendaExpress',
  },
  {
    id: 'tienda-catalogo',
    name: 'Tienda Catálogo',
    type: 'ecommerce',
    plan: 'pro',
    component: 'TiendaCatalogo',
  },
] as const;

export type TemplateId = typeof TEMPLATES[number]['id'];

// Devuelve true si un plan puede usar una plantilla dada. Reglas:
// - 'free' (sin suscripción authorized) → ninguna.
// - 'basic'/'test' → solo plantillas con plan: 'basic'.
// - 'pro'/'extremo'/'personalizado' → todas.
export function canUseTemplate(planSlug: string, templateId: string): boolean {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return false;

  if (planSlug === 'free' || !planSlug) return false;

  if (template.plan === 'basic') {
    return ['basic', 'test', 'pro', 'extremo', 'personalizado'].includes(planSlug);
  }

  if (template.plan === 'pro') {
    return ['pro', 'extremo', 'personalizado'].includes(planSlug);
  }

  return false;
}
