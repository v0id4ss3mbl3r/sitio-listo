import Link from 'next/link';

const footerLinks = {
  Producto: [
    { label: 'Plantillas', href: '#plantillas' },
    { label: 'Precios', href: '#precios' },
    { label: 'Características', href: '#features' },
  ],
  Empresa: [
    { label: 'Acerca de', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contacto', href: '#' },
  ],
  Legal: [
    { label: 'Términos', href: '#' },
    { label: 'Privacidad', href: '#' },
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
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
