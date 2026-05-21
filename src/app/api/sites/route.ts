import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canUseTemplate } from '@/lib/constants';
import { validateCustomDomain, validateSubdomain } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { subdomain: rawSubdomain, custom_domain: rawCustomDomain, template_id, config } = body;

    if (!rawSubdomain || !template_id) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const subdomainResult = validateSubdomain(rawSubdomain);
    if (!subdomainResult.ok) {
      return NextResponse.json({ error: subdomainResult.error }, { status: 400 });
    }
    const subdomain = subdomainResult.value;

    const customDomainResult = validateCustomDomain(rawCustomDomain);
    if (!customDomainResult.ok) {
      return NextResponse.json({ error: customDomainResult.error }, { status: 400 });
    }
    const custom_domain = customDomainResult.value || null;

    // Verificar si el subdominio ya existe
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id, user_id')
      .eq('subdomain', subdomain)
      .maybeSingle();

    if (existingSite && existingSite.user_id !== user.id) {
      return NextResponse.json({ error: 'El subdominio ya está en uso' }, { status: 409 });
    }

    // Determinar plan vigente — acepta authorized, cancelled-con-gracia y trial.
    const { data: allSubs } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end, trial_end_date, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const now = Date.now();
    const activeSub = (allSubs ?? []).find((s) => {
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

    const userPlanType = activeSub?.plan_type ?? 'free';

    if (userPlanType === 'free') {
      return NextResponse.json(
        { error: 'Necesitás un plan activo para publicar un sitio' },
        { status: 403 }
      );
    }

    if (!canUseTemplate(userPlanType, template_id)) {
      return NextResponse.json(
        { error: 'Tu plan no incluye acceso a esta plantilla' },
        { status: 403 }
      );
    }

    // Upsert (crear o actualizar) el sitio del usuario.
    // TODO Sprint 1.5: aceptar siteId explícito y aplicar PLAN_SITE_LIMITS para Extremo.
    // Hoy seguimos forzando un único sitio por usuario.
    const { data: userSite } = await supabase
      .from('sites')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let result;
    if (userSite) {
      // Custom domain status: si cambió el dominio, vuelve a 'pending'.
      // Si lo quitaron, status pasa a null.
      const { data: existingDomain } = await supabase
        .from('sites')
        .select('custom_domain, custom_domain_status')
        .eq('id', userSite.id)
        .maybeSingle();

      let customDomainStatus: string | null = existingDomain?.custom_domain_status ?? null;
      if (!custom_domain) {
        customDomainStatus = null;
      } else if (existingDomain?.custom_domain !== custom_domain) {
        customDomainStatus = 'pending';
      }

      result = await supabase
        .from('sites')
        .update({
          subdomain,
          custom_domain,
          custom_domain_status: customDomainStatus,
          template_id,
          config,
          plan_type: userPlanType,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userSite.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('sites')
        .insert({
          user_id: user.id,
          subdomain,
          custom_domain,
          custom_domain_status: custom_domain ? 'pending' : null,
          template_id,
          config,
          plan_type: userPlanType,
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, site: result.data });
  } catch (error) {
    console.error('Sites API Error:', error);
    const message = error instanceof Error ? error.message : 'Error al guardar el sitio';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found", which is fine

    return NextResponse.json({ site: data || null });
  } catch (error) {
    console.error('Sites API Error:', error);
    return NextResponse.json({ error: 'Error al obtener el sitio' }, { status: 500 });
  }
}
