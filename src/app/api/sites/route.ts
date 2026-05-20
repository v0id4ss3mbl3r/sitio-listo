import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    // Obtener el plan actual del usuario
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('status', 'authorized')
      .single();

    const userPlanType = subscription?.plan_type || 'basic';

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
      // Actualizar
      result = await supabase
        .from('sites')
        .update({
          subdomain,
          custom_domain,
          template_id,
          config,
          plan_type: userPlanType,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userSite.id)
        .select()
        .single();
    } else {
      // Crear
      result = await supabase
        .from('sites')
        .insert({
          user_id: user.id,
          subdomain,
          custom_domain,
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
