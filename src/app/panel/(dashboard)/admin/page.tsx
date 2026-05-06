import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminOverviewPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const adminClient = createAdminClient();

  const [
    { count: totalUsers, error: e1 },
    { count: activeSubs, error: e2 },
    { data: mrrRows, error: e3 },
    { count: activeSites, error: e4 },
    { count: newUsers, error: e5 },
  ] = await Promise.all([
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'authorized'),
    adminClient.from('subscriptions').select('amount').eq('status', 'authorized'),
    adminClient.from('sites').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const mrr = mrrRows?.reduce((sum, s) => sum + Number(s.amount), 0) ?? 0;
  const allErrors = [e1, e2, e3, e4, e5].filter(e => e);

  const metrics = [
    { label: 'Usuarios totales', value: totalUsers ?? 0, suffix: '' },
    { label: 'Suscripciones activas', value: activeSubs ?? 0, suffix: '' },
    { label: 'MRR estimado', value: mrr, prefix: '$', isCurrency: true },
    { label: 'Sitios publicados', value: activeSites ?? 0, suffix: '' },
    { label: 'Nuevos (30 días)', value: newUsers ?? 0, suffix: '' },
  ];

  return (
    <div>
      {allErrors.length > 0 && (
        <div style={{
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '1.5rem',
          color: '#ef4444',
          fontSize: '0.875rem'
        }}>
          <strong>⚠️ Error en datos:</strong> {allErrors.map(e => e?.message).filter(Boolean).join('; ')}
        </div>
      )}
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Panel de Administración
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {metrics.map(m => (
          <div key={m.label} className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {m.prefix}{m.isCurrency ? m.value.toLocaleString('es-AR') : m.value}{m.suffix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
