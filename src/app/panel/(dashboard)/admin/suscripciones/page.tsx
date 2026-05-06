import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  authorized: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  paused: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  pending: { bg: 'rgba(100,116,139,0.15)', color: '#64748b' },
};

const PAGE_SIZE = 20;

export default async function AdminSuscripcionesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const statusFilter = searchParams.status ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('subscriptions')
    .select(`
      id, plan_type, status, amount, mp_preapproval_id,
      created_at, updated_at,
      profiles!inner(email, full_name)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: subs, count } = await query;

  const statuses = ['', 'authorized', 'paused', 'cancelled', 'pending'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Suscripciones ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {statuses.map(s => (
            <a
              key={s || 'all'}
              href={`?status=${s}`}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: statusFilter === s ? 'var(--color-primary)' : 'var(--bg-card)',
                color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {s || 'Todas'}
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Plan', 'Monto', 'Estado', 'ID MercadoPago', 'Actualizado'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs?.map((s: any) => {
              const statusStyle = STATUS_COLORS[s.status] ?? STATUS_COLORS.pending;
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>{s.profiles?.full_name || '—'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.profiles?.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                    {s.plan_type}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    ${Number(s.amount).toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {s.mp_preapproval_id ? s.mp_preapproval_id.substring(0, 16) + '...' : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(s.updated_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
