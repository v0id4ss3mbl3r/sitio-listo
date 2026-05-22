import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { isAdmin as checkIsAdmin } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';

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
  planType: 'pro' | 'extremo' | 'personalizado';
  admin: boolean;
};

type CtxResult = { ok: true; ctx: Context } | { ok: false; response: Response };

// Verifica: usuario logueado, tiene sitio, sitio usa template tienda-catalogo,
// plan vigente incluye catálogo. Admin se trata como Extremo.
export async function loadCatalogContext(): Promise<CtxResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    };
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id, template_id, subdomain, custom_domain')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!site) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'No tenés un sitio creado' },
        { status: 400 }
      ),
    };
  }

  if (site.template_id !== 'tienda-catalogo') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'El catálogo solo está disponible en sitios con la plantilla Tienda Catálogo' },
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
      if (s.trial_end_date && new Date(s.trial_end_date).getTime() > now) {
        return true;
      }
      return false;
    });

    planType = active?.plan_type ?? 'free';
  }

  if (planType !== 'pro' && planType !== 'extremo' && planType !== 'personalizado') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Necesitás plan Pro o Extremo para gestionar el catálogo' },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    ctx: { supabase, user, site, planType: planType as Context['planType'], admin },
  };
}
