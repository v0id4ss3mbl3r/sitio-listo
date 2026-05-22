import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';
import SiteActions from './components/SiteActions';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type Row = {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  template_id: string;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  profiles: { email: string; full_name: string | null } | null;
};

export default async function AdminSitiosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; active?: string; banned?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const { page: pageParam, active: activeFilter, banned: bannedFilter } = await searchParams;
  const page = Number(pageParam ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from('sites')
    .select(
      `id, subdomain, custom_domain, template_id, is_active, is_banned,
       created_at, updated_at,
       profiles!inner(email, full_name)`,
      { count: 'exact' }
    )
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (activeFilter === 'true') query = query.eq('is_active', true);
  if (activeFilter === 'false') query = query.eq('is_active', false);
  if (bannedFilter === 'true') query = query.eq('is_banned', true);

  const { data: sites, count, error } = await query;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Sitios ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[['', 'Todos'], ['true', 'Activos'], ['false', 'Inactivos']].map(([val, label]) => (
            <a
              key={val}
              href={`?active=${val}`}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: (activeFilter ?? '') === val ? 'var(--color-primary)' : 'var(--bg-card)',
                color: (activeFilter ?? '') === val ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="?banned=true"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              background: bannedFilter === 'true' ? '#ef4444' : 'var(--bg-card)',
              color: bannedFilter === 'true' ? '#fff' : 'var(--text-secondary)',
              textDecoration: 'none',
              border: '1px solid var(--border)',
            }}
          >
            Baneados
          </a>
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
              {['Sitio', 'Propietario', 'Dominio custom', 'Plantilla', 'Estado', 'Acciones'].map((col) => (
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
            {(sites as Row[] | null)?.map((site) => (
              <tr key={site.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
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
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {site.template_id}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        background: site.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                        color: site.is_active ? '#10b981' : 'var(--text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      {site.is_active ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                    {site.is_banned && (
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          background: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          fontWeight: 600,
                        }}
                      >
                        BANEADO
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <SiteActions
                    siteId={site.id}
                    subdomain={site.subdomain}
                    customDomain={site.custom_domain}
                    isActive={site.is_active}
                    isBanned={site.is_banned}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
