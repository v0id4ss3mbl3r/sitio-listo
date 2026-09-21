import { TEMPLATES } from '@/lib/constants';

// Las stats salen del código, no de un array a mano: decían "5+ plantillas"
// cuando ya había 30.
const STATS = [
  { value: `${TEMPLATES.length}`, label: 'plantillas listas' },
  { value: '99,9%', label: 'de uptime' },
  { value: '3 min', label: 'y estás online' },
];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        background: 'var(--hero-surface)',
        color: 'var(--hero-text)',
        padding: 'var(--space-24) var(--space-16) var(--space-16)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 'var(--space-6)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--hero-accent)',
            color: 'var(--hero-accent-text)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Lanzamiento 2026
        </span>

        <h1
          style={{
            margin: 0,
            maxWidth: '16ch',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.75rem, 7vw, 5.75rem)',
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
          }}
        >
          Tu sitio web, listo en minutos
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: '38ch',
            fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
            lineHeight: 1.6,
            color: 'var(--hero-text-muted)',
          }}
        >
          Elegí tu plantilla, personalizala y publicala al instante. Sin código,
          sin complicaciones.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-2)',
          }}
        >
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL}/registro`}
            id="cta-empezar"
            className="hero-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '56px',
              padding: '0 var(--space-8)',
              boxSizing: 'border-box',
              background: 'var(--hero-accent)',
              color: 'var(--hero-accent-text)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              fontSize: '17px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Empezar ahora
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="#plantillas"
            id="cta-ver-plantillas"
            className="hero-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '56px',
              padding: '0 var(--space-6)',
              boxSizing: 'border-box',
              border: 'var(--border-width, 1px) solid var(--hero-text)',
              color: 'var(--hero-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Ver plantillas
          </a>
        </div>

        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-8)',
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: 'var(--space-4) var(--space-6)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: 'var(--border-width, 1px) solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.75rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  marginTop: 'var(--space-1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
