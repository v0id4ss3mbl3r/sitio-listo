'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#plantillas', label: 'Plantillas' },
  { href: '#precios', label: 'Precios' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 1.5rem',
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'var(--bg-card)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled
          ? '1px solid var(--border-subtle)'
          : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'white',
            }}
          >
            S
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Sitio
            <span style={{ color: 'var(--color-primary-light)' }}>Listo</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--text-primary)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          className="hidden-mobile"
        >
          <ThemeToggle />
          <a
            href="/login"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--text-primary)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-secondary)')
            }
          >
            Iniciar sesión
          </a>
          <a
            href="#precios"
            className="btn-primary"
            style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}
          >
            Empezar gratis
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="show-mobile"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          aria-label="Abrir menú"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isMobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          style={{
            padding: '1rem 0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
          className="show-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '0.75rem 0',
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '0.5rem',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <ThemeToggle />
            </div>
            <a
              href="/login"
              className="btn-outline"
              style={{ fontSize: '0.875rem' }}
            >
              Iniciar sesión
            </a>
            <a
              href="#precios"
              className="btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              Empezar gratis
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          #mobile-menu-button.show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
