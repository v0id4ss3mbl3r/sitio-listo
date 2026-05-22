import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';
import SubscriptionActions from './components/SubscriptionActions';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  authorized: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  paused: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  pending: { bg: 'rgba(100,116,139,0.15)', color: '#64748b' },
};

const PAGE_SIZE = 20;

type Row = {
  id: string;
  plan_type: string;
  status: string;
  amount: number;
  mp_preapproval_id: string | null;
  current_period_end: string | null;
  trial_end_date: string | null;
  created_at: string;
  updated_at: string;
  profiles: { email: string; full_name: string | null } | null;
};

export default async function AdminSuscripcionesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const { page: pageParam, status: statusFilter = '' } = await searchParams;
  const page = Number(pageParam ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from('subscriptions')
    .select(
      `id, plan_type, status, amount, mp_preapproval_id,
       current_period_end, trial_end_date,
       created_at, updated_at,
       profiles!inner(email, full_name)`,
      { count: 'exact' }
    )
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusFilter) query = query.eq('status', statusFilter);

  const { data: subs, count, error } = await query;
  const statuses = ['', 'authorized', 'paused', 'cancelled', 'pending'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Suscripciones ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {statuses.map((s) => (
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

      {error && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <strong>Error en la query:</strong> {error.message}
          <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.85 }}>
            code: {error.code || '—'} · hint: {error.hint || '—'}
          </div>
        </div>
      )}

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Plan', 'Monto', 'Estado', 'Período fin', 'Acciones'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(subs as Row[] | null)?.map((s) => {
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
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString('es-AR') : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <SubscriptionActions subscriptionId={s.id} status={s.status} />
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
