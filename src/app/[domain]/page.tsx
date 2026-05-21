import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { CUSTOM_DOMAIN_REGEX, SUBDOMAIN_REGEX } from '@/lib/constants';
import { createPublicClient, siteCacheTag } from '@/lib/supabase/public';
import { sanitizeTenantParam } from '@/lib/validation';
import SaborUrbano from './templates/SaborUrbano';
import PortfolioMinimal from './templates/PortfolioMinimal';
import LandingPro from './templates/LandingPro';
import ServiciosPro from './templates/ServiciosPro';
import TiendaExpress from './templates/TiendaExpress';

const CACHE_REVALIDATE_SECONDS = 60 * 60; // 1h fallback (los writes invalidan vía tag)

type SiteRow = {
  user_id: string;
  template_id: string;
  // config es JSONB libre — accesos anidados existentes (config?.content?.heroTitle, etc).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any> | null;
  is_active: boolean;
};

type ActiveSubRow = {
  plan_type: string;
  status: string;
  current_period_end: string | null;
  trial_end_date: string | null;
  created_at: string;
};

// Lookup cacheado: subdominio o custom_domain → fila completa de sites.
// Tag = site:<dominio> para invalidar puntualmente al guardar el sitio.
function fetchSiteCached(domain: string) {
  return unstable_cache(
    async (): Promise<SiteRow | null> => {
      const safe = sanitizeTenantParam(domain);
      if (!safe) return null;

      const column =
        SUBDOMAIN_REGEX.test(safe) && !CUSTOM_DOMAIN_REGEX.test(safe)
          ? 'subdomain'
          : 'custom_domain';

      const supabase = createPublicClient();
      const { data } = await supabase
        .from('sites')
        .select('user_id, template_id, config, is_active')
        .eq(column, safe)
        .maybeSingle();

      return (data as SiteRow | null) ?? null;
    },
    ['site-by-domain', domain.toLowerCase()],
    { tags: [siteCacheTag(domain)], revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}

// Lookup cacheado de la suscripción vigente del owner. Tag separado porque
// se invalida desde el webhook de MP, no desde el guardado del sitio.
function fetchActiveSubCached(userId: string) {
  return unstable_cache(
    async (): Promise<ActiveSubRow | null> => {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('subscriptions')
        .select('plan_type, status, current_period_end, trial_end_date, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const now = Date.now();
      const subs = (data ?? []) as ActiveSubRow[];
      const current = subs.find((s) => {
        if (s.status === 'authorized') return true;
        if (
          s.status === 'cancelled' &&
          s.current_period_end &&
          new Date(s.current_period_end).getTime() > now
        ) {
          return true;
        }
        if (s.trial_end_date && new Date(s.trial_end_date).getTime() > now) {
          return true;
        }
        return false;
      });
      return current ?? null;
    },
    ['active-sub-by-user', userId],
    { tags: [`user-sub:${userId}`], revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const site = await fetchSiteCached(domain);

  if (!site || !site.is_active) {
    return { title: 'Sitio no encontrado | SitioListo' };
  }

  return {
    title: `${site.config?.name || domain} | Creado con SitioListo`,
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const site = await fetchSiteCached(domain);

  if (!site || !site.is_active) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem', color: 'white' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(45deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 auto 1.5rem' }}>
            S
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {domain}.sitiolisto.com.ar
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Este sitio no se encuentra disponible actualmente o está siendo configurado.
          </p>
          <a href="https://sitiolisto.com.ar" style={{ marginTop: '2rem', display: 'inline-flex', padding: '0.75rem 1.5rem', background: '#6366f1', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', color: 'white' }}>
            Creá tu propio sitio
          </a>
        </div>
      </div>
    );
  }

  // Branding desde plan vigente del owner, leído fresh (cache distinto).
  const currentSub = await fetchActiveSubCached(site.user_id);
  const planType = currentSub?.plan_type || 'basic';

  const { template_id, config } = site;
  const siteName = config?.name || 'Mi Nuevo Sitio';
  const primaryColor = config?.primaryColor || '#6366f1';

  const content = {
    siteName,
    primaryColor,
    secondaryColor: config?.secondaryColor || '#f59e0b',
    logoUrl: config?.logoUrl || '',
    phone: config?.phone || '',
    address: config?.address || '',
    planType,
    heroTitle: config?.content?.heroTitle || 'Una experiencia inolvidable',
    heroSubtitle: config?.content?.heroSubtitle || 'Descubrí lo mejor de nuestros servicios.',
    aboutText: config?.content?.aboutText || 'Somos una empresa dedicada a brindar el mejor servicio a nuestros clientes.',
  };

  if (template_id === 'sabor-urbano') {
    return <SaborUrbano {...content} />;
  }

  if (template_id === 'portfolio-minimal') {
    return <PortfolioMinimal {...content} />;
  }

  if (template_id === 'landing-pro') {
    return <LandingPro {...content} ctaText={config?.content?.ctaText} features={config?.content?.features} />;
  }

  if (template_id === 'servicios-pro') {
    return <ServiciosPro {...content} services={config?.content?.services} />;
  }

  if (template_id === 'tienda-express') {
    return <TiendaExpress {...content} />;
  }

  return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', background: '#f9fafb' }}>
      <h1 style={{ color: primaryColor, fontSize: '3rem', fontWeight: 800 }}>{siteName}</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#4b5563' }}>Estamos preparando algo increíble.</p>
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9ca3af' }}>Plantilla: {template_id}</div>
    </div>
  );
}
