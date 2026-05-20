-- =============================================================
-- Migration 0002: tabla para idempotencia de webhooks de MercadoPago
-- Evita reprocesar eventos cuando MP reintenta entregas.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  request_id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'mercadopago',
  preapproval_id TEXT,
  status_applied TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_preapproval
  ON public.processed_webhooks(preapproval_id);

-- Esta tabla solo se escribe/lee desde el webhook (service_role).
-- No exponer vía RLS — habilitamos pero sin policies de lectura pública.
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;
