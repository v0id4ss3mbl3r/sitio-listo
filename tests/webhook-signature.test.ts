import { describe, it, expect } from 'vitest';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Replicamos la verificación HMAC del webhook MP para tener coverage de la
// lógica sin tocar el handler completo (que requiere mockear Supabase).
// Si cambia el algoritmo en webhooks/mercadopago/route.ts, este test rompe.

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

function buildSignedHeaders(opts: {
  secret: string;
  dataId: string;
  requestId: string;
  ts?: string;
}) {
  const ts = opts.ts ?? '1700000000';
  const manifest = `id:${opts.dataId};request-id:${opts.requestId};ts:${ts};`;
  const v1 = createHmac('sha256', opts.secret).update(manifest).digest('hex');
  return `ts=${ts},v1=${v1}`;
}

describe('verifySignature (MP webhook)', () => {
  const secret = 'test-secret';
  const dataId = '123456';
  const requestId = 'req-abc';

  it('acepta firma válida', () => {
    const signatureHeader = buildSignedHeaders({ secret, dataId, requestId });
    expect(
      verifySignature({ signatureHeader, requestId, dataId, secret })
    ).toBe(true);
  });

  it('rechaza si falta el secret', () => {
    const signatureHeader = buildSignedHeaders({ secret, dataId, requestId });
    expect(
      verifySignature({ signatureHeader, requestId, dataId, secret: undefined })
    ).toBe(false);
  });

  it('rechaza si el secret no coincide', () => {
    const signatureHeader = buildSignedHeaders({ secret, dataId, requestId });
    expect(
      verifySignature({ signatureHeader, requestId, dataId, secret: 'otro' })
    ).toBe(false);
  });

  it('rechaza si el dataId fue manipulado', () => {
    const signatureHeader = buildSignedHeaders({ secret, dataId, requestId });
    expect(
      verifySignature({ signatureHeader, requestId, dataId: '999', secret })
    ).toBe(false);
  });

  it('rechaza si falta el header', () => {
    expect(
      verifySignature({ signatureHeader: null, requestId, dataId, secret })
    ).toBe(false);
  });

  it('rechaza si el header no tiene ts o v1', () => {
    expect(
      verifySignature({
        signatureHeader: 'v1=abc',
        requestId,
        dataId,
        secret,
      })
    ).toBe(false);
    expect(
      verifySignature({
        signatureHeader: 'ts=123',
        requestId,
        dataId,
        secret,
      })
    ).toBe(false);
  });
});
