'use client';

import { useState, useEffect } from 'react';
import { PLANS, PlanType } from '@/lib/constants';
import { createClient } from '@/lib/supabase/browser';

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
        window.location.href = data.url;
      } else {
        alert(data.error || 'Ocurrió un error al generar el checkout');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de que querés cancelar tu suscripción? Tu sitio web dejará de estar online inmediatamente.')) return;
    
    setLoading('cancel');
    try {
      const res = await fetch('/api/checkout/cancel', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert('Suscripción cancelada correctamente.');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al cancelar');
    }
    setLoading(null);
  };

  const plans = Object.values(PLANS);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Tu Suscripción
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">Gestioná tu plan y métodos de pago</p>
      </header>

      {/* Estado actual */}
      <div className="glass-card p-6 sm:p-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Plan Actual</h3>
            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                {currentSubscription ? PLANS[currentSubscription.plan_type as PlanType]?.name : 'Plan Gratuito'}
              </span>
              <span className={`
                px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase
                ${currentSubscription?.status === 'authorized' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}
              `}>
                {currentSubscription?.status === 'authorized' ? 'Activo' : 'Sin suscripción'}
              </span>
            </div>
          </div>

          {currentSubscription?.status === 'authorized' && (
            <div className="p-4 sm:p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-rose-500 text-sm font-bold tracking-tight">Zona de Peligro</h4>
                <p className="text-xs text-[var(--text-secondary)]">Al cancelar, tu sitio se desactivará inmediatamente.</p>
              </div>
              <button 
                onClick={handleCancel}
                disabled={loading !== null}
                className="whitespace-nowrap px-6 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
              >
                {loading === 'cancel' ? 'Cancelando...' : 'Cancelar Suscripción'}
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-8 text-[var(--text-primary)] tracking-tight">Elegir un nuevo plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan_type === plan.slug && currentSubscription?.status === 'authorized';

          return (
            <div
              key={plan.slug}
              className={`
                glass-card p-8 flex flex-col relative overflow-hidden transition-all
                ${plan.highlighted ? 'border-indigo-500/40 shadow-glow scale-[1.02] z-10' : 'hover:scale-[1.01]'}
              `}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-8 py-1 tracking-widest transform rotate-45 translate-x-8 translate-y-4">
                  PRO
                </div>
              )}

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  {plan.name}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{plan.priceDisplay}</span>
                  <span className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">/mes</span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-xs text-[var(--text-secondary)] font-medium">
                    <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.slug as PlanType)}
                disabled={isCurrentPlan || loading !== null}
                className={`
                  w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
                  ${plan.highlighted ? 'btn-primary' : 'btn-outline'}
                  ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading === plan.slug ? 'Generando...' : isCurrentPlan ? 'Tu Plan Actual' : `Elegir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
