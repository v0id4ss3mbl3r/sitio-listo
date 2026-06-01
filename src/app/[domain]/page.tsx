import type { Metadata } from 'next';

import SaborUrbano from './templates/SaborUrbano';
import PortfolioMinimal from './templates/PortfolioMinimal';
import LandingPro from './templates/LandingPro';
import ServiciosPro from './templates/ServiciosPro';
import TiendaExpress from './templates/TiendaExpress';
import TiendaCatalogo from './templates/TiendaCatalogo';
import {
  fetchActiveSubCached,
  fetchCatalogCached,
  fetchSiteCached,
  fetchSitePagesCached,
  getHomeContent,
} from './_components/fetchers';
import { getTheme, TEMPLATE_DEFAULT_THEME } from '@/lib/themes';

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

  const pages = await fetchSitePagesCached(site.id, domain);
  const { title } = getHomeContent(site, pages);

  return {
    title: `${title || domain} | Creado con SitioListo`,
  };
}

export default async function TenantHome({
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

  const [pages, currentSub] = await Promise.all([
    fetchSitePagesCached(site.id, domain),
    fetchActiveSubCached(site.user_id),
  ]);

  const planType = currentSub?.plan_type || 'basic';
  const { content: home } = getHomeContent(site, pages);

  const siteName = home?.name || 'Mi Nuevo Sitio';
  const primaryColor = home?.primaryColor || '#6366f1';

  const props = {
    siteName,
    primaryColor,
    secondaryColor: home?.secondaryColor || '#f59e0b',
    logoUrl: home?.logoUrl || '',
    phone: home?.phone || '',
    address: home?.address || '',
    planType,
    heroTitle: home?.content?.heroTitle || 'Una experiencia inolvidable',
    heroSubtitle: home?.content?.heroSubtitle || 'Descubrí lo mejor de nuestros servicios.',
    aboutText:
      home?.content?.aboutText ||
      'Somos una empresa dedicada a brindar el mejor servicio a nuestros clientes.',
  };

  const { template_id } = site;

  // Tema visual del sitio: el elegido en sites.theme_id, o el default de la
  // plantilla si no se asignó ninguno.
  const theme = getTheme(site.theme_id ?? TEMPLATE_DEFAULT_THEME[template_id]);

  if (template_id === 'sabor-urbano') {
    return <SaborUrbano {...props} />;
  }
  if (template_id === 'portfolio-minimal') {
    return <PortfolioMinimal {...props} />;
  }
  if (template_id === 'landing-pro') {
    return (
      <LandingPro
        {...props}
        ctaText={home?.content?.ctaText}
        features={home?.content?.features}
        theme={theme}
      />
    );
  }
  if (template_id === 'servicios-pro') {
    return <ServiciosPro {...props} services={home?.content?.services} theme={theme} />;
  }
  if (template_id === 'tienda-express') {
    return <TiendaExpress {...props} />;
  }

  if (template_id === 'tienda-catalogo') {
    const catalog = await fetchCatalogCached(site.id, domain);
    return (
      <TiendaCatalogo
        siteName={props.siteName}
        logoUrl={props.logoUrl}
        primaryColor={props.primaryColor}
        planType={props.planType}
        products={catalog.products}
        categories={catalog.categories}
        settings={catalog.settings}
      />
    );
  }

  return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', background: '#f9fafb' }}>
      <h1 style={{ color: primaryColor, fontSize: '3rem', fontWeight: 800 }}>{siteName}</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#4b5563' }}>Estamos preparando algo increíble.</p>
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9ca3af' }}>Plantilla: {template_id}</div>
    </div>
  );
}
