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
      '1 sitio web',
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
      '1 sitio web',
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
      'Hasta 10 sitios web',
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
      'Sitios ilimitados',
      'Integraciones a medida',
      'SLA garantizado',
      'Manager dedicado',
    ],
    highlighted: false,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const TEMPLATE_CATEGORIES = [
  { slug: 'restaurant', name: 'Restaurantes', icon: '🍽️' },
  { slug: 'portfolio', name: 'Portfolios', icon: '🎨' },
  { slug: 'ecommerce', name: 'Tiendas', icon: '🛍️' },
  { slug: 'landing', name: 'Landing Pages', icon: '🚀' },
  { slug: 'services', name: 'Servicios', icon: '🔧' },
] as const;
