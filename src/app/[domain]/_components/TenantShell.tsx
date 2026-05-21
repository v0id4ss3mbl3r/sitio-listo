import type { ReactNode } from 'react';

import Link from 'next/link';

type NavItem = { slug: string; title: string };

type ShellProps = {
  siteName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  planType: string;
  navigation: NavItem[];
  children: ReactNode;
};

// Layout genérico para páginas no-home. Respeta branding (logo, colores)
// del sitio y muestra la lista de páginas publicadas como navegación.
export function TenantShell({
  siteName,
  logoUrl,
  primaryColor,
  secondaryColor,
  planType,
  navigation,
  children,
}: ShellProps) {
  const showBranding = planType !== 'pro' && planType !== 'extremo' && planType !== 'personalizado';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          padding: '1.25rem 2rem',
          borderBottom: `1px solid ${primaryColor}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {logoUrl ? (
            // Logo subido por el usuario — sin dimensiones conocidas, no aplica next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={siteName}
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              {siteName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{siteName}</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {navigation.map((item) => (
            <Link
              key={item.slug || 'home'}
              href={item.slug ? `/${item.slug}` : '/'}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              {item.title || (item.slug ? item.slug : 'Inicio')}
            </Link>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>

      <footer
        style={{
          padding: '2rem',
          borderTop: `1px solid ${primaryColor}22`,
          textAlign: 'center',
          fontSize: '0.85rem',
          opacity: 0.6,
        }}
      >
        © {new Date().getFullYear()} {siteName}
        {showBranding && (
          <>
            {' — '}
            <a
              href="https://sitiolisto.com.ar"
              style={{ color: primaryColor, textDecoration: 'none' }}
            >
              Creado con SitioListo
            </a>
          </>
        )}
      </footer>
    </div>
  );
}
