import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/constants';

// Color de acento por categoría (solo presentación de la vitrina).
const CATEGORY_COLOR: Record<string, string> = {
  restaurant: '#FF6B35',
  portfolio: '#8B5CF6',
  ecommerce: '#06B6D4',
  landing: '#10B981',
  services: '#F59E0B',
  fotografia: '#E11D48',
  belleza: '#EC4899',
  fitness: '#6366F1',
  comercio: '#0EA5E9',
};

const PLAN_LABEL: Record<string, string> = { basic: 'Básico', pro: 'Pro', extremo: 'Extremo' };

// La vitrina se deriva de TEMPLATES → se mantiene sola al sumar plantillas.
const previews = TEMPLATES.map((tpl) => {
  return {
    name: tpl.name,
    category: tpl.type as string,
    color: CATEGORY_COLOR[tpl.type] ?? 'var(--color-primary)',
    plan: PLAN_LABEL[tpl.plan] ?? tpl.plan,
  };
});

export default function TemplateGallery() {
  return (
    <section id="plantillas" style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>
          Plantillas
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.75rem', lineHeight: 1.2 }}>
          Diseños que <span className="gradient-text">enamoran</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Cada plantilla está diseñada para convertir visitantes en clientes.
        </p>
      </div>

      {/* Category Badges */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <span
            key={cat.slug}
            style={{
              padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', fontWeight: 600,
              background: 'var(--bg-card)', border: 'var(--border-width, 1px) solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Template Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {previews.map((tpl) => (
          <div key={tpl.name} className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{
              height: '180px', background: `${tpl.color}1A`,
              borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)',
              display: 'flex', alignItems: 'flex-end', padding: 'var(--space-4)', position: 'relative',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800,
                lineHeight: 1.05, letterSpacing: '-0.03em', color: tpl.color,
              }}>
                {tpl.name}
              </span>
              <div style={{
                position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
                padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                background: 'var(--bg-card)', color: 'var(--text-secondary)',
                border: 'var(--border-width, 1px) solid var(--border-subtle)',
              }}>
                {tpl.plan}
              </div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tpl.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {TEMPLATE_CATEGORIES.find((c) => c.slug === tpl.category)?.name || tpl.category}
              </p>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/registro`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem',
                  fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textDecoration: 'none',
                }}
              >
                Usar plantilla
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
