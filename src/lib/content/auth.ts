import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { isAdmin as checkIsAdmin } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';
import { TEMPLATE_COLLECTIONS, type SiteItemKind } from '@/lib/constants';

type Site = {
  id: string;
  template_id: string;
  subdomain: string;
  custom_domain: string | null;
};

type Context = {
  supabase: SupabaseClient;
  user: User;
  site: Site;
  kinds: SiteItemKind[];
  planType: 'pro' | 'extremo' | 'personalizado';
  admin: boolean;
};

type CtxResult = { ok: true; ctx: Context } | { ok: false; response: Response };

// Verifica: usuario logueado, tiene sitio, la plantilla del sitio usa
// site_items (TEMPLATE_COLLECTIONS), y plan vigente Pro+. Admin = Extremo.
// Análogo a loadCatalogContext, pero genérico para cualquier plantilla con
// colecciones de contenido.
export async function loadContentContext(): Promise<CtxResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id, template_id, subdomain, custom_domain')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!site) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No tenés un sitio creado' }, { status: 400 }),
    };
  }

  const kinds = TEMPLATE_COLLECTIONS[site.template_id];
  if (!kinds) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'La plantilla de tu sitio no gestiona contenido administrable' },
        { status: 400 }
      ),
    };
  }

  const admin = await checkIsAdmin(supabase, user.id);

  let planType: string;
  if (admin) {
    planType = 'extremo';
  } else {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end, trial_end_date, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const now = Date.now();
    const active = (subs ?? []).find((s) => {
      if (s.status === 'authorized') return true;
      if (
        s.status === 'cancelled' &&
        s.current_period_end &&
        new Date(s.current_period_end).getTime() > now
      ) {
        return true;
      }
      if (s.trial_end_date && new Date(s.trial_end_date).getTime() > now) return true;
      return false;
    });

    planType = active?.plan_type ?? 'free';
  }

  if (planType !== 'pro' && planType !== 'extremo' && planType !== 'personalizado') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Necesitás plan Pro o Extremo para gestionar el contenido' },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    ctx: { supabase, user, site, kinds, planType: planType as Context['planType'], admin },
  };
}
