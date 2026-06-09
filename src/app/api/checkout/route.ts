import { NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PLANS, PlanType } from '@/lib/constants';
import { captureError } from '@/lib/logger';
import { checkoutSchema, parseJson } from '@/lib/schemas';

const TRIAL_DAYS = 14;
const TRIAL_ELIGIBLE_PLANS: PlanType[] = ['basic'];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const parsed = await parseJson(req, checkoutSchema);
    if (!parsed.ok) return parsed.response;
    const { planSlug } = parsed.data;

    const plan = PLANS[planSlug as PlanType];

    if (!plan || plan.price === null) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Trial: solo si el plan lo permite y el usuario no tuvo nunca suscripción.
    const { count: priorSubs } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const isFirstSubscription = (priorSubs ?? 0) === 0;
    const trialApplies =
      isFirstSubscription && TRIAL_ELIGIBLE_PLANS.includes(planSlug as PlanType);

    const now = new Date();
    const trialEndDate = trialApplies
      ? new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
      : null;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });
    const preApproval = new PreApproval(client);

    const autoRecurring: {
      frequency: number;
      frequency_type: 'months' | 'days';
      transaction_amount: number;
      currency_id: string;
      start_date?: string;
    } = {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: plan.price,
      currency_id: 'ARS',
    };
    if (trialEndDate) {
      // MP difiere el primer cobro hasta start_date.
      autoRecurring.start_date = trialEndDate.toISOString();
    }

    const body = {
      reason: `SitioListo - Plan ${plan.name}`,
      auto_recurring: autoRecurring,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.sitiolisto.com.ar'}/cuenta?status=success`,
      payer_email: user.email,
      external_reference: user.id,
    };

    const result = await preApproval.create({ body });

    // Insert con service-role: `subscriptions` no tiene policy de INSERT para
    // el dueño (a propósito — evita que se auto-otorgue un plan). El user_id
    // lo fija el server con la sesión validada, así que es seguro.
    const admin = createAdminClient();
    const { error: subError } = await admin.from('subscriptions').insert({
      user_id: user.id,
      mp_preapproval_id: result.id,
      plan_type: planSlug,
      status: 'pending',
      amount: plan.price,
      trial_end_date: trialEndDate?.toISOString() ?? null,
    });
    if (subError) {
      captureError(subError, { source: 'checkout-sub-insert' });
      return NextResponse.json(
        { error: 'No se pudo registrar la suscripción' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.init_point });
  } catch (error) {
    captureError(error, { source: 'checkout' });
    return NextResponse.json({ error: 'Error al generar checkout' }, { status: 500 });
  }
}
