import { describe, it, expect } from 'vitest';

// Replicamos la lógica "¿está activa esta suscripción?" que vive duplicada
// en webhook MP, /api/sites POST, [domain]/page.tsx y editor.tsx. Si esta
// función cambia, hay que actualizar los 4 lugares en sincronía.
//
// Idealmente extraerla a src/lib/subscription.ts y que los 4 lugares la
// importen — eso es un follow-up.

function isSubscriptionActive(
  sub: {
    status: string;
    current_period_end: string | null;
    trial_end_date: string | null;
  },
  now: number = Date.now()
): boolean {
  if (sub.status === 'authorized') return true;
  if (
    sub.status === 'cancelled' &&
    sub.current_period_end &&
    new Date(sub.current_period_end).getTime() > now
  ) {
    return true;
  }
  if (
    sub.trial_end_date &&
    new Date(sub.trial_end_date).getTime() > now
  ) {
    return true;
  }
  return false;
}

const NOW = new Date('2026-05-15T12:00:00Z').getTime();
const FUTURE = new Date('2026-06-01T00:00:00Z').toISOString();
const PAST = new Date('2026-05-01T00:00:00Z').toISOString();

describe('isSubscriptionActive', () => {
  it('authorized siempre es activa', () => {
    expect(
      isSubscriptionActive(
        { status: 'authorized', current_period_end: null, trial_end_date: null },
        NOW
      )
    ).toBe(true);
  });

  it('cancelled con period_end futuro es activa (período de gracia)', () => {
    expect(
      isSubscriptionActive(
        { status: 'cancelled', current_period_end: FUTURE, trial_end_date: null },
        NOW
      )
    ).toBe(true);
  });

  it('cancelled con period_end pasado NO es activa', () => {
    expect(
      isSubscriptionActive(
        { status: 'cancelled', current_period_end: PAST, trial_end_date: null },
        NOW
      )
    ).toBe(false);
  });

  it('pending con trial vigente es activa', () => {
    expect(
      isSubscriptionActive(
        { status: 'pending', current_period_end: null, trial_end_date: FUTURE },
        NOW
      )
    ).toBe(true);
  });

  it('pending con trial vencido NO es activa', () => {
    expect(
      isSubscriptionActive(
        { status: 'pending', current_period_end: null, trial_end_date: PAST },
        NOW
      )
    ).toBe(false);
  });

  it('paused NO es activa', () => {
    expect(
      isSubscriptionActive(
        { status: 'paused', current_period_end: FUTURE, trial_end_date: null },
        NOW
      )
    ).toBe(false);
  });
});
