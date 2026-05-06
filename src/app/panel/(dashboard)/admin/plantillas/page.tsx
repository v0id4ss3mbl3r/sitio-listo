import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import TemplateToggle from './components/TemplateToggle';

export default async function AdminPlantillasPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const adminClient = createAdminClient();

  const [{ data: templates }, { data: sitesData }] = await Promise.all([
    adminClient.from('templates').select('*').order('sort_order', { ascending: true }),
    adminClient.from('sites').select('template_id'),
  ]);

  // Contar uso por template
  const usageMap: Record<string, number> = {};
  sitesData?.forEach((s: any) => {
    if (s.template_id) usageMap[s.template_id] = (usageMap[s.template_id] ?? 0) + 1;
  });

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Plantillas ({templates?.length ?? 0})
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {templates?.map((t: any) => (
          <div key={t.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  background: 'rgba(99,102,241,0.15)',
                  color: '#6366f1',
                }}>
                  {t.plan_required}
                </span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  background: 'rgba(100,116,139,0.15)',
                  color: 'var(--text-secondary)',
                }}>
                  {t.category}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {usageMap[t.id] ?? 0} sitios activos · sort_order: {t.sort_order}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                background: t.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: t.is_active ? '#10b981' : '#ef4444',
              }}>
                {t.is_active ? 'Activa' : 'Inactiva'}
              </span>
              <TemplateToggle templateId={t.id} isActive={t.is_active} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
