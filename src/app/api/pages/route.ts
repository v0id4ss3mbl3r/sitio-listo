import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { PLAN_PAGE_LIMITS, PlanType } from '@/lib/constants';
import { isAdmin } from '@/lib/auth/getAdminUser';
import { captureError } from '@/lib/logger';
import { createPageSchema, parseJson } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { siteCacheTag } from '@/lib/supabase/public';

// Devuelve la subscripción "activa" del usuario (authorized, gracia, trial)
// y null si no tiene plan vigente.
async function getActivePlanType(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<PlanType | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan_type, status, current_period_end, trial_end_date, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const now = Date.now();
  const active = (data ?? []).find((s) => {
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

  return (active?.plan_type as PlanType | undefined) ?? null;
}

// Carga el sitio del usuario actual + datos útiles para gating.
async function loadUserSite(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<{ id: string; subdomain: string; custom_domain: string | null } | null> {
  const { data } = await supabase
    .from('sites')
    .select('id, subdomain, custom_domain')
    .eq('user_id', userId)
    .maybeSingle();
  return data ?? null;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const site = await loadUserSite(supabase, user.id);
    if (!site) {
      return NextResponse.json({ pages: [] });
    }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', site.id)
      .order('is_home', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ pages: data ?? [] });
  } catch (error) {
    captureError(error, { source: 'pages-get' });
    return NextResponse.json({ error: 'Error al obtener páginas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const parsed = await parseJson(req, createPageSchema);
    if (!parsed.ok) return parsed.response;
    const { slug, title, content, is_home, sort_order, is_published } = parsed.data;

    const site = await loadUserSite(supabase, user.id);
    if (!site) {
      return NextResponse.json({ error: 'No tenés un sitio creado' }, { status: 400 });
    }

    const admin = await isAdmin(supabase, user.id);

    if (!admin) {
      const planType = await getActivePlanType(supabase, user.id);
      if (!planType) {
        return NextResponse.json(
          { error: 'Necesitás un plan activo para gestionar páginas' },
          { status: 403 }
        );
      }

      const { count } = await supabase
        .from('pages')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id);

      const limit = PLAN_PAGE_LIMITS[planType] ?? 1;
      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Tu plan permite hasta ${limit === Infinity ? '∞' : limit} páginas. Borrá o despublicá alguna para crear otra.`,
          },
          { status: 403 }
        );
      }
    }

    // is_home solo se permite si el sitio aún no tiene home. Y si se pide
    // is_home, el slug se fuerza a '' por convención.
    const finalIsHome = !!is_home;
    let finalSlug = slug;
    if (finalIsHome) {
      finalSlug = '';
      const { count: homeCount } = await supabase
        .from('pages')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id)
        .eq('is_home', true);
      if ((homeCount ?? 0) > 0) {
        return NextResponse.json(
          { error: 'Este sitio ya tiene una página marcada como home' },
          { status: 409 }
        );
      }
    } else if (finalSlug === '') {
      return NextResponse.json(
        { error: 'Solo la página home puede tener slug vacío' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pages')
      .insert({
        site_id: site.id,
        slug: finalSlug,
        title,
        content,
        is_home: finalIsHome,
        sort_order,
        is_published,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una página con ese slug en tu sitio' },
          { status: 409 }
        );
      }
      throw error;
    }

    if (site.subdomain) revalidateTag(siteCacheTag(site.subdomain), 'max');
    if (site.custom_domain) revalidateTag(siteCacheTag(site.custom_domain), 'max');

    return NextResponse.json({ page: data });
  } catch (error) {
    captureError(error, { source: 'pages-post' });
    return NextResponse.json({ error: 'Error al crear la página' }, { status: 500 });
  }
}
