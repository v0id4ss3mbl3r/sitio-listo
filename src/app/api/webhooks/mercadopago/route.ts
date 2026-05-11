import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

export async function POST(req: Request) {
  // Usamos el cliente con service_role key porque estamos en un contexto de backend sin usuario autenticado
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
  );

  try {
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    const rawBody = await req.text();
    const data = JSON.parse(rawBody);

    // Validación de firma HMAC (solo en producción)
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !requestId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const secret = process.env.MP_WEBHOOK_SECRET;
      const parts = signature.split(',');
      let ts = '';
      let v1 = '';
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') v1 = value;
      });

      const manifest = `id:${data.data?.id || data.id};request-id:${requestId};ts:${ts};`;
      const hmac = createHmac('sha256', secret || '');
      const digest = hmac.update(manifest).digest('hex');

      if (digest !== v1) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const url = new URL(req.url);
    // Para suscripciones, MercadoPago usa 'type=subscription_preapproval'
    const type = url.searchParams.get('type') || data.type;

    if (type === 'subscription_preapproval') {
      const preapprovalId = data.data?.id || data.id;
      
      // Llamar a la API de MP para obtener el estado actual
      const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        }
      });
      
      const subscriptionData = await mpResponse.json();
      const userId = subscriptionData.external_reference;

      // Mapeo de estados de MP a nuestro sistema
      let status = 'pending';
      if (subscriptionData.status === 'authorized') status = 'authorized';
      if (subscriptionData.status === 'paused') status = 'paused';
      if (subscriptionData.status === 'cancelled') status = 'cancelled';

      // Actualizar en Supabase
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('mp_preapproval_id', preapprovalId);

      if (subError) throw subError;

      // Ítem 5: Actualizar sites.is_active basado en el estado
      if (userId) {
        const isActive = status === 'authorized';
        await supabaseAdmin
          .from('sites')
          .update({ is_active: isActive })
          .eq('user_id', userId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
