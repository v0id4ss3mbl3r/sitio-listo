export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '6rem 1.5rem 4rem',
      }}
      className="bg-grid"
    >
      {/* Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        className="animate-pulse-glow"
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        className="animate-pulse-glow"
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: 'var(--color-primary-light)',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          Lanzamiento 2026 — ¡Ya disponible!
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up-delay-1"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          Tu sitio web,{' '}
          <span className="gradient-text">listo en minutos</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up-delay-2"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            lineHeight: 1.7,
          }}
        >
          Elegí tu plantilla, personalizala y publicala al instante.
          Sin código, sin complicaciones. Tu negocio online en un clic.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in-up-delay-3"
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a href="#precios" className="btn-primary" id="cta-empezar">
            Empezar ahora
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#plantillas" className="btn-outline" id="cta-ver-plantillas">
            Ver plantillas
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in-up-delay-3"
          style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { value: '5+', label: 'Plantillas' },
            { value: '99.9%', label: 'Uptime' },
            { value: '<3min', label: 'Tiempo de setup' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Template Cards Preview */}
        <div
          className="animate-fade-in-up-delay-3"
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            perspective: '1000px',
          }}
        >
          {[
            {
              name: 'Restaurante',
              color: '#FF6B35',
              icon: '🍽️',
              delay: '0s',
            },
            {
              name: 'Portfolio',
              color: '#8B5CF6',
              icon: '🎨',
              delay: '2s',
            },
            {
              name: 'Tienda',
              color: '#06B6D4',
              icon: '🛍️',
              delay: '4s',
            },
          ].map((card) => (
            <div
              key={card.name}
              className="glass-card animate-float"
              style={{
                width: '200px',
                height: '260px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                animationDelay: card.delay,
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
                  border: `1px solid ${card.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {card.name}
              </span>
              {/* Fake template preview lines */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: `${card.color}30`,
                    width: '100%',
                  }}
                />
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: `${card.color}20`,
                    width: '75%',
                  }}
                />
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: `${card.color}15`,
                    width: '50%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
