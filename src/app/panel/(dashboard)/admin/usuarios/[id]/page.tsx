import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';
import UserActions from './components/UserActions';

export const dynamic = 'force-dynamic';

type Site = {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  template_id: string;
  is_active: boolean;
  is_banned: boolean;
};

type Subscription = {
  id: string;
  plan_type: string;
  status: string;
  amount: number;
  current_period_end: string | null;
  trial_end_date: string | null;
  created_at: string;
};

type Notification = {
  id: string;
  title: string;
  read_at: string | null;
  created_at: string;
};

export default async function AdminUsuarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, blocked_until, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Usuario no encontrado.
        <div style={{ marginTop: '1rem' }}>
          <Link href="/admin/usuarios">← Volver a la lista</Link>
        </div>
      </div>
    );
  }

  const [{ data: sites }, { data: subs }, { data: notifs }] = await Promise.all([
    supabase.from('sites').select('id, subdomain, custom_domain, template_id, is_active, is_banned').eq('user_id', id),
    supabase.from('subscriptions').select('id, plan_type, status, amount, current_period_end, trial_end_date, created_at').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('notifications').select('id, title, read_at, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(20),
  ]);

  const sitesList = (sites as Site[] | null) ?? [];
  const subsList = (subs as Subscription[] | null) ?? [];
  const notifsList = (notifs as Notification[] | null) ?? [];

  // Server Component: usar el "now" del request es válido aquí.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const isBlocked = profile.blocked_until && new Date(profile.blocked_until).getTime() > now;
  const activeSub = subsList.find(
    (s) =>
      s.status === 'authorized' ||
      (s.status === 'cancelled' && s.current_period_end && new Date(s.current_period_end).getTime() > now) ||
      (s.trial_end_date && new Date(s.trial_end_date).getTime() > now)
  );

  return (
    <div>
      <Link href="/admin/usuarios" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
        ← Volver a usuarios
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginTop: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {profile.full_name || profile.email}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{profile.email}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {profile.role === 'admin' && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.15)', color: '#6366f1', fontWeight: 600 }}>
                ADMIN
              </span>
            )}
            {isBlocked && profile.blocked_until && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600 }}>
                BLOQUEADO hasta {new Date(profile.blocked_until).toLocaleDateString('es-AR')}
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Registrado: {new Date(profile.created_at).toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>
        <UserActions userId={profile.id} email={profile.email} isBlocked={!!isBlocked} isAdmin={profile.role === 'admin'} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        <Stat label="Plan vigente" value={activeSub?.plan_type ?? 'free'} />
        <Stat label="Sitios totales" value={sitesList.length} />
        <Stat label="Sitios activos" value={sitesList.filter((s) => s.is_active).length} />
        <Stat label="Sitios baneados" value={sitesList.filter((s) => s.is_banned).length} />
        <Stat label="Suscripciones" value={subsList.length} />
        <Stat label="Notificaciones" value={notifsList.length} />
      </div>

      {/* Sitios */}
      <Section title={`Sitios (${sitesList.length})`}>
        {sitesList.length === 0 ? (
          <Empty>Sin sitios.</Empty>
        ) : (
          sitesList.map((s) => (
            <div key={s.id} style={rowStyle}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{s.subdomain}.sitiolisto.com.ar</strong>
                {s.custom_domain && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.custom_domain}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span style={badge(s.is_active ? 'green' : 'gray')}>{s.is_active ? 'ACTIVO' : 'INACTIVO'}</span>
                {s.is_banned && <span style={badge('red')}>BANEADO</span>}
                <span style={badge('gray')}>{s.template_id}</span>
              </div>
            </div>
          ))
        )}
      </Section>

      {/* Suscripciones */}
      <Section title={`Suscripciones (${subsList.length})`}>
        {subsList.length === 0 ? (
          <Empty>Sin suscripciones.</Empty>
        ) : (
          subsList.map((s) => (
            <div key={s.id} style={rowStyle}>
              <div>
                <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{s.plan_type}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ${Number(s.amount).toLocaleString('es-AR')} ·{' '}
                  {new Date(s.created_at).toLocaleDateString('es-AR')}
                </div>
              </div>
              <span style={badge(s.status === 'authorized' ? 'green' : s.status === 'cancelled' ? 'red' : 'gray')}>
                {s.status}
              </span>
            </div>
          ))
        )}
      </Section>

      {/* Notificaciones */}
      <Section title={`Notificaciones enviadas (${notifsList.length})`}>
        {notifsList.length === 0 ? (
          <Empty>Sin notificaciones todavía.</Empty>
        ) : (
          notifsList.map((n) => (
            <div key={n.id} style={rowStyle}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(n.created_at).toLocaleString('es-AR')}
                </div>
              </div>
              <span style={badge(n.read_at ? 'green' : 'gray')}>{n.read_at ? 'LEÍDA' : 'NO LEÍDA'}</span>
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
      {children}
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.85rem 1.1rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  borderRadius: '10px',
  flexWrap: 'wrap',
};

function badge(color: 'green' | 'red' | 'gray'): React.CSSProperties {
  const map = {
    green: { background: 'rgba(16,185,129,0.15)', color: '#10b981' },
    red: { background: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    gray: { background: 'rgba(100,116,139,0.15)', color: 'var(--text-secondary)' },
  };
  return {
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 600,
    ...map[color],
  };
}
