import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';

// Cualquier página del panel admin que lee de la DB tiene que ser dinámica:
// depende de la sesión y las RLS policies.
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type SubscriptionRow = { status: string; plan_type: string };
type SiteRow = { id: string };
type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: string;
  blocked_until: string | null;
  subscriptions: SubscriptionRow | SubscriptionRow[] | null;
  sites: SiteRow[] | null;
};

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Number(pageParam ?? 1);
  const search = searchParam ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from('profiles')
    .select(
      `id, email, full_name, created_at, role, blocked_until,
       subscriptions!left(status, plan_type),
       sites!left(id)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) query = query.ilike('email', `%${search}%`);

  const { data: users, count, error } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  // Server Component: el "now" del request es el correcto. La regla de
  // purity está pensada para Client Components / hooks.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Usuarios ({count ?? 0})
        </h2>
        <form>
          <input
            name="search"
            defaultValue={search}
            placeholder="Buscar por email..."
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          />
        </form>
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Email', 'Plan', 'Sitios', 'Estado', 'Registro', ''].map((col) => (
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
            {(users as UserRow[] | null)?.map((u) => {
              const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
              const siteCount = u.sites?.length ?? 0;
              const isBlocked = u.blocked_until && new Date(u.blocked_until).getTime() > now;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {u.full_name || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: sub?.status === 'authorized' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                        color: sub?.status === 'authorized' ? '#10b981' : 'var(--text-secondary)',
                      }}
                    >
                      {sub?.plan_type ?? 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {siteCount}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {u.role === 'admin' && (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.15)', color: '#6366f1', fontWeight: 600 }}>
                          ADMIN
                        </span>
                      )}
                      {isBlocked && (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600 }}>
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(u.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <Link
                      href={`/admin/usuarios/${u.id}`}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        border: '1px solid var(--border)',
                      }}
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}${search ? `&search=${search}` : ''}`}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                background: p === page ? 'var(--color-primary)' : 'var(--bg-card)',
                color: p === page ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
