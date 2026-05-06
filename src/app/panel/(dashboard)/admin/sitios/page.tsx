import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import SiteToggle from './components/SiteToggle';

const PAGE_SIZE = 20;

export default async function AdminSitiosPage({
  searchParams,
}: {
  searchParams: { page?: string; active?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const activeFilter = searchParams.active;
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('sites')
    .select(`
      id, subdomain, custom_domain, template_id, is_active,
      created_at, updated_at,
      profiles!inner(email, full_name)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (activeFilter === 'true') query = query.eq('is_active', true);
  if (activeFilter === 'false') query = query.eq('is_active', false);

  const { data: sites, count } = await query;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Sitios ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['', 'Todos'], ['true', 'Activos'], ['false', 'Inactivos']].map(([val, label]) => (
            <a
              key={val}
              href={`?active=${val}`}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: activeFilter === val || (!activeFilter && val === '') ? 'var(--color-primary)' : 'var(--bg-card)',
                color: activeFilter === val || (!activeFilter && val === '') ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Sitio', 'Propietario', 'Dominio personalizado', 'Estado', 'Acción'].map(col => (
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
            {sites?.map((site: any) => (
              <tr key={site.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {site.subdomain}.sitiolisto.com.ar
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-primary)' }}>{site.profiles?.full_name || '—'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{site.profiles?.email}</div>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {site.custom_domain || '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: site.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: site.is_active ? '#10b981' : '#ef4444',
                  }}>
                    {site.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <SiteToggle siteId={site.id} isActive={site.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
