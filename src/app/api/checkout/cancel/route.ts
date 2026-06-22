import { NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { captureError } from '@/lib/logger';

export async function POST() {
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

    // Escrituras con service-role: subscriptions/sites no tienen policy de
    // UPDATE para el dueño (a propósito — billing). El scope (id / user.id) lo
    // fija el server con la sesión validada.
    const admin = createAdminClient();

    const { error: subError } = await admin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscription.id);
    if (subError) throw subError;

    // Desactivar el sitio.
    const { error: siteError } = await admin
      .from('sites')
      .update({ is_active: false })
      .eq('user_id', user.id);
    if (siteError) throw siteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'checkout-cancel' });
    return NextResponse.json({ error: 'Error al cancelar la suscripción' }, { status: 500 });
  }
}
