import { TEMPLATE_CATEGORIES } from '@/lib/constants';

const templatePreviews = [
  { name: 'Sabor Urbano', category: 'restaurant', icon: '🍽️', color: '#FF6B35', plan: 'Básico' },
  { name: 'Portfolio Minimal', category: 'portfolio', icon: '🎨', color: '#8B5CF6', plan: 'Básico' },
  { name: 'Tienda Express', category: 'ecommerce', icon: '🛍️', color: '#06B6D4', plan: 'Pro' },
  { name: 'Lanzamiento Pro', category: 'landing', icon: '🚀', color: '#10B981', plan: 'Básico' },
  { name: 'Servicios Plus', category: 'services', icon: '🔧', color: '#F59E0B', plan: 'Pro' },
];

export default function TemplateGallery() {
  return (
    <section id="plantillas" style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
              padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 500,
              background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)',
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            {cat.icon} {cat.name}
          </span>
        ))}
      </div>

      {/* Template Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {templatePreviews.map((tpl) => (
          <div key={tpl.name} className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Fake preview area */}
            <div style={{
              height: '180px', background: `linear-gradient(135deg, ${tpl.color}10, ${tpl.color}25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <span style={{ fontSize: '3rem' }}>{tpl.icon}</span>
              <div style={{
                position: 'absolute', top: '0.75rem', right: '0.75rem',
                padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600,
                background: tpl.plan === 'Básico' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: tpl.plan === 'Básico' ? '#10b981' : '#818cf8',
                border: `1px solid ${tpl.plan === 'Básico' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              }}>
                {tpl.plan}
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tpl.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                {TEMPLATE_CATEGORIES.find((c) => c.slug === tpl.category)?.name || tpl.category}
              </p>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/registro`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem',
                  fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textDecoration: 'none',
                  transition: 'gap 0.2s ease',
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
