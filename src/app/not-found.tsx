import Link from 'next/link';

// Hasta ahora una URL inexistente mostraba el 404 por defecto de Next, sin
// marca y en inglés. Esta página también la usa notFound() de /legal/[slug].
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: '640px',
        margin: '0 auto',
        padding: 'var(--space-16) var(--space-6)',
        gap: 'var(--space-4)',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--color-secondary)',
          color: '#0A0A0A',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Error 404
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Esta página no existe
      </h1>

      <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
        <Link
          href="/"
          className="hero-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '52px',
            padding: '0 var(--space-6)',
            boxSizing: 'border-box',
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'var(--border-width, 1px) solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            fontSize: '16px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Ir al inicio
        </Link>
        <Link
          href="/#plantillas"
          className="hero-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '52px',
            padding: '0 var(--space-6)',
            boxSizing: 'border-box',
            border: 'var(--border-width, 1px) solid var(--border-subtle)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Ver plantillas
        </Link>
      </div>
    </main>
  );
}
