'use client';

import React from 'react';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  features?: Array<{ title: string; description: string; icon: string }>;
}

const DEFAULT_FEATURES = [
  { title: 'Ultrarrápido', description: 'Carga en menos de 1 segundo con infraestructura optimizada para conversión.', icon: '⚡' },
  { title: 'Seguro', description: 'SSL encriptado y datos protegidos bajo los más altos estándares del sector.', icon: '🔒' },
  { title: 'Escalable', description: 'Crece con tu negocio sin límites ni interrupciones del servicio.', icon: '📈' },
];

const STATS = [
  { value: '500+', label: 'Marcas activas' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '< 3 min', label: 'Tiempo de setup' },
];

// Gradient colors per feature card icon background
const ICON_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
];

export default function LandingPro({
  siteName = 'Tu Marca',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
  planType,
  heroTitle,
  heroSubtitle,
  ctaText = 'Comenzar Ahora',
  features = DEFAULT_FEATURES,
}: TemplateProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#f1f5f9', fontFamily: "var(--font-inter), system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .lp-nav-link {
          font-size: 0.875rem; font-weight: 600; color: #cbd5e1; text-decoration: none;
          transition: color 0.3s ease;
        }
        .lp-nav-link:hover { color: white; }

        @keyframes lp-fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lp-fade { animation: lp-fade-in 0.8s ease-out both; }
        .lp-delay-1 { animation-delay: 0.1s; }
        .lp-delay-2 { animation-delay: 0.2s; }
        .lp-delay-3 { animation-delay: 0.3s; }
        .lp-delay-4 { animation-delay: 0.45s; }

        @keyframes lp-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        @keyframes lp-pulse-ring {
          0% { transform: scale(0.92); opacity: 0.7; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        .lp-pulse-ring {
          animation: lp-pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .lp-feature-card {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .lp-feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .lp-feature-card:hover::before { opacity: 1; }
        .lp-feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 32px 60px -12px rgba(99, 102, 241, 0.35);
          border-color: rgba(99, 102, 241, 0.4) !important;
        }

        .lp-btn {
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .lp-btn-primary {
          background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
          color: white;
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.4);
        }
        .lp-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 28px 55px -10px rgba(99, 102, 241, 0.55);
          filter: brightness(1.08);
        }
        .lp-btn-outline {
          background: transparent;
          border: 2px solid rgba(255,255,255,0.2) !important;
          color: white;
        }
        .lp-btn-outline:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.4) !important;
        }

        .lp-stat-item {
          text-align: center;
          padding: 0 2rem;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .lp-stat-item:last-child { border-right: none; }

        @keyframes lp-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .lp-cta-bg {
          background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(245,158,11,0.06) 100%);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 32px;
        }
      `}} />

      {/* NAV */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid rgba(99, 102, 241, 0.15)`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: 'white', fontStyle: 'italic'
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            {siteName}
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#features" className="lp-nav-link">Características</a>
          <a href="#cta" className="lp-nav-link">Contacto</a>
          <button className="lp-btn lp-btn-primary" style={{ fontSize: '0.8rem', padding: '10px 22px' }}>
            Comenzar →
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 7rem)', paddingBottom: '5rem', paddingLeft: '3rem', paddingRight: '3rem', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '10%', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 65%)`, filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${secondaryColor}0A 0%, transparent 65%)`, filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          {/* Badge */}
          <div className="lp-fade" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 999,
            border: `1px solid rgba(${parseInt(secondaryColor.slice(1,3),16)}, ${parseInt(secondaryColor.slice(3,5),16)}, ${parseInt(secondaryColor.slice(5,7),16)}, 0.35)`,
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: secondaryColor, background: `rgba(${parseInt(secondaryColor.slice(1,3),16)}, ${parseInt(secondaryColor.slice(3,5),16)}, ${parseInt(secondaryColor.slice(5,7),16)}, 0.1)`,
            marginBottom: '2rem'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: secondaryColor, boxShadow: `0 0 8px ${secondaryColor}` }} />
            Solución Profesional
          </div>

          <h1 className="lp-fade lp-delay-1" style={{
            fontSize: 'clamp(3rem, 9vw, 5.5rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em', lineHeight: 1.05,
            marginBottom: '1.5rem',
            wordBreak: 'break-word'
          }}>
            {heroTitle || (
              <>
                Transforma tu visión
                <br />
                <span style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  en realidad digital
                </span>
              </>
            )}
          </h1>

          <p className="lp-fade lp-delay-2" style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: '#94a3b8', lineHeight: 1.65, fontWeight: 400,
            maxWidth: 580, marginBottom: '2.5rem'
          }}>
            {heroSubtitle || 'Crea experiencias digitales que impulsan resultados. Herramientas modernas, sin complicaciones técnicas.'}
          </p>

          <div className="lp-fade lp-delay-3" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button className="lp-btn lp-btn-primary">
              {ctaText} →
            </button>
            <button className="lp-btn lp-btn-outline">
              Ver Demo
            </button>
          </div>

          {/* Stats strip */}
          <div className="lp-fade lp-delay-4" style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '1.5rem 0',
            width: 'fit-content'
          }}>
            {STATS.map((stat, i) => (
              <div key={i} className="lp-stat-item">
                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.03em', color: 'white', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#64748b', marginTop: '0.35rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '7rem 3rem', background: 'rgba(99, 102, 241, 0.04)', borderTop: '1px solid rgba(99, 102, 241, 0.12)', borderBottom: '1px solid rgba(99, 102, 241, 0.12)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: 999,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: primaryColor, marginBottom: '1.25rem'
            }}>
              Características
            </div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.04em', lineHeight: 1.2,
              marginBottom: '1rem'
            }}>
              Todo lo que necesitas para crecer
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              Herramientas pensadas para resultados reales desde el primer día
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="lp-feature-card"
                style={{
                  padding: '2.25rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: ICON_GRADIENTS[idx % ICON_GRADIENTS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', marginBottom: '1.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.65rem', color: 'white', letterSpacing: '-0.02em' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="cta" style={{ padding: '7rem 3rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="lp-cta-bg" style={{ padding: 'clamp(3rem,6vw,5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative blob inside CTA */}
            <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '200px', borderRadius: '50%', background: `radial-gradient(ellipse, ${primaryColor}18 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 900, fontStyle: 'italic',
                letterSpacing: '-0.04em', lineHeight: 1.15,
                marginBottom: '1.25rem'
              }}>
                ¿Listo para comenzar?
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.65 }}>
                Únete a cientos de empresas que ya están transformando sus resultados con {siteName}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="lp-btn lp-btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>
                  {ctaText}
                </button>
                <button className="lp-btn lp-btn-outline">
                  Hablar con ventas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2.5rem 3rem',
        borderTop: '1px solid rgba(99, 102, 241, 0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
        color: '#475569',
        fontSize: '0.82rem',
        fontWeight: 600
      }}>
        <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#64748b' }}>
          {siteName}
        </span>
        <p>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
