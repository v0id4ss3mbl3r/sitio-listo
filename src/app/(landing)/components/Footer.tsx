import Link from 'next/link';

import { LEGAL_LINKS } from '@/lib/legal';

// Solo links que van a algún lado. Antes había "Acerca de", "Blog" y
// "Contacto" apuntando a '#': un footer lleno de links muertos es de las
// cosas que más rápido delatan que un sitio no está terminado.
const footerLinks = {
  Producto: [
    { label: 'Plantillas', href: '#plantillas' },
    { label: 'Precios', href: '#precios' },
    { label: 'Características', href: '#features' },
  ],
  Legal: LEGAL_LINKS,
  Contacto: [
    { label: 'contacto@sitiolisto.com.ar', href: 'mailto:contacto@sitiolisto.com.ar' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '4rem 1.5rem 2rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <span style={{
                width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white',
              }}>
                S
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Sitio<span style={{ color: 'var(--color-primary-light)' }}>Listo</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Sitios web profesionales para tu negocio. Rápido, fácil y accesible.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nav-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Botón de Arrepentimiento — obligatorio y visible en la home por
            Resolución 424/2020 de la Secretaría de Comercio Interior. Va
            destacado a propósito: la norma pide que se distinga, no que sea
            un link más en una lista. */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/legal/arrepentimiento"
            className="hero-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '48px',
              padding: '0 var(--space-6)',
              boxSizing: 'border-box',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h11a5 5 0 0 1 0 10h-1" />
            </svg>
            Botón de arrepentimiento
          </Link>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} SitioListo. Todos los derechos reservados.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Powered with 🧠 by <a href="http://ass3mbl3r.com.ar" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>ass3mbl3r</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
