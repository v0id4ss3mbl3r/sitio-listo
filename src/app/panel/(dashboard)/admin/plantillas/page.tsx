import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { createClient } from '@/lib/supabase/server';
import TemplateEditor from './components/TemplateEditor';

export const dynamic = 'force-dynamic';

type Template = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  plan_required: string;
  min_plan: string | null;
  is_active: boolean;
  sort_order: number;
  tags: string[];
};

type SiteRow = { template_id: string };

export default async function AdminPlantillasPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const supabase = await createClient();

  const [{ data: templates }, { data: sitesData }] = await Promise.all([
    supabase.from('templates').select('*').order('sort_order', { ascending: true }),
    supabase.from('sites').select('template_id'),
  ]);

  const usageMap: Record<string, number> = {};
  (sitesData as SiteRow[] | null)?.forEach((s) => {
    if (s.template_id) usageMap[s.template_id] = (usageMap[s.template_id] ?? 0) + 1;
  });

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Plantillas ({templates?.length ?? 0})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(templates as Template[] | null)?.map((t) => (
          <TemplateEditor key={t.id} template={t} usageCount={usageMap[t.id] ?? 0} />
        ))}
      </div>
    </div>
  );
}
