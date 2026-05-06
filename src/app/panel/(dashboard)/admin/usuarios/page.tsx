import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

const PAGE_SIZE = 20;

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const search = searchParams.search ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('profiles')
    .select(`
      id, email, full_name, created_at, role,
      subscriptions!left(status, plan_type, amount),
      sites!left(id, is_active)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) {
    query = query.ilike('email', `%${search}%`);
  }

  const { data: users, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
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

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Email', 'Plan', 'Sitios', 'Rol', 'Registro'].map(col => (
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
            {users?.map((u: any) => {
              const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
              const siteCount = Array.isArray(u.sites) ? u.sites.length : 0;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {u.full_name || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: sub?.status === 'authorized' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                      color: sub?.status === 'authorized' ? '#10b981' : 'var(--text-secondary)',
                    }}>
                      {sub?.plan_type ?? 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {siteCount}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    {u.role === 'admin' && (
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: 'rgba(99,102,241,0.15)',
                        color: '#6366f1',
                      }}>
                        admin
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(u.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a
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
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
