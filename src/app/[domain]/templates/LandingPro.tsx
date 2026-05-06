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
  { title: 'Rápido', description: 'Carga en menos de 1 segundo', icon: '⚡' },
  { title: 'Seguro', description: 'SSL encriptado y datos protegidos', icon: '🔒' },
  { title: 'Escalable', description: 'Crece con tu negocio sin límites', icon: '📈' },
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;0,900;1,700;1,900&display=swap');

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

        @keyframes lp-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .lp-float { animation: lp-float 6s ease-in-out infinite; }

        .lp-feature-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 16px;
        }
        .lp-feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.3);
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
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.3);
        }
        .lp-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 25px 50px -10px rgba(99, 102, 241, 0.4);
        }

        .lp-btn-outline {
          background: transparent;
          border: 2px solid ${primaryColor};
          color: white;
        }
        .lp-btn-outline:hover {
          background: rgba(99, 102, 241, 0.1);
        }
      `}} />

      {/* NAV */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid rgba(99, 102, 241, 0.2)`
      }}>
        <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', textTransform: 'uppercase', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {siteName}
        </span>
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#features" className="lp-nav-link">Características</a>
          <a href="#cta" className="lp-nav-link">CTA</a>
          <button className="lp-btn lp-btn-primary" style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
            Comenzar
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 6rem)', paddingBottom: '8rem', paddingLeft: '3rem', paddingRight: '3rem', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div className="lp-fade" style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: 999,
            border: `1px solid rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.3)`,
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: secondaryColor, background: `rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.1)`,
            marginBottom: '2rem'
          }}>
            Solución Profesional
          </div>

          <h1 className="lp-fade lp-delay-1" style={{
            fontSize: 'clamp(3rem, 10vw, 5.5rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em', lineHeight: 1.1,
            marginBottom: '1.5rem',
            wordBreak: 'break-word'
          }}>
            {heroTitle || 'Transforma tu visión en realidad digital'}
          </h1>

          <p className="lp-fade lp-delay-2" style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: '#cbd5e1', lineHeight: 1.6, fontWeight: 500,
            maxWidth: 600, marginBottom: '2.5rem'
          }}>
            {heroSubtitle || 'Crea experiencias digitales que impulsan resultados. Herramientas modernas, sin complicaciones.'}
          </p>

          <div className="lp-fade lp-delay-3" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn lp-btn-primary">
              {ctaText}
            </button>
            <button className="lp-btn lp-btn-outline">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '6rem 3rem', background: 'rgba(99, 102, 241, 0.05)', borderTop: '1px solid rgba(99, 102, 241, 0.2)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.04em', lineHeight: 1.2,
              marginBottom: '1rem'
            }}>
              Características Principales
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: 600, margin: '0 auto' }}>
              Todo lo que necesitas para tener éxito
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="lp-feature-card"
                style={{
                  padding: '2.5rem',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="cta" style={{ padding: '6rem 3rem', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.04em', lineHeight: 1.2,
          marginBottom: '1.5rem',
          maxWidth: 700,
          margin: '0 auto 1.5rem'
        }}>
          ¿Listo para comenzar?
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
          Únete a miles de empresas que ya están transformando sus resultados
        </p>
        <button className="lp-btn lp-btn-primary" style={{ marginBottom: '3rem' }}>
          {ctaText}
        </button>

        <footer style={{
          paddingTop: '3rem',
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
          color: '#94a3b8',
          fontSize: '0.85rem'
        }}>
          <p>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
        </footer>
      </section>
    </div>
  );
}
