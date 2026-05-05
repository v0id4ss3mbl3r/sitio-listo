import { NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar la suscripción activa
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'authorized')
      .single();

    if (!subscription || !subscription.mp_preapproval_id) {
      return NextResponse.json({ error: 'No tienes una suscripción activa para cancelar' }, { status: 404 });
    }

    // Inicializar SDK MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN || '' 
    });
    const preApproval = new PreApproval(client);

    // Cancelar en MercadoPago
    await preApproval.update({
      id: subscription.mp_preapproval_id,
      body: { status: 'cancelled' },
    });

    // Actualizar estado localmente
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscription.id);

    // Desactivar el sitio
    await supabase
      .from('sites')
      .update({ is_active: false })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    return NextResponse.json({ error: 'Error al cancelar la suscripción' }, { status: 500 });
  }
}
