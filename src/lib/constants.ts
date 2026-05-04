export const PLANS = {
  basic: {
    name: 'Básico',
    slug: 'basic',
    price: 29999,
    priceDisplay: '$29.999',
    description: 'Ideal para empezar tu presencia online',
    features: [
      '1 sitio web',
      'Plantillas básicas',
      'Subdominio .sitiolisto.com.ar',
      'SSL incluido',
      'Soporte por email',
    ],
    highlighted: false,
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    price: 49999,
    priceDisplay: '$49.999',
    description: 'Para negocios que buscan destacar',
    features: [
      '1 sitio web',
      'Todas las plantillas',
      'Dominio personalizado',
      'SSL incluido',
      'Editor avanzado',
      'Soporte prioritario',
      'Analytics básicos',
    ],
    highlighted: true,
  },
  agency: {
    name: 'Agencia',
    slug: 'agency',
    price: 89999,
    priceDisplay: '$89.999',
    description: 'Para agencias y equipos',
    features: [
      'Hasta 5 sitios web',
      'Todas las plantillas',
      'Dominios personalizados',
      'SSL incluido',
      'Editor avanzado',
      'Soporte prioritario 24/7',
      'Analytics completos',
      'White-label',
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
