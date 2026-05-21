import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TenantShell } from '../_components/TenantShell';
import {
  fetchActiveSubCached,
  fetchSiteCached,
  fetchSitePagesCached,
  getHomeContent,
} from '../_components/fetchers';

type Params = Promise<{ domain: string; slug: string[] }>;

function resolveSlug(slugSegments: string[]): string {
  return slugSegments.map((s) => s.toLowerCase()).join('/');
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const site = await fetchSiteCached(domain);
  if (!site || !site.is_active) {
    return { title: 'Sitio no encontrado | SitioListo' };
  }

  const pages = await fetchSitePagesCached(site.id, domain);
  const page = pages.find((p) => p.slug === resolveSlug(slug));
  const home = getHomeContent(site, pages);
  const baseName = home.content?.name || domain;

  if (!page) {
    return { title: `${baseName}` };
  }

  return {
    title: `${page.title ?? page.slug} — ${baseName}`,
  };
}

export default async function TenantSubpage({ params }: { params: Params }) {
  const { domain, slug } = await params;
  const site = await fetchSiteCached(domain);
  if (!site || !site.is_active) notFound();

  const [pages, currentSub] = await Promise.all([
    fetchSitePagesCached(site.id, domain),
    fetchActiveSubCached(site.user_id),
  ]);

  const slugStr = resolveSlug(slug);
  const page = pages.find((p) => p.slug === slugStr);
  if (!page) notFound();

  const planType = currentSub?.plan_type || 'basic';
  const home = getHomeContent(site, pages);
  const homeContent = home.content ?? {};
  const navigation = pages.map((p) => ({
    slug: p.slug,
    title: p.title ?? (p.is_home ? 'Inicio' : p.slug),
  }));

  const body: string = typeof page.content?.body === 'string' ? page.content.body : '';
  const sections = Array.isArray(page.content?.sections) ? page.content.sections : [];

  return (
    <TenantShell
      siteName={homeContent.name || domain}
      logoUrl={homeContent.logoUrl}
      primaryColor={homeContent.primaryColor || '#6366f1'}
      secondaryColor={homeContent.secondaryColor || '#f59e0b'}
      planType={planType}
      navigation={navigation}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        {page.title ?? page.slug}
      </h1>

      {body && (
        <div
          style={{ fontSize: '1.05rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', opacity: 0.92 }}
        >
          {body}
        </div>
      )}

      {sections.length > 0 && (
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sections.map((s: { heading?: string; body?: string }, i: number) => (
            <section key={i}>
              {s.heading && (
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {s.heading}
                </h2>
              )}
              {s.body && (
                <div style={{ lineHeight: 1.75, whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                  {s.body}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </TenantShell>
  );
}
