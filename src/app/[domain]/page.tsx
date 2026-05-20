import type { Metadata } from 'next';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import { CUSTOM_DOMAIN_REGEX, SUBDOMAIN_REGEX } from '@/lib/constants';
import { sanitizeTenantParam } from '@/lib/validation';
import SaborUrbano from './templates/SaborUrbano';
import PortfolioMinimal from './templates/PortfolioMinimal';
import LandingPro from './templates/LandingPro';
import ServiciosPro from './templates/ServiciosPro';
import TiendaExpress from './templates/TiendaExpress';

// Forzar renderizado dinámico - evitar caché inconsistente entre subdominios
export const dynamic = 'force-dynamic';

// Busca el sitio por subdomain O por custom_domain. Usa .eq() (parametrizado)
// en lugar de .or() con interpolación de string, que no escapa los valores.
async function fetchSiteByDomain<T>(
  supabase: SupabaseClient,
  domain: string,
  columns: string
): Promise<T | null> {
  const safe = sanitizeTenantParam(domain);
  if (!safe) return null;

  const column = SUBDOMAIN_REGEX.test(safe) && !CUSTOM_DOMAIN_REGEX.test(safe)
    ? 'subdomain'
    : 'custom_domain';

  const { data } = await supabase
    .from('sites')
    .select(columns)
    .eq(column, safe)
    .maybeSingle();

  return (data as T | null) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const supabase = await createClient();

  const site = await fetchSiteByDomain<{ config: { name?: string } | null; is_active: boolean }>(
    supabase,
    domain,
    'config, is_active'
  );

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
  const supabase = await createClient();

  // config es JSONB libre — lo tratamos como any para no obligar a refactorear
  // los accesos anidados existentes (config?.content?.heroTitle, etc).
  const site = await fetchSiteByDomain<{
    template_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any> | null;
    is_active: boolean;
    plan_type?: string;
  }>(supabase, domain, '*');

  // Si no existe o no está activo (suscripción vencida), mostrar página por defecto
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

  const { template_id, config } = site;
  const siteName = config?.name || 'Mi Nuevo Sitio';
  const primaryColor = config?.primaryColor || '#6366f1';

  // Extraer contenido dinámico
  const content = {
    siteName,
    primaryColor,
    secondaryColor: config?.secondaryColor || '#f59e0b',
    logoUrl: config?.logoUrl || '',
    phone: config?.phone || '',
    address: config?.address || '',
    planType: site.plan_type || 'basic',
    heroTitle: config?.content?.heroTitle || 'Una experiencia inolvidable',
    heroSubtitle: config?.content?.heroSubtitle || 'Descubrí lo mejor de nuestros servicios.',
    aboutText: config?.content?.aboutText || 'Somos una empresa dedicada a brindar el mejor servicio a nuestros clientes.'
  };

  // Renderizado dinámico según la plantilla elegida
  // Mapeamos los slugs de la base de datos a los componentes
  
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

  // Plantilla por defecto si el ID no matchea
  return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', background: '#f9fafb' }}>
      <h1 style={{ color: primaryColor, fontSize: '3rem', fontWeight: 800 }}>{siteName}</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#4b5563' }}>Estamos preparando algo increíble.</p>
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9ca3af' }}>Plantilla: {template_id}</div>
    </div>
  );
}
