import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos el cliente con service_role key porque estamos en un contexto de backend sin usuario autenticado
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    // Para suscripciones, MercadoPago usa 'type=subscription_preapproval'
    const type = url.searchParams.get('type') || (await req.clone().json()).type;
    const data = await req.json();

    if (type === 'subscription_preapproval') {
      const preapprovalId = data.data.id;
      
      // Llamar a la API de MP para obtener el estado actual
      const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        }
      });
      
      const subscriptionData = await mpResponse.json();

      // Mapeo de estados de MP a nuestro sistema
      let status = 'pending';
      if (subscriptionData.status === 'authorized') status = 'authorized';
      if (subscriptionData.status === 'paused') status = 'paused';
      if (subscriptionData.status === 'cancelled') status = 'cancelled';

      // Actualizar en Supabase
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('mp_preapproval_id', preapprovalId);

      if (error) {
        console.error('Error actualizando suscripción en Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
