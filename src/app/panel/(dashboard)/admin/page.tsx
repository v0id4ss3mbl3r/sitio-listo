import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  // Usa el cliente normal — las policies "Admins can view all <tabla>"
  // de migration 0007 le dan acceso completo vía RLS.
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: activeSubs },
    { data: mrrRows },
    { count: activeSites },
    { count: newUsers },
    { count: blockedUsers },
    { count: bannedSites },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'authorized'),
    supabase.from('subscriptions').select('amount').eq('status', 'authorized'),
    supabase.from('sites').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      // eslint-disable-next-line react-hooks/purity
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('blocked_until', new Date().toISOString()),
    supabase.from('sites').select('*', { count: 'exact', head: true }).eq('is_banned', true),
  ]);

  const mrr = mrrRows?.reduce((sum, s) => sum + Number(s.amount), 0) ?? 0;

  const metrics = [
    { label: 'Usuarios totales', value: totalUsers ?? 0 },
    { label: 'Suscripciones activas', value: activeSubs ?? 0 },
    { label: 'MRR estimado', value: `$${mrr.toLocaleString('es-AR')}` },
    { label: 'Sitios publicados', value: activeSites ?? 0 },
    { label: 'Nuevos (30 días)', value: newUsers ?? 0 },
    { label: 'Usuarios bloqueados', value: blockedUsers ?? 0 },
    { label: 'Sitios baneados', value: bannedSites ?? 0 },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Panel de Administración
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {metrics.map((m) => (
          <div key={m.label} className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
