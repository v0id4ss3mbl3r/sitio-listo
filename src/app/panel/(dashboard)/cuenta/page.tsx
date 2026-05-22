'use client';

import { useState, useEffect } from 'react';
import { PLANS, PlanType } from '@/lib/constants';
import { createClient } from '@/lib/supabase/browser';

export default function CuentaPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
        window.location.href = data.url;
      } else {
        setNotification({ type: 'error', message: data.error || 'Ocurrió un error al generar el checkout' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error de conexión' });
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setLoading('cancel');
    try {
      const res = await fetch('/api/checkout/cancel', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.error) {
        setNotification({ type: 'error', message: data.error });
      } else {
        setNotification({ type: 'success', message: 'Suscripción cancelada correctamente.' });
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error al cancelar' });
    }
    setLoading(null);
    setShowCancelModal(false);
  };

  const plans = Object.values(PLANS).filter(
    (p) => p.slug !== 'test' && p.slug !== 'personalizado'
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Tu Suscripción
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gestioná tu plan y métodos de pago</p>
      </header>

      {/* Estado actual */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Plan Actual
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {currentSubscription ? PLANS[currentSubscription.plan_type as PlanType]?.name : 'Plan Gratuito'}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '600',
                background: currentSubscription?.status === 'authorized' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: currentSubscription?.status === 'authorized' ? '#10b981' : '#f59e0b',
              }}>
                {currentSubscription?.status === 'authorized' ? 'Activo' : 'Sin suscripción'}
              </span>
            </div>
          </div>

          {currentSubscription?.status === 'authorized' && (
            <div style={{
              padding: '1.5rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flex: 1,
              minWidth: '300px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h4 style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '600' }}>Zona de Peligro</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Al cancelar, tu sitio se desactivará inmediatamente.</p>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={loading !== null}
                style={{
                  padding: '0.625rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  background: 'transparent',
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading !== null ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {loading === 'cancel' ? 'Cancelando...' : 'Cancelar'}
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Elegir un nuevo plan
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan_type === plan.slug && currentSubscription?.status === 'authorized';

          return (
            <div
              key={plan.slug}
              className="glass-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                border: plan.highlighted ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(99, 102, 241, 0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-30px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.35rem 1.5rem',
                  transform: 'rotate(45deg)',
                }}>
                  Pro
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                  {plan.name}
                </span>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{plan.priceDisplay}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>/mes</span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5rem', marginBottom: '2rem', flex: 1 }}>
                {plan.description}
              </p>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <svg style={{ marginTop: '0.125rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (isCurrentPlan || loading !== null) ? 0.5 : 1,
                  cursor: (isCurrentPlan || loading !== null) ? 'not-allowed' : 'pointer',
                }}
              >
                {loading === plan.slug ? 'Generando...' : isCurrentPlan ? 'Tu Plan Actual' : `Elegir ${plan.name}`}
              </button>
            </div>
          );
        })}

        {/* Card Plan Personalizado */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>
              Personalizado
            </span>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>A consultar</span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5rem', marginBottom: '2rem', flex: 1 }}>
            {PLANS.personalizado.description}
          </p>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {PLANS.personalizado.features.map((feature) => (
              <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <svg style={{ marginTop: '0.125rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <a
            href="mailto:contacto@sitiolisto.com.ar?subject=Plan%20Personalizado%20SitioListo"
            className="btn-outline"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Contactar
          </a>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              ¿Confirmás la cancelación?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Tu sitio web dejará de estar online inmediatamente. Esta acción no se puede deshacer hasta que vuelvas a suscribirte.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="btn-outline"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Volver
              </button>
              <button 
                onClick={handleCancel}
                disabled={loading === 'cancel'}
                style={{ 
                  flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
                  background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer'
                }}
              >
                {loading === 'cancel' ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification && (
        <div style={{
          position: 'fixed', top: '2rem', right: '2rem', zIndex: 200,
          padding: '1rem 1.5rem', borderRadius: '10px',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white', fontSize: '0.9rem', fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          {notification.type === 'success' ? '✓ ' : '✕ '}{notification.message}
        </div>
      )}
    </div>
  );
}
