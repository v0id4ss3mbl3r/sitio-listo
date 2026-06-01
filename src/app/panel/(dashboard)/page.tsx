import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PLANS, PlanType } from '@/lib/constants';
import { getRequestAuth } from '@/lib/auth/requestAuth';

export default async function PanelPage() {
  // El middleware ya validó la sesión y reenvió el user id por header → no
  // re-llamamos getUser() (una ida-y-vuelta de red menos). Fallback defensivo
  // a getUser() si el header no estuviera (fuera del flujo de middleware).
  const auth = await getRequestAuth();
  const supabase = await createClient();
  let userId = auth?.userId ?? null;
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }
  if (!userId) {
    redirect('/login');
  }

  // Perfil, sitio y suscripción en paralelo (son independientes) → 1 sola
  // tanda de round-trips en vez de 3 en serie. maybeSingle evita el error
  // ruidoso cuando todavía no hay sitio/suscripción.
  const [{ data: profile }, { data: site }, { data: subscription }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('sites')
      .select('id, subdomain, is_active, template_id')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', userId)
      .eq('status', 'authorized')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Emprendedor';

  const planName = subscription ? PLANS[subscription.plan_type as PlanType]?.name : 'Plan Gratuito';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          ¡Hola, {firstName}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
          Acá tenés un resumen del estado de tu sitio web.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Tarjeta de Estado del Sitio */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tu Sitio Web</h3>
          </div>
          
          {!site ? (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Aún no has configurado tu sitio. Elegí una plantilla y un subdominio para empezar.
              </p>
              <Link href="/editor" className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                Configurar Sitio
              </Link>
            </>
          ) : site.is_active ? (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>URL pública:</p>
                <a 
                  href={`https://${site.subdomain}.sitiolisto.com.ar`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
                >
                  {site.subdomain}.sitiolisto.com.ar ↗
                </a>
              </div>
              <Link href="/editor" className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                Editar Sitio
              </Link>
            </>
          ) : (
            <>
              <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                Tu sitio está pausado debido a que no tienes una suscripción activa.
              </p>
              <Link href="/cuenta" className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                Reactivar Plan
              </Link>
            </>
          )}
        </div>

        {/* Tarjeta de Suscripción */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Suscripción</h3>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {planName}
              </span>
              {subscription?.status === 'authorized' && (
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  Activo
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {subscription?.status === 'authorized' 
                ? `Tu plan ${planName} está funcionando correctamente.`
                : 'No tenés ninguna suscripción activa en MercadoPago.'}
            </p>
          </div>

          <Link href="/cuenta" className="btn-outline" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
            {subscription?.status === 'authorized' ? 'Gestionar Plan' : 'Ver Planes'}
          </Link>
        </div>

      </div>
    </div>
  );
}
