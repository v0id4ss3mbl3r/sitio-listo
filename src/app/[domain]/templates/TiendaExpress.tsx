'use client';

import React from 'react';

import { getTheme, type Theme } from '@/lib/themes';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  phone?: string;
  logoUrl?: string;
  /** Tema visual. Define el ambiente; los colores de marca son el acento. */
  theme?: Theme;
}

const DEFAULT_PRODUCTS = [
  { id: '01', name: 'Producto Premium', price: '$99.99', category: 'Destacado', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: '02', name: 'Producto Estándar', price: '$49.99', category: 'Popular', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: '03', name: 'Producto Básico', price: '$29.99', category: 'Económico', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: '04', name: 'Combo Ofertas', price: '$79.99', category: 'Especial', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: '05', name: 'Edición Limitada', price: '$139.99', category: 'Exclusivo', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: '06', name: 'Kit Completo', price: '$199.99', category: 'Bundle', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
];

const BENEFITS = [
  { icon: '🚚', title: 'Envío Gratis', desc: 'En compras mayores a $50' },
  { icon: '🔄', title: 'Cambios sin cargo', desc: 'Hasta 30 días post compra' },
  { icon: '🔒', title: 'Pago 100% Seguro', desc: 'Datos encriptados SSL' },
  { icon: '🎁', title: 'Packaging Premium', desc: 'Cada pedido con cuidado' },
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
  theme = getTheme('vivo'),
}: TemplateProps) {
  const t = theme.tokens;
  const isGlow = t.surface === 'glow';
  const showBlobs = t.gradientGlow !== 'transparent';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const accentGradient = t.useGradients ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;

  const pageBg = isGlow ? `linear-gradient(135deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isGlow ? 'rgba(255,255,255,0.05)' : t.bgCard;
  const subCardBg = isGlow ? 'rgba(255,255,255,0.04)' : t.bgSubtle;
  const darkBg = isGlow ? t.bgSubtle : '#0f172a';
  const heroBg = `linear-gradient(135deg, ${t.bgSubtle} 0%, ${accent}0d 55%, ${accent2}0a 100%)`;
  const btnShadowHover = isGlow ? `0 10px 24px ${accent}66` : t.shadowElevated;

  const labelPill: React.CSSProperties = {
    display: 'inline-block', padding: '5px 14px', borderRadius: 999,
    background: `${accent}1f`, fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase', color: accent,
    marginBottom: '1rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .te-nav-link {
          font-size: 0.875rem; font-weight: 600; color: ${t.textMuted}; text-decoration: none;
          transition: color 0.2s;
        }
        .te-nav-link:hover { color: ${accent}; }

        @keyframes te-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .te-fade { animation: te-fade-in 0.6s ease-out both; }
        .te-fade-d1 { animation-delay: 0.1s; }
        .te-fade-d2 { animation-delay: 0.2s; }

        .te-product-card {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: ${t.radiusLg};
          position: relative;
          overflow: hidden;
          background: ${subCardBg};
          border: 1px solid ${t.borderSubtle};
          box-shadow: ${isGlow ? 'none' : t.shadowCard};
        }
        .te-product-card:hover {
          transform: translateY(-8px);
          box-shadow: ${btnShadowHover};
          border-color: ${t.borderHover};
        }
        .te-product-card:hover .te-product-img-overlay {
          opacity: 1;
        }

        .te-product-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .te-badge {
          display: inline-block;
          background: ${accent2};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .te-btn-primary {
          padding: 12px 28px;
          border-radius: ${t.radiusSm};
          background: ${accentGradient};
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .te-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: ${btnShadowHover};
        }

        .te-benefit-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: ${t.radiusMd};
        }
        .te-benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -8px rgba(0,0,0,0.1);
        }
      `}} />

      {/* NAVBAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: `${t.bgBase}F2`,
        borderBottom: `1px solid ${t.borderSubtle}`,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} style={{ height: '36px', width: 'auto', borderRadius: '6px' }} />
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: t.radiusSm,
              background: accentGradient,
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16
            }}>
              {siteName.charAt(0).toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: t.textPrimary, letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#productos" className="te-nav-link">Productos</a>
          {phone && <a href="#contacto" className="te-nav-link">Contacto</a>}
          <button className="te-btn-primary">
            Ver Catálogo
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        paddingTop: 'calc(64px)',
        background: heroBg,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Blobs decorativos — solo en temas con glow */}
        {showBlobs && (
          <>
            <div style={{
              position: 'absolute', top: '-80px', right: '-60px',
              width: '400px', height: '400px', borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}14 0%, transparent 65%)`,
              filter: 'blur(50px)', pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: '-50px', left: '-60px',
              width: '300px', height: '300px', borderRadius: '50%',
              background: `radial-gradient(circle, ${accent2}10 0%, transparent 65%)`,
              filter: 'blur(40px)', pointerEvents: 'none'
            }} />
          </>
        )}

        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '5rem 2.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem', alignItems: 'center',
          position: 'relative', zIndex: 1
        }}>
          {/* Left: headline + CTA */}
          <div>
            {/* Promo badge */}
            <div className="te-fade" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 999,
              background: `${accent2}1f`, border: `1px solid ${accent2}30`,
              fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: accent2, marginBottom: '1.75rem'
            }}>
              🏷️ Envío gratis en tu primera compra
            </div>

            <h1 className="te-fade te-fade-d1" style={{
              ...headingFont,
              fontSize: 'clamp(2.2rem, 7vw, 3.8rem)',
              letterSpacing: '-0.04em', lineHeight: 1.08,
              color: t.textPrimary,
              marginBottom: '1.25rem',
              wordBreak: 'break-word'
            }}>
              {heroTitle || `Bienvenido a ${siteName}`}
            </h1>
            <p className="te-fade te-fade-d2" style={{
              fontSize: '1.05rem',
              color: t.textSecondary, lineHeight: 1.65,
              maxWidth: 480, marginBottom: '2.5rem'
            }}>
              {heroSubtitle || 'Descubrí nuestros mejores productos con envío rápido y seguro a todo el país.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#productos" className="te-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Ver productos →
              </a>
              {phone && (
                <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{
                  padding: '12px 24px', borderRadius: t.radiusSm,
                  border: '2px solid #25d366', color: '#25d366',
                  fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#25d366'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25d366'; }}
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Right: mini product preview stack */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 340 }}>
              {/* Background card 3 */}
              <div style={{
                position: 'absolute', top: 20, right: -10,
                width: '88%', height: 90, borderRadius: t.radiusLg,
                background: `linear-gradient(135deg, ${accent}33, ${accent2}33)`,
                border: `1px solid ${t.borderSubtle}`,
                backdropFilter: 'blur(8px)'
              }} />
              {/* Background card 2 */}
              <div style={{
                position: 'absolute', top: 10, right: 0,
                width: '92%', height: 90, borderRadius: t.radiusLg,
                background: `linear-gradient(135deg, ${accent}26, ${accent2}26)`,
                border: `1px solid ${t.borderSubtle}`
              }} />
              {/* Main card */}
              <div style={{
                position: 'relative',
                background: cardBg,
                borderRadius: t.radiusXl,
                padding: '1.5rem',
                boxShadow: t.shadowElevated,
                border: `1px solid ${t.borderSubtle}`
              }}>
                <div style={{
                  aspectRatio: '16/9', borderRadius: t.radiusMd, marginBottom: '1rem',
                  background: DEFAULT_PRODUCTS[0].gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>✨</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Más Vendido</div>
                    <div style={{ fontWeight: 800, color: t.textPrimary, fontSize: '0.95rem' }}>Producto Premium</div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: accent }}>$99.99</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS STRIP */}
      <section style={{ background: darkBg, padding: '0 2.5rem' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0'
        }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{
              padding: '1.75rem 2rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              borderRight: i < BENEFITS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
            }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white', marginBottom: '0.15rem' }}>{b.title}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" style={{ padding: '6rem 2.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={labelPill}>
            Catálogo
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
            <h2 style={{
              ...headingFont,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              letterSpacing: '-0.04em', color: t.textPrimary
            }}>
              Nuestros Productos
            </h2>
            <p style={{ fontSize: '0.9rem', color: t.textMuted, fontWeight: 500 }}>
              {DEFAULT_PRODUCTS.length} artículos disponibles
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {DEFAULT_PRODUCTS.map((product) => (
            <div key={product.id} className="te-product-card" style={{ padding: '1.5rem' }}>
              {/* Image area */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{
                  aspectRatio: '4/3',
                  borderRadius: t.radiusMd,
                  background: product.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <span style={{
                    fontSize: '3.5rem', fontWeight: 900, fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.25)', letterSpacing: '-0.04em'
                  }}>
                    {product.id}
                  </span>
                  <div className="te-product-img-overlay">
                    <span style={{
                      background: 'white', color: '#111',
                      padding: '8px 18px', borderRadius: 999,
                      fontSize: '0.75rem', fontWeight: 800,
                      letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}>
                      Ver detalle
                    </span>
                  </div>
                </div>
                {/* Category badge */}
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <span className="te-badge">{product.category}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: t.textPrimary, letterSpacing: '-0.01em' }}>
                {product.name}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: accent, letterSpacing: '-0.02em' }}>
                  {product.price}
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '0.72rem', fontWeight: 700,
                  color: '#22c55e'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  En stock
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
        padding: '5rem 2.5rem',
        background: subCardBg,
        borderTop: `1px solid ${t.borderSubtle}`
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            ...headingFont,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            letterSpacing: '-0.04em', color: t.textPrimary,
            marginBottom: '1rem'
          }}>
            ¿Necesitas ayuda?
          </h2>
          <p style={{ fontSize: '1rem', color: t.textSecondary, marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Nuestro equipo está disponible para ayudarte con tu pedido.
          </p>

          {phone && (
            <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '18px 40px', borderRadius: t.radiusMd,
              background: '#25d366', color: 'white',
              fontSize: '0.92rem', fontWeight: 800, textDecoration: 'none',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              boxShadow: '0 12px 32px rgba(37,211,102,0.35)',
              marginBottom: '1.5rem'
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              💬 Contactar por WhatsApp
            </a>
          )}

          {!phone && (
            <button className="te-btn-primary" style={{ fontSize: '0.9rem', padding: '16px 40px' }}>
              Ir a Checkout
            </button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2rem 2.5rem',
        background: darkBg,
        borderTop: `1px solid ${t.borderSubtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: t.radiusSm,
            background: accentGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 14, color: 'white'
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
          © {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}
        </p>
      </footer>
    </div>
  );
}
