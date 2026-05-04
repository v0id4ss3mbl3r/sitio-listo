'use client';

import { useState, useEffect } from 'react';
import { PLANS, PlanType } from '@/lib/constants';
import { createClient } from '@/lib/supabase/browser';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CuentaPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCurrentSubscription(data);
      }
    }
    loadSubscription();
  }, [supabase]);

  const handleSubscribe = async (planSlug: PlanType) => {
    setLoading(planSlug);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSlug }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirigir a MercadoPago
      } else {
        alert(data.error || 'Ocurrió un error al generar el checkout');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  const plans = Object.values(PLANS);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Tu Suscripción
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Gestioná tu plan y métodos de pago
          </p>
        </div>
      </header>

      {/* Estado actual */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Actual</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentSubscription ? PLANS[currentSubscription.plan_type as PlanType]?.name : 'Plan Gratuito (Demo)'}
            </span>
            {currentSubscription?.status === 'authorized' && (
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                Activo
              </span>
            )}
            {currentSubscription?.status === 'pending' && (
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                Pendiente de pago
              </span>
            )}
          </div>
        </div>
        {currentSubscription?.status === 'authorized' && (
          <button className="btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Cancelar suscripción
          </button>
        )}
      </div>

      {/* Pricing Table (Reutilizada adaptada para Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan_type === plan.slug && currentSubscription?.status === 'authorized';

          return (
            <div
              key={plan.slug}
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                ...(plan.highlighted ? { border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)' } : {}),
              }}
            >
              {plan.highlighted && (
                <div style={{ position: 'absolute', top: '1rem', right: '-2rem', background: 'var(--gradient-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 3rem', transform: 'rotate(45deg)' }}>
                  Recomendado
                </div>
              )}

              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {plan.name}
              </span>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.priceDisplay}</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>/mes</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {plan.description}
              </p>

              <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', margin: '1.5rem 0' }} />

              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.slug as PlanType)}
                disabled={isCurrentPlan || loading !== null}
                className={plan.highlighted ? 'btn-primary' : 'btn-outline'}
                style={{ marginTop: '2rem', width: '100%', opacity: isCurrentPlan ? 0.5 : 1, cursor: isCurrentPlan ? 'not-allowed' : 'pointer' }}
              >
                {loading === plan.slug ? 'Generando...' : isCurrentPlan ? 'Plan Actual' : `Suscribirme a ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
