import { redirect } from 'next/navigation';

import { getAdminUser } from '@/lib/auth/getAdminUser';
import { fetchAppThemeCached } from '@/lib/appSettings';
import { THEME_LIST } from '@/lib/themes';
import ThemeSelector from './components/ThemeSelector';

export const dynamic = 'force-dynamic';

export default async function AparienciaPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const current = await fetchAppThemeCached();

  // Pasamos solo lo serializable que el selector necesita.
  const themes = THEME_LIST.map((t) => ({
    id: t.id,
    label: t.label,
    description: t.description,
    mode: t.mode,
    primary: t.tokens.primary,
    secondary: t.tokens.secondary,
    bg: t.tokens.bgBase,
    text: t.tokens.textPrimary,
  }));

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Apariencia
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 640 }}>
        Tema global de SitioListo. Aplica a la web pública (landing) y a este panel.
        El cambio se ve al instante. No afecta a los sitios de los clientes (eso se
        configura por sitio más adelante).
      </p>
      <ThemeSelector current={current} themes={themes} />
    </div>
  );
}
