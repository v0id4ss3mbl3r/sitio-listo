import type { Metadata } from 'next';

import {
  fetchActiveSubCached,
  fetchCatalogCached,
  fetchSiteCached,
  fetchSiteItemsCached,
  fetchSitePagesCached,
  getHomeContent,
} from './_components/fetchers';
import { getTheme, TEMPLATE_DEFAULT_THEME } from '@/lib/themes';
import {
  renderTemplate,
  templateNeedsCatalog,
  templateNeedsItems,
} from './_components/renderTemplate';

// Los colores de marca se interpolan en <style> de las plantillas. Forzamos
// formato hex acá (último chokepoint) para neutralizar cualquier valor malicioso
// que haya quedado guardado en pages.content (defensa en profundidad sobre la
// validación de la API).
function safeHexColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
    ? value
    : fallback;
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
  const primaryColor = safeHexColor(home?.primaryColor, '#6366f1');

  const props = {
    siteName,
    primaryColor,
    secondaryColor: safeHexColor(home?.secondaryColor, '#f59e0b'),
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

  // Solo se piden los datos que la plantilla realmente consume: antes cada
  // rama del if hacía su propio fetch, ahora lo decide el registro.
  const [items, catalog] = await Promise.all([
    templateNeedsItems(template_id)
      ? fetchSiteItemsCached(site.id, domain)
      : Promise.resolve([]),
    templateNeedsCatalog(template_id)
      ? fetchCatalogCached(site.id, domain)
      : Promise.resolve(undefined),
  ]);

  return renderTemplate({
    templateId: template_id,
    base: props,
    theme,
    items,
    catalog,
    content: {
      openingHours: home?.content?.openingHours,
      ctaText: home?.content?.ctaText,
      features: home?.content?.features,
      services: home?.content?.services,
    },
  });
}
