import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { isAdmin } from '@/lib/auth/getAdminUser';
import {
  DOMAIN_APEX_IP,
  DOMAIN_CNAME_TARGET,
  canUseCustomDomain,
} from '@/lib/constants';
import { checkDomainDns } from '@/lib/domainDns';
import { captureError } from '@/lib/logger';
import { createAdminClient } from '@/lib/supabase/admin';
import { siteCacheTag } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase/server';
import { validateCustomDomain } from '@/lib/validation';

// `node:dns` no existe en el runtime Edge.
export const runtime = 'nodejs';

/**
 * Verifica que el dominio propio del usuario ya apunte a nuestra
 * infraestructura y actualiza el badge del editor en consecuencia.
 *
 * Reemplaza el "contactanos para verificar el dominio": antes el estado se
 * cambiaba a mano en la base.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: site } = await supabase
      .from('sites')
      .select('id, custom_domain, custom_domain_status, plan_type')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!site) {
      return NextResponse.json(
        { error: 'Todavía no configuraste tu sitio' },
        { status: 404 }
      );
    }

    if (!site.custom_domain) {
      return NextResponse.json(
        { error: 'Este sitio no tiene un dominio propio configurado' },
        { status: 400 }
      );
    }

    // Admin bypass, igual que en POST /api/sites.
    const admin = await isAdmin(supabase, user.id);
    if (!admin && !canUseCustomDomain(site.plan_type ?? 'free')) {
      return NextResponse.json(
        { error: 'Tu plan no incluye dominio propio' },
        { status: 403 }
      );
    }

    // El dominio ya se validó al guardarlo, pero lo revalidamos antes de
    // mandarlo al resolver: es un valor que viene de la base.
    const domainResult = validateCustomDomain(site.custom_domain);
    if (!domainResult.ok) {
      return NextResponse.json({ error: domainResult.error }, { status: 400 });
    }

    const check = await checkDomainDns(domainResult.value);

    if (check.status !== site.custom_domain_status) {
      // Las escrituras a `sites` van con service-role: no hay policy de UPDATE
      // para el dueño (migration 0016). Acá ya validamos auth + plan y todo se
      // scopea al site.id del usuario de la sesión.
      const { error } = await createAdminClient()
        .from('sites')
        .update({
          custom_domain_status: check.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', site.id);

      if (error) throw error;

      if (check.status === 'verified') {
        revalidateTag(siteCacheTag(domainResult.value), 'max');
      }
    }

    return NextResponse.json({
      status: check.status,
      records: check.records,
      expected: { cname: DOMAIN_CNAME_TARGET, a: DOMAIN_APEX_IP },
    });
  } catch (error) {
    captureError(error, { source: 'sites-verify-domain' });
    return NextResponse.json(
      { error: 'No pudimos verificar el dominio' },
      { status: 500 }
    );
  }
}
