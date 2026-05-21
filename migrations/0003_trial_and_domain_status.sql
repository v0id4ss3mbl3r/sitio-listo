-- =============================================================
-- Migration 0003: trial de 14 días + estado de custom_domain
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. subscriptions.trial_end_date
--    Se setea al crear la primera suscripción Básico del usuario
--    (MercadoPago la marca como authorized de entrada pero el primer
--    cobro real se difiere 14 días vía auto_recurring.start_date).
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;

-- Helper para queries "¿está activo o en período de gracia post-cancelación?"
-- Considera: authorized siempre, cancelled si current_period_end > now,
-- y trial: status=pending/authorized con trial_end_date > now.
CREATE OR REPLACE FUNCTION public.subscription_is_active(
  status TEXT,
  current_period_end TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
  SELECT
    status = 'authorized'
    OR (status = 'cancelled' AND current_period_end IS NOT NULL AND current_period_end > NOW())
    OR (trial_end_date IS NOT NULL AND trial_end_date > NOW());
$$ LANGUAGE sql STABLE;

-- ─────────────────────────────────────────────────────────────
-- 2. sites.custom_domain_status
--    pending: usuario lo cargó pero falta verificación DNS
--    verified: confirmado, debería servir tráfico
--    failed: DNS no resuelve / configuración rota
--    NULL: no hay custom domain
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS custom_domain_status TEXT
  CHECK (custom_domain_status IS NULL OR custom_domain_status IN ('pending', 'verified', 'failed'));
