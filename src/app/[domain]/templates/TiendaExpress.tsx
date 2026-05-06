'use client';

import React from 'react';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  phone?: string;
  logoUrl?: string;
}

const DEFAULT_PRODUCTS = [
  { id: '01', name: 'Producto Premium', price: '$99.99', category: 'Destacado' },
  { id: '02', name: 'Producto Estándar', price: '$49.99', category: 'Popular' },
  { id: '03', name: 'Producto Básico', price: '$29.99', category: 'Económico' },
  { id: '04', name: 'Combo Ofertas', price: '$79.99', category: 'Especial' },
  { id: '05', name: 'Edición Limitada', price: '$139.99', category: 'Exclusivo' },
  { id: '06', name: 'Kit Completo', price: '$199.99', category: 'Bundle' },
];

export default function TiendaExpress({
  siteName = 'Mi Tienda',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
  planType,
  heroTitle,
  heroSubtitle,
  phone = '',
  logoUrl = '',
}: TemplateProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111827', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,900;1,700&display=swap');

        .te-nav-link {
          font-size: 0.9rem; font-weight: 600; color: #6b7280; text-decoration: none;
          transition: color 0.2s;
        }
        .te-nav-link:hover { color: ${primaryColor}; }

        @keyframes te-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .te-fade { animation: te-fade-in 0.6s ease-out; }

        .te-product-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        .te-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.2);
        }

        .te-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: ${secondaryColor};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 10;
        }

        .te-btn-primary {
          padding: 10px 24px;
          border-radius: 8px;
          background: ${primaryColor};
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .te-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
      `}} />

      {/* NAVBAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'white',
        borderBottom: '1px solid #f3f4f6',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} style={{ height: '40px', width: 'auto', borderRadius: '6px' }} />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: primaryColor, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16
            }}>
              {siteName.charAt(0).toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#productos" className="te-nav-link">Productos</a>
          <a href="#contacto" className="te-nav-link">Contacto</a>
          <button className="te-btn-primary">
            Comprar
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        paddingTop: 'calc(64px + 3rem)',
        paddingBottom: '4rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        maxWidth: 1100,
        margin: '0 auto',
        textAlign: 'center',
        background: `linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)`
      }}>
        <h1 className="te-fade" style={{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.04em', lineHeight: 1.1,
          color: '#111',
          marginBottom: '1rem'
        }}>
          {heroTitle || `Bienvenido a ${siteName}`}
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6b7280', lineHeight: 1.6, fontWeight: 500,
          maxWidth: 600, margin: '0 auto',
          marginBottom: '2rem'
        }}>
          {heroSubtitle || 'Descubrí nuestros mejores productos con envío rápido y seguro.'}
        </p>
        <button className="te-btn-primary">
          Explorar Catálogo
        </button>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" style={{
        padding: '5rem 2rem',
        maxWidth: 1100,
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: '#111',
            marginBottom: '0.5rem'
          }}>
            Nuestros Productos
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Selección de artículos de calidad premium
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {DEFAULT_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="te-product-card"
              style={{
                padding: '1.5rem',
                background: '#f9fafb',
                border: '1px solid #e5e7eb'
              }}
            >
              <div className="te-badge">
                {product.category}
              </div>

              {/* Placeholder de imagen */}
              <div style={{
                aspectRatio: '1/1',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 700,
                color: `${primaryColor}40`,
                border: '1px solid #e5e7eb'
              }}>
                {product.id}
              </div>

              <h3 style={{
                fontSize: '1.1rem', fontWeight: 700,
                marginBottom: '0.75rem', color: '#111'
              }}>
                {product.name}
              </h3>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  fontSize: '1.5rem', fontWeight: 800,
                  color: primaryColor
                }}>
                  {product.price}
                </span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600,
                  color: '#9ca3af', textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Stock disponible
                </span>
              </div>

              <button className="te-btn-primary" style={{ width: '100%' }}>
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{
        padding: '4rem 2rem',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: '#111',
            marginBottom: '1.5rem'
          }}>
            ¿Necesitas ayuda?
          </h2>

          {phone && (
            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Contactanos por WhatsApp
              </p>
              <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{
                fontSize: '1.2rem', fontWeight: 700,
                color: primaryColor, textDecoration: 'none'
              }}>
                {phone}
              </a>
            </div>
          )}

          <button className="te-btn-primary">
            Ir a Checkout
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2.5rem',
        background: 'white',
        borderTop: '1px solid #f3f4f6',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.85rem'
      }}>
        <p>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
