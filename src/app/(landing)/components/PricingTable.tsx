import { PLANS } from '@/lib/constants';

export default function PricingTable() {
  const plans = Object.values(PLANS);

  return (
    <section id="precios" style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Precios
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.75rem', lineHeight: 1.2 }}>
          Planes que se adaptan a <span className="gradient-text">tu negocio</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Sin costos ocultos. Cancelá cuando quieras.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {plans.map((plan) => (
          <div
            key={plan.slug}
            className="glass-card"
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              ...(plan.highlighted
                ? {
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    boxShadow: 'var(--shadow-elevated)',
                  }
                : {}),
            }}
          >
            {/* Popular badge */}
            {plan.highlighted && (
              <div style={{
                position: 'absolute', top: '1rem', right: '-2rem',
                background: 'var(--gradient-primary)', color: 'white',
                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 3rem',
                transform: 'rotate(45deg)',
              }}>
                Popular
              </div>
            )}

            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {plan.name}
            </span>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {plan.priceDisplay}
              </span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>/mes</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {plan.description}
            </p>

            <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', margin: '1.5rem 0' }} />

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {plan.features.map((feature) => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/registro`}
              className={plan.highlighted ? 'btn-primary' : 'btn-outline'}
              style={{ marginTop: '2rem', textAlign: 'center', width: '100%' }}
              id={`cta-plan-${plan.slug}`}
            >
              Elegir {plan.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
