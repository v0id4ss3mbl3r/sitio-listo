import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';

import { isProduction } from '@/lib/env';

type SubStatus = 'pending' | 'authorized' | 'paused' | 'cancelled';

function mapMpStatus(mp: string | undefined): SubStatus {
  if (mp === 'authorized') return 'authorized';
  if (mp === 'paused') return 'paused';
  if (mp === 'cancelled') return 'cancelled';
  return 'pending';
}

function verifySignature(params: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string;
  secret: string | undefined;
}): boolean {
  const { signatureHeader, requestId, dataId, secret } = params;
  if (!signatureHeader || !requestId || !secret) return false;

  let ts = '';
  let v1 = '';
  for (const part of signatureHeader.split(',')) {
    const [k, v] = part.split('=');
    if (k?.trim() === 'ts') ts = v?.trim() ?? '';
    if (k?.trim() === 'v1') v1 = v?.trim() ?? '';
  }
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const digest = createHmac('sha256', secret).update(manifest).digest('hex');

  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(v1, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const signatureHeader = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    const rawBody = await req.text();
    const data = JSON.parse(rawBody);
    const dataId = String(data.data?.id ?? data.id ?? '');

    // ── Validación de firma ────────────────────────────────────────────────
    // Si MP_WEBHOOK_SECRET está configurado, validamos siempre (incluso en dev).
    // Solo se omite si la variable está vacía y no estamos en producción.
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (secret) {
      const ok = verifySignature({ signatureHeader, requestId, dataId, secret });
      if (!ok) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else if (isProduction()) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // ── Idempotencia ───────────────────────────────────────────────────────
    if (requestId) {
      const { data: already } = await supabaseAdmin
        .from('processed_webhooks')
        .select('request_id')
        .eq('request_id', requestId)
        .maybeSingle();

      if (already) {
        return NextResponse.json({ success: true, deduped: true });
      }
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || data.type;

    if (type === 'subscription_preapproval') {
      const preapprovalId = dataId;

      const mpResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        }
      );
      const subscriptionData = await mpResponse.json();
      const userId: string | undefined = subscriptionData.external_reference;
      const status = mapMpStatus(subscriptionData.status);

      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('mp_preapproval_id', preapprovalId);

      if (subError) throw subError;

      // ── Scope agregado: solo apagar/encender sitios según TODAS las
      //    suscripciones del usuario, no solo la que vino en este evento.
      //    Así una cancelación vieja no apaga sitios del plan vigente.
      if (userId) {
        const { count } = await supabaseAdmin
          .from('subscriptions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'authorized');

        const userHasActiveSub = (count ?? 0) > 0;

        await supabaseAdmin
          .from('sites')
          .update({ is_active: userHasActiveSub })
          .eq('user_id', userId);
      }

      if (requestId) {
        await supabaseAdmin.from('processed_webhooks').insert({
          request_id: requestId,
          source: 'mercadopago',
          preapproval_id: preapprovalId,
          status_applied: status,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
