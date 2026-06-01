'use client';

import React from 'react';

import { getTheme, type Theme } from '@/lib/themes';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planType?: string;
  heroTitle?: string;
  aboutText?: string;
  phone?: string;
  address?: string;
  services?: Array<{ title: string; description: string }>;
  /** Tema visual. Define el ambiente; los colores de marca son el acento. */
  theme?: Theme;
}

const DEFAULT_SERVICES = [
  { title: 'Consultoría Estratégica', description: 'Asesoramiento personalizado para optimizar procesos y alcanzar tus metas de negocio.' },
  { title: 'Auditoría Profesional', description: 'Análisis exhaustivo de tus operaciones para identificar oportunidades de mejora.' },
  { title: 'Gestión de Proyectos', description: 'Implementación metodológica de soluciones con resultados comprobados.' },
  { title: 'Capacitación', description: 'Programas de entrenamiento especializado para potenciar el talento de tu equipo.' },
  { title: 'Soporte Continuo', description: 'Acompañamiento permanente en cada etapa del crecimiento de tu empresa.' },
  { title: 'Documentación Legal', description: 'Asesoramiento completo en normativas, compliance y marcos regulatorios.' },
];

const PROCESS_STEPS = [
  { n: '01', title: 'Diagnóstico', desc: 'Analizamos tu situación actual, objetivos y oportunidades de mejora.' },
  { n: '02', title: 'Estrategia', desc: 'Diseñamos un plan personalizado con métricas claras y alcanzables.' },
  { n: '03', title: 'Ejecución', desc: 'Implementamos las soluciones con seguimiento y ajuste continuo.' },
];

export default function ServiciosPro({
  siteName = 'Mi Estudio',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
  planType,
  heroTitle,
  aboutText,
  phone = '',
  address = '',
  services = DEFAULT_SERVICES,
  theme = getTheme('oficina'),
}: TemplateProps) {
  const t = theme.tokens;
  const isGlow = t.surface === 'glow';
  const showBlobs = t.gradientGlow !== 'transparent';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const accentGradient = t.useGradients ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;
  const accentLine = t.useGradients ? `linear-gradient(90deg, ${accent}, ${accent2})` : accent;

  const pageBg = isGlow ? `linear-gradient(135deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isGlow ? 'rgba(255,255,255,0.04)' : t.bgCard;
  const subCardBg = isGlow ? 'rgba(255,255,255,0.03)' : t.bgSubtle;
  const btnShadowHover = isGlow ? `0 16px 32px ${accent}66` : t.shadowElevated;

  // Pill de etiqueta de sección con tinte de acento.
  const labelPill: React.CSSProperties = {
    display: 'inline-block', padding: '5px 14px', borderRadius: 999,
    background: `${accent}1f`, border: `1px solid ${accent}30`,
    fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase', color: accent,
    marginBottom: '1.25rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sp-nav-link {
          font-size: 0.875rem; font-weight: 600; color: ${t.textMuted}; text-decoration: none;
          transition: color 0.3s ease;
        }
        .sp-nav-link:hover { color: ${accent}; }

        @keyframes sp-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sp-fade { animation: sp-fade-in 0.7s ease-out both; }
        .sp-fade-d1 { animation-delay: 0.1s; }
        .sp-fade-d2 { animation-delay: 0.2s; }

        .sp-service-card {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: ${t.radiusLg};
          position: relative;
          overflow: hidden;
        }
        .sp-service-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: ${accentLine};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .sp-service-card:hover::after { transform: scaleX(1); }
        .sp-service-card:hover {
          transform: translateY(-8px);
          box-shadow: ${btnShadowHover};
          border-color: ${t.borderHover} !important;
        }

        .sp-btn-primary {
          padding: 14px 36px;
          border-radius: ${t.radiusSm};
          background: ${accentGradient};
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.82rem;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sp-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-3px);
          box-shadow: ${btnShadowHover};
        }

        .sp-process-step {
          position: relative;
          padding-left: 2rem;
          flex: 1 1 240px;
        }
        .sp-process-step::before {
          content: '';
          position: absolute;
          top: 14px; left: 0;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${accent};
          box-shadow: ${isGlow ? `0 0 12px ${accent}80` : 'none'};
        }
      `}} />

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem',
        background: `${t.bgBase}E6`,
        borderBottom: `1px solid ${t.borderSubtle}`,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: t.radiusSm,
            background: accentGradient,
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 17
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: t.textPrimary, letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#servicios" className="sp-nav-link">Servicios</a>
          <a href="#proceso" className="sp-nav-link">Proceso</a>
          <a href="#sobre" className="sp-nav-link">Nosotros</a>
          <a href="#contacto" className="sp-btn-primary" style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '10px 22px' }}>
            Consulta Gratis →
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        paddingTop: 'calc(70px + 5rem)',
        paddingBottom: '5rem',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos — solo en temas con glow */}
        {showBlobs && (
          <>
            <div style={{
              position: 'absolute', top: '0', right: '-100px',
              width: '500px', height: '500px', borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`,
              filter: 'blur(60px)', pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: '-50px', left: '-80px',
              width: '350px', height: '350px', borderRadius: '50%',
              background: `radial-gradient(circle, ${accent2}10 0%, transparent 70%)`,
              filter: 'blur(40px)', pointerEvents: 'none'
            }} />
          </>
        )}

        {/* Badge */}
        <div className="sp-fade" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 18px', borderRadius: 999,
          background: `${accent}10`,
          border: `1px solid ${accent}25`,
          fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: accent, marginBottom: '1.75rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: isGlow ? `0 0 8px ${accent}` : 'none' }} />
          Servicios Profesionales
        </div>

        <h1 className="sp-fade sp-fade-d1" style={{
          ...headingFont,
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          letterSpacing: '-0.04em', lineHeight: 1.08,
          color: t.textPrimary,
          marginBottom: '1.5rem',
          wordBreak: 'break-word',
          maxWidth: 800
        }}>
          {heroTitle || `Soluciones Profesionales que Impulsan tu Éxito`}
        </h1>
        <p className="sp-fade sp-fade-d2" style={{
          fontSize: '1.1rem',
          color: t.textSecondary, lineHeight: 1.7, fontWeight: 400,
          maxWidth: 620, marginBottom: '3rem'
        }}>
          Experiencia, dedicación y resultados comprobados en cada proyecto que emprendemos juntos.
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
          {[
            { n: '10+', l: 'Años de experiencia' },
            { n: '500+', l: 'Clientes atendidos' },
            { n: '98%', l: 'Satisfacción' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '1.5rem 2.5rem',
              borderRight: i < 2 ? `1px solid ${t.borderSubtle}` : 'none',
              borderTop: `1px solid ${t.borderSubtle}`,
              display: 'flex', flexDirection: 'column', gap: '0.3rem'
            }}>
              <span style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.04em', lineHeight: 1, color: accent }}>{stat.n}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.textMuted }}>{stat.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{
        padding: '6rem 3rem',
        background: cardBg,
        borderTop: `1px solid ${t.borderSubtle}`,
        borderBottom: `1px solid ${t.borderSubtle}`
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <div style={labelPill}>
              Qué hacemos
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem' }}>
              <h2 style={{
                ...headingFont,
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                letterSpacing: '-0.04em',
                color: t.textPrimary,
              }}>
                Nuestros Servicios
              </h2>
              <div style={{ width: '60px', height: '4px', background: accentLine, borderRadius: 2 }} />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1.5rem'
          }}>
            {services.map((service, idx) => (
              <div
                key={idx}
                className="sp-service-card"
                style={{
                  padding: '2rem',
                  background: subCardBg,
                  border: `1px solid ${t.borderSubtle}`,
                  boxShadow: isGlow ? 'none' : t.shadowCard,
                  textAlign: 'left'
                }}
              >
                {/* Number badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: `linear-gradient(135deg, ${accent}26, ${accent2}26)`,
                    border: `1px solid ${accent}33`,
                    borderRadius: t.radiusSm,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em',
                    color: accent
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 800,
                  marginBottom: '0.65rem', color: t.textPrimary, letterSpacing: '-0.01em'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: t.textMuted, lineHeight: 1.65
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" style={{ padding: '6rem 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={labelPill}>
              Cómo trabajamos
            </div>
            <h2 style={{
              ...headingFont,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              letterSpacing: '-0.04em', color: t.textPrimary
            }}>
              Nuestro Proceso
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="sp-process-step">
                <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: '0.65rem' }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.65rem', letterSpacing: '-0.02em' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: t.textMuted, lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre" style={{
        padding: '6rem 3rem',
        background: cardBg,
        borderTop: `1px solid ${t.borderSubtle}`,
        borderBottom: `1px solid ${t.borderSubtle}`
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Left: avatar + decorative */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 160, height: 160, borderRadius: t.radiusXl,
                  background: accentGradient,
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '5rem', ...headingFont,
                  boxShadow: isGlow ? `0 24px 56px ${accent}35` : t.shadowElevated
                }}>
                  {siteName.charAt(0).toUpperCase()}
                </div>
                {/* Decorative ring */}
                <div style={{
                  position: 'absolute', inset: '-16px',
                  borderRadius: '44px',
                  border: `2px dashed ${accent}40`,
                  pointerEvents: 'none'
                }} />
              </div>
            </div>

            {/* Right: text */}
            <div>
              <div style={labelPill}>
                Sobre nosotros
              </div>
              <h2 style={{
                ...headingFont,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                letterSpacing: '-0.04em', color: t.textPrimary,
                marginBottom: '1.5rem', lineHeight: 1.15
              }}>
                Quiénes somos
              </h2>
              <p style={{
                fontSize: '1.05rem',
                color: t.textSecondary, lineHeight: 1.8,
                marginBottom: '2rem'
              }}>
                {aboutText || 'Somos un equipo de profesionales dedicados a brindar soluciones personalizadas que impulsen el crecimiento de nuestros clientes. Con años de experiencia, entendemos los desafíos únicos de cada industria.'}
              </p>
              <a href="#contacto" className="sp-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Trabajemos juntos →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{
        padding: '6rem 3rem',
        background: 'transparent'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={labelPill}>
            Hablemos
          </div>
          <h2 style={{
            ...headingFont,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '-0.04em', color: t.textPrimary,
            marginBottom: '1rem'
          }}>
            ¿Listo para empezar?
          </h2>
          <p style={{ fontSize: '1rem', color: t.textMuted, lineHeight: 1.65, marginBottom: '3rem' }}>
            Contáctanos y recibí una consulta inicial sin costo.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {phone && (
              <div style={{
                padding: '1.5rem 2rem',
                background: cardBg, borderRadius: t.radiusMd,
                border: `1px solid ${t.borderSubtle}`,
                boxShadow: isGlow ? 'none' : t.shadowCard,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Teléfono</p>
                  <a href={`tel:${phone}`} style={{ fontSize: '1.2rem', fontWeight: 800, color: accent, textDecoration: 'none', letterSpacing: '-0.01em' }}>
                    {phone}
                  </a>
                </div>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
              </div>
            )}
            {address && (
              <div style={{
                padding: '1.5rem 2rem',
                background: cardBg, borderRadius: t.radiusMd,
                border: `1px solid ${t.borderSubtle}`,
                boxShadow: isGlow ? 'none' : t.shadowCard,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Dirección</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: t.textPrimary, letterSpacing: '-0.01em' }}>
                    {address}
                  </p>
                </div>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
              </div>
            )}
          </div>

          <button className="sp-btn-primary" style={{ fontSize: '0.9rem', padding: '16px 44px' }}>
            Solicitar Consulta Gratuita
          </button>
        </div>
      </section>

      {/* FOOTER — banda oscura de cierre (consistente en todos los temas) */}
      <footer style={{
        padding: '2.5rem 3rem',
        background: isGlow ? t.bgSubtle : '#0f172a',
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
