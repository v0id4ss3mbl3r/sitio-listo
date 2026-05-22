import { unstable_cache } from 'next/cache';

import { CUSTOM_DOMAIN_REGEX, SUBDOMAIN_REGEX } from '@/lib/constants';
import { createPublicClient, siteCacheTag } from '@/lib/supabase/public';
import { sanitizeTenantParam } from '@/lib/validation';

const CACHE_REVALIDATE_SECONDS = 60 * 60; // 1h, los writes invalidan vía tag

export type SiteRow = {
  id: string;
  user_id: string;
  template_id: string;
  is_active: boolean;
};

export type PageRow = {
  id: string;
  site_id: string;
  slug: string;
  title: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  is_home: boolean;
  sort_order: number;
  is_published: boolean;
};

export type ActiveSubRow = {
  plan_type: string;
  status: string;
  current_period_end: string | null;
  trial_end_date: string | null;
  created_at: string;
};

export function fetchSiteCached(domain: string) {
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
        .select('id, user_id, template_id, is_active')
        .eq(column, safe)
        .maybeSingle();

      return (data as SiteRow | null) ?? null;
    },
    ['site-by-domain', domain.toLowerCase()],
    { tags: [siteCacheTag(domain)], revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}

export function fetchSitePagesCached(siteId: string, domain: string) {
  return unstable_cache(
    async (): Promise<PageRow[]> => {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('pages')
        .select('id, site_id, slug, title, content, is_home, sort_order, is_published')
        .eq('site_id', siteId)
        .eq('is_published', true)
        .order('is_home', { ascending: false })
        .order('sort_order', { ascending: true });

      return (data as PageRow[]) ?? [];
    },
    ['pages-by-site', siteId],
    { tags: [siteCacheTag(domain)], revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}

export function fetchActiveSubCached(userId: string) {
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

// Devuelve la página "home" según `pages`. Devuelve content vacío y title
// neutro si por algún motivo no hay home (no debería pasar — migration 0004
// + endpoint /api/sites garantizan que siempre exista la home page).
export function getHomeContent(_site: SiteRow, pages: PageRow[]) {
  const home = pages.find((p) => p.is_home);
  if (home) {
    return {
      content: home.content ?? {},
      title: home.title ?? 'Inicio',
    };
  }
  return { content: {}, title: 'Inicio' };
}

// ── Catálogo (template tienda-catalogo) ──────────────────────
export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type CatalogProduct = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  image_urls: string[];
  in_stock: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type CatalogSettings = {
  theme_color: string;
  whatsapp_numbers: Array<{ id: string; label: string; phone: string }>;
  banner_title: string | null;
  banner_subtitle: string | null;
  banner_image_url: string | null;
  store_description: string | null;
};

export function fetchCatalogCached(siteId: string, domain: string) {
  return unstable_cache(
    async (): Promise<{
      products: CatalogProduct[];
      categories: CatalogCategory[];
      settings: CatalogSettings | null;
    }> => {
      const supabase = createPublicClient();
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        supabase
          .from('products')
          .select(
            'id, category_id, name, slug, description, price, compare_at_price, image_url, image_urls, in_stock, is_featured, sort_order'
          )
          .eq('site_id', siteId)
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('product_categories')
          .select('id, name, slug, sort_order')
          .eq('site_id', siteId)
          .order('sort_order', { ascending: true }),
        supabase
          .from('store_settings')
          .select(
            'theme_color, whatsapp_numbers, banner_title, banner_subtitle, banner_image_url, store_description'
          )
          .eq('site_id', siteId)
          .maybeSingle(),
      ]);

      return {
        products: (productsRes.data as CatalogProduct[]) ?? [],
        categories: (categoriesRes.data as CatalogCategory[]) ?? [],
        settings: (settingsRes.data as CatalogSettings | null) ?? null,
      };
    },
    ['catalog-by-site', siteId],
    { tags: [siteCacheTag(domain)], revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}
