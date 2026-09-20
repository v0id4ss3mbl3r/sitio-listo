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
      'Plantillas básicas de landing page',
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
      'Todo lo del plan Básico, más:',
      '1 sitio con hasta 5 secciones',
      'Hasta 25 plantillas',
      'Dominio personalizado incluido',
      'Sin marca "Creado con SitioListo"',
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
      'Todo lo del plan Pro, más:',
      'Hasta 2 sitios independientes',
      'Hasta 15 secciones por sitio',
      'Hasta 50 plantillas',
      'Dominios personalizados',
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
  extremo: 2,
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

// ── Contenido genérico (site_items) ──────────────────────────
// Una tabla flexible alimenta varias plantillas; cada "kind" es una colección.
export type SiteItemKind =
  | 'gallery'
  | 'service'
  | 'plan'
  | 'schedule'
  | 'feature'
  | 'menu'
  | 'property'
  | 'team'
  | 'testimonial'
  | 'faq';

export const SITE_ITEM_KINDS: SiteItemKind[] = [
  'gallery',
  'service',
  'plan',
  'schedule',
  'feature',
  'menu',
  'property',
  'team',
  'testimonial',
  'faq',
];

// Etiquetas legibles por kind (para el editor).
export const SITE_ITEM_KIND_LABELS: Record<SiteItemKind, string> = {
  gallery: 'Galería',
  service: 'Servicios',
  plan: 'Planes',
  schedule: 'Horarios / Clases',
  feature: 'Destacados',
  menu: 'Menú / Carta',
  property: 'Propiedades',
  team: 'Equipo',
  testimonial: 'Testimonios',
  faq: 'Preguntas frecuentes',
};

// Qué colecciones usa cada plantilla → decide qué muestra el editor y qué
// valida la API. Las plantillas sin entrada acá no gestionan site_items.
export const TEMPLATE_COLLECTIONS: Record<string, SiteItemKind[]> = {
  'fotografia-estudio': ['gallery', 'service'],
  'belleza-estetica': ['service', 'gallery'],
  'gimnasio-fitness': ['plan', 'schedule'],
  'comercio-local': ['feature'],
  // Lote 1 — gastronomía + barbería
  'cafeteria': ['menu', 'gallery'],
  'bar-cerveceria': ['menu', 'gallery'],
  'pasteleria': ['menu', 'gallery'],
  'barberia': ['service', 'gallery', 'team'],
  // Lote 2 — salud + bienestar
  'consultorio-medico': ['service', 'team', 'faq'],
  'odontologia': ['service', 'team', 'testimonial'],
  'spa': ['service', 'gallery', 'plan'],
  'veterinaria': ['service', 'team', 'faq'],
  // Lote 3 — profesionales + automotor
  'estudio-juridico': ['service', 'team', 'faq'],
  'estudio-contable': ['service', 'plan', 'faq'],
  'arquitectura': ['gallery', 'service', 'team'],
  'taller-mecanico': ['service', 'feature', 'faq'],
  // Lote 4 — tecnología, educación, inmobiliaria, hotelería
  'tecnologia-reparaciones': ['service', 'feature', 'faq'],
  'academia': ['service', 'team', 'faq'],
  'inmobiliaria': ['property', 'service', 'faq'],
  'hotel-cabanas': ['property', 'gallery', 'feature'],
  // Lote 5 — turismo, comercio, eventos, ong
  'agencia-viajes': ['service', 'gallery', 'testimonial'],
  'floreria': ['menu', 'gallery'],
  'eventos-dj': ['service', 'gallery', 'testimonial'],
  'ong-fundacion': ['feature', 'team', 'faq'],
};

// Límite total de items de contenido por sitio, por plan.
// Basic tiene un cupo chico: sus plantillas son landings de una sección con
// una sola lista corta (destacados, galería, servicios). Sin cupo no podrían
// renderizar nada.
export const PLAN_ITEM_LIMITS: Record<PlanType, number> = {
  test: 30,
  basic: 15,
  pro: 60,
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

// Planes que incluyen elegir el tema visual del sitio sin override manual.
const THEME_CUSTOMIZATION_PLANS = ['pro', 'extremo', 'personalizado'];

// ¿El usuario puede elegir el tema de su sitio desde el editor?
// true si su plan lo incluye (Pro/Extremo/Personalizado) o si tiene el
// override manual (profiles.can_customize_theme) que otorga el admin.
export function canCustomizeTheme(planSlug: string, override?: boolean | null): boolean {
  if (override) return true;
  return THEME_CUSTOMIZATION_PLANS.includes(planSlug);
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

// ── Verificación DNS de dominios propios ─────────────────────
// A dónde tiene que apuntar el dominio del cliente para que lo sirvamos.
// Un subdominio (www.tienda.com) usa CNAME; un dominio raíz (tienda.com) no
// puede llevar CNAME por especificación, así que esos usan un registro A.
// Ambos valores son los que publica Vercel para dominios externos.
export const DOMAIN_CNAME_TARGET = 'cname.vercel-dns.com';
export const DOMAIN_APEX_IP = '76.76.21.21';

// Planes que incluyen conectar un dominio propio.
const CUSTOM_DOMAIN_PLANS = ['test', 'pro', 'extremo', 'personalizado'];

// ¿El plan permite conectar un dominio propio? Fuente única para el gate del
// editor y el de la API de verificación.
export function canUseCustomDomain(planSlug: string): boolean {
  return CUSTOM_DOMAIN_PLANS.includes(planSlug);
}

export const TEMPLATE_CATEGORIES = [
  { slug: 'restaurant', name: 'Restaurantes', icon: '🍽️' },
  { slug: 'portfolio', name: 'Portfolios', icon: '🎨' },
  { slug: 'ecommerce', name: 'Tiendas', icon: '🛍️' },
  { slug: 'landing', name: 'Landing Pages', icon: '🚀' },
  { slug: 'services', name: 'Servicios', icon: '🔧' },
  { slug: 'fotografia', name: 'Fotografía', icon: '📷' },
  { slug: 'belleza', name: 'Belleza & Estética', icon: '💅' },
  { slug: 'fitness', name: 'Gimnasios', icon: '🏋️' },
  { slug: 'comercio', name: 'Comercios', icon: '🏪' },
  { slug: 'gastronomia', name: 'Gastronomía', icon: '☕' },
  { slug: 'salud', name: 'Salud', icon: '🩺' },
  { slug: 'profesional', name: 'Profesionales', icon: '💼' },
  { slug: 'automotor', name: 'Automotor', icon: '🚗' },
  { slug: 'tecnologia', name: 'Tecnología', icon: '💻' },
  { slug: 'educacion', name: 'Educación', icon: '🎓' },
  { slug: 'inmobiliaria', name: 'Inmobiliarias', icon: '🏠' },
  { slug: 'hoteleria', name: 'Hotelería', icon: '🏨' },
  { slug: 'turismo', name: 'Turismo', icon: '✈️' },
  { slug: 'eventos', name: 'Eventos', icon: '🎉' },
  { slug: 'ong', name: 'ONG', icon: '🤝' },
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
    plan: 'extremo',
    component: 'TiendaCatalogo',
  },
  {
    id: 'fotografia-estudio',
    name: 'Estudio de Fotografía',
    type: 'fotografia',
    plan: 'basic',
    component: 'FotografiaEstudio',
  },
  {
    id: 'gimnasio-fitness',
    name: 'Gimnasio / Fitness',
    type: 'fitness',
    plan: 'basic',
    component: 'GimnasioFitness',
  },
  {
    id: 'comercio-local',
    name: 'Comercio Local',
    type: 'comercio',
    plan: 'basic',
    component: 'ComercioLocal',
  },
  {
    id: 'belleza-estetica',
    name: 'Belleza & Estética',
    type: 'belleza',
    plan: 'basic',
    component: 'BellezaEstetica',
  },
  {
    id: 'cafeteria',
    name: 'Cafetería',
    type: 'gastronomia',
    plan: 'pro',
    component: 'Cafeteria',
  },
  {
    id: 'bar-cerveceria',
    name: 'Bar / Cervecería',
    type: 'gastronomia',
    plan: 'pro',
    component: 'BarCerveceria',
  },
  {
    id: 'pasteleria',
    name: 'Pastelería',
    type: 'gastronomia',
    plan: 'pro',
    component: 'Pasteleria',
  },
  {
    id: 'barberia',
    name: 'Barbería',
    type: 'belleza',
    plan: 'pro',
    component: 'Barberia',
  },
  {
    id: 'consultorio-medico',
    name: 'Consultorio Médico',
    type: 'salud',
    plan: 'pro',
    component: 'ConsultorioMedico',
  },
  {
    id: 'odontologia',
    name: 'Odontología',
    type: 'salud',
    plan: 'pro',
    component: 'Odontologia',
  },
  {
    id: 'spa',
    name: 'Spa & Bienestar',
    type: 'belleza',
    plan: 'pro',
    component: 'Spa',
  },
  {
    id: 'veterinaria',
    name: 'Veterinaria',
    type: 'salud',
    plan: 'pro',
    component: 'Veterinaria',
  },
  {
    id: 'estudio-juridico',
    name: 'Estudio Jurídico',
    type: 'profesional',
    plan: 'pro',
    component: 'EstudioJuridico',
  },
  {
    id: 'estudio-contable',
    name: 'Estudio Contable',
    type: 'profesional',
    plan: 'pro',
    component: 'EstudioContable',
  },
  {
    id: 'arquitectura',
    name: 'Arquitectura',
    type: 'profesional',
    plan: 'extremo',
    component: 'Arquitectura',
  },
  {
    id: 'taller-mecanico',
    name: 'Taller Mecánico',
    type: 'automotor',
    plan: 'pro',
    component: 'TallerMecanico',
  },
  {
    id: 'tecnologia-reparaciones',
    name: 'Tecnología / Reparaciones',
    type: 'tecnologia',
    plan: 'pro',
    component: 'TecnologiaReparaciones',
  },
  {
    id: 'academia',
    name: 'Academia / Cursos',
    type: 'educacion',
    plan: 'pro',
    component: 'Academia',
  },
  {
    id: 'inmobiliaria',
    name: 'Inmobiliaria',
    type: 'inmobiliaria',
    plan: 'extremo',
    component: 'Inmobiliaria',
  },
  {
    id: 'hotel-cabanas',
    name: 'Hotel / Cabañas',
    type: 'hoteleria',
    plan: 'extremo',
    component: 'HotelCabanas',
  },
  {
    id: 'agencia-viajes',
    name: 'Agencia de Viajes',
    type: 'turismo',
    plan: 'extremo',
    component: 'AgenciaViajes',
  },
  {
    id: 'floreria',
    name: 'Florería',
    type: 'comercio',
    plan: 'pro',
    component: 'Floreria',
  },
  {
    id: 'eventos-dj',
    name: 'Eventos / DJ',
    type: 'eventos',
    plan: 'pro',
    component: 'EventosDj',
  },
  {
    id: 'ong-fundacion',
    name: 'ONG / Fundación',
    type: 'ong',
    plan: 'pro',
    component: 'OngFundacion',
  },
] as const;

export type TemplateId = typeof TEMPLATES[number]['id'];

// Qué planes alcanzan cada tier de plantilla. El acceso es acumulativo: un
// plan ve las de su tier y las de los de abajo.
//
//   basic   →  8 plantillas   (landings de una sección)
//   pro     → 25 = 8 + 17     (los rubros con contenido administrable)
//   extremo → 30 = 25 + 5     (negocio grande + la tienda completa)
const TEMPLATE_TIER_ACCESS: Record<'basic' | 'pro' | 'extremo', readonly string[]> = {
  basic: ['basic', 'test', 'pro', 'extremo', 'personalizado'],
  pro: ['pro', 'extremo', 'personalizado'],
  extremo: ['extremo', 'personalizado'],
};

// Devuelve true si un plan puede usar una plantilla dada.
// 'free' (sin suscripción authorized) no puede usar ninguna.
export function canUseTemplate(planSlug: string, templateId: string): boolean {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return false;

  if (planSlug === 'free' || !planSlug) return false;

  const allowed = TEMPLATE_TIER_ACCESS[template.plan];
  return allowed ? allowed.includes(planSlug) : false;
}
