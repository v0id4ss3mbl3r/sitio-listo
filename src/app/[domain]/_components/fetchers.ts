import { unstable_cache } from 'next/cache';

import { CUSTOM_DOMAIN_REGEX, SUBDOMAIN_REGEX } from '@/lib/constants';
import { createPublicClient, siteCacheTag } from '@/lib/supabase/public';
import { sanitizeTenantParam } from '@/lib/validation';

const CACHE_REVALIDATE_SECONDS = 60 * 60; // 1h, los writes invalidan vía tag

export type SiteRow = {
  id: string;
  user_id: string;
  template_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any> | null;
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
        .select('id, user_id, template_id, config, is_active')
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

// Devuelve la página "home" según `pages`. Fallback a sites.config para
// sitios que todavía no fueron backfilleados o que perdieron su home.
export function getHomeContent(site: SiteRow, pages: PageRow[]) {
  const home = pages.find((p) => p.is_home);
  if (home && home.content) {
    return {
      content: home.content,
      title: home.title ?? site.config?.name ?? 'Inicio',
    };
  }
  return {
    content: site.config ?? {},
    title: site.config?.name ?? 'Inicio',
  };
}
