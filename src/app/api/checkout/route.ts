import { NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';
import { PLANS, PlanType } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { planSlug } = await req.json();
    const plan = PLANS[planSlug as PlanType];

    if (!plan) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Inicializar SDK MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN || '' 
    });
    const preApproval = new PreApproval(client);

    const body = {
      reason: `SitioListo - Plan ${plan.name}`,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: plan.price,
        currency_id: 'ARS',
      },
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/cuenta?status=success`,
      payer_email: user.email,
      external_reference: user.id, // Para identificar de quién es en el webhook
    };

    const result = await preApproval.create({ body });

    // Guardar la suscripción inicial (pendiente) en Supabase
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      mp_preapproval_id: result.id,
      plan_type: planSlug,
      status: 'pending',
      amount: plan.price,
    });

    return NextResponse.json({ url: result.init_point });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Error al generar checkout' }, { status: 500 });
  }
}
