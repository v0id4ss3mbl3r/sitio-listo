'use client';

import React from 'react';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
}

const PROJECTS = [
  { id: '01', title: 'Brand Identity', category: 'Identidad Visual', year: '2024', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', accent: '#e94560' },
  { id: '02', title: 'E-commerce', category: 'Desarrollo Web', year: '2024', gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #1e3a5f 100%)', accent: '#00d4ff' },
  { id: '03', title: 'App Móvil', category: 'Diseño de Producto', year: '2023', gradient: 'linear-gradient(135deg, #1a0533 0%, #2d1065 50%, #1a0533 100%)', accent: '#c084fc' },
  { id: '04', title: 'Campaña Digital', category: 'Estrategia', year: '2023', gradient: 'linear-gradient(135deg, #0a1628 0%, #0f2b1e 50%, #0a1e1b 100%)', accent: '#34d399' },
];

const SKILLS = [
  'Branding', 'UI/UX Design', 'Motion', 'Web Dev', 'Estrategia', 'Fotografía', 'Copy', 'SEO'
];

export default function PortfolioMinimal({
  siteName = 'Tu Nombre',
  primaryColor = '#6366f1',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText
}: TemplateProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', fontFamily: "var(--font-inter), system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .pm-nav-link {
          font-size: 10px; font-weight: 900; letter-spacing: 0.25em;
          text-transform: uppercase; color: #aaa; text-decoration: none;
          transition: color 0.2s;
        }
        .pm-nav-link:hover { color: #111; }

        .pm-project-card {
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pm-project-card:hover { transform: translateY(-8px); }
        .pm-project-card:hover .pm-project-img { transform: scale(1.04); }
        .pm-project-card:hover .pm-project-arrow { opacity: 1; transform: translate(0, 0); }

        .pm-project-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pm-project-arrow {
          opacity: 0;
          transform: translate(-6px, 6px);
          transition: all 0.3s ease;
        }

        .pm-skill-tag {
          display: inline-block;
          padding: 7px 18px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.1);
          font-size: 10px; font-weight: 900;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #555; background: transparent;
          transition: all 0.2s ease;
          cursor: default;
        }
        .pm-skill-tag:hover {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        .pm-social-link {
          font-size: 10px; font-weight: 900; letter-spacing: 0.3em;
          text-transform: uppercase; color: #aaa; text-decoration: none;
          transition: color 0.2s;
        }
        .pm-social-link:hover { color: #111; }

        @keyframes pm-fade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pm-fade { animation: pm-fade 1s cubic-bezier(0.16,1,0.3,1) both; }
        .pm-fade-d1 { animation-delay: 0.15s; }
        .pm-fade-d2 { animation-delay: 0.3s; }
        .pm-fade-d3 { animation-delay: 0.45s; }
      `}} />

      {/* ── NAV ──────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: 'rgba(248,248,246,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>
          {siteName}
        </span>
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#work" className="pm-nav-link">Trabajos</a>
          <a href="#about" className="pm-nav-link">Sobre mí</a>
          <a href="#contact" className="pm-nav-link">Contacto</a>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ paddingTop: 'calc(64px + clamp(5rem,12vw,12rem))', paddingBottom: 'clamp(4rem,8vw,8rem)', paddingLeft: '2.5rem', paddingRight: '2.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div className="pm-fade" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 999,
          border: '1px solid rgba(0,0,0,0.1)',
          fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: primaryColor, background: `${primaryColor}12`,
          marginBottom: '2.5rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: primaryColor }} />
          Estudio Digital
        </div>

        <h1 className="pm-fade pm-fade-d1" style={{
          fontSize: 'clamp(3rem, 10vw, 8.5rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.05em', lineHeight: 0.88,
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          wordBreak: 'break-word'
        }}>
          {heroTitle || siteName}
        </h1>

        <div className="pm-fade pm-fade-d2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
          <p style={{
            fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
            color: '#777', lineHeight: 1.6, fontWeight: 500,
            maxWidth: 520
          }}>
            {heroSubtitle || 'Diseño y estrategia para marcas que buscan destacar en la era digital.'}
          </p>

          {/* Available badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', borderRadius: 999,
            background: '#111', color: '#fff',
            fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
            flexShrink: 0
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            Disponible para proyectos
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────── */}
      <section style={{ padding: '0 2.5rem clamp(4rem,8vw,8rem)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#bbb', marginRight: '0.5rem', flexShrink: 0 }}>
              Servicios
            </span>
            {SKILLS.map(skill => (
              <span key={skill} className="pm-skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROYECTOS ────────────────────────────────── */}
      <section id="work" style={{ background: '#111', color: '#f0f0f0', padding: 'clamp(5rem,10vw,10rem) 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end',
            gap: '1rem', marginBottom: 'clamp(3rem,6vw,6rem)'
          }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', lineHeight: 0.88 }}>
              Proyectos
            </h2>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#333' }}>
              Selección 2023–2024
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)'
          }}>
            {PROJECTS.map((item, i) => (
              <div key={item.id} className="pm-project-card">
                {/* Image area */}
                <div style={{
                  aspectRatio: '4/3', borderRadius: 20, marginBottom: '1.5rem',
                  overflow: 'hidden', position: 'relative',
                  background: item.gradient
                }}>
                  {/* Noise texture overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                  {/* Accent glow */}
                  <div style={{
                    position: 'absolute', bottom: '-20%', left: '-10%',
                    width: '60%', height: '60%', borderRadius: '50%',
                    background: `radial-gradient(circle, ${item.accent}40 0%, transparent 70%)`,
                    filter: 'blur(20px)'
                  }} />
                  {/* Project ID + arrow in corner */}
                  <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', right: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)',
                      padding: '5px 10px', borderRadius: 999,
                      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)'
                    }}>
                      {item.id}
                    </span>
                    <div className="pm-project-arrow" style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 900
                    }}>
                      ↗
                    </div>
                  </div>
                  {/* Big accent text */}
                  <div style={{
                    position: 'absolute', bottom: '1.25rem', left: '1.5rem',
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, fontStyle: 'italic',
                    color: `${item.accent}30`, lineHeight: 1, letterSpacing: '-0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {item.title.split(' ')[0]}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#444', marginBottom: '0.4rem' }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {item.title}
                    </h3>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#333', letterSpacing: '0.1em', paddingTop: '0.1rem', flexShrink: 0 }}>
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE MÍ ─────────────────────────────────── */}
      <section id="about" style={{ padding: 'clamp(5rem,10vw,10rem) 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* Top: label + headline */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 auto' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 22,
                  background: '#111', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 34, fontWeight: 900, fontStyle: 'italic',
                }}>
                  {siteName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#bbb', marginBottom: '1.25rem' }}>
                  Sobre mí
                </div>
                <p style={{
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
                  fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em',
                  color: '#111', marginBottom: '2rem'
                }}>
                  {aboutText || 'Diseñador independiente que ayuda a marcas con visión a transformar sus ideas en experiencias digitales memorables.'}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              {[
                { n: '40+', l: 'Proyectos entregados' },
                { n: '5 años', l: 'De experiencia' },
                { n: '100%', l: 'Clientes satisfechos' },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: '1 1 160px', padding: '2rem 2.5rem',
                  borderRight: i < 2 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: '0.4rem'
                }}>
                  <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1, color: '#111' }}>{stat.n}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#bbb' }}>{stat.l}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button style={{
                padding: '18px 52px', borderRadius: 999,
                background: primaryColor, color: '#fff',
                fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
                border: 'none', cursor: 'pointer',
                transition: 'filter 0.2s, transform 0.2s',
                boxShadow: `0 12px 32px ${primaryColor}40`
              }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Hablemos hoy →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer id="contact" style={{
        padding: 'clamp(3rem,6vw,5rem) 2.5rem',
        background: '#111', color: '#f0f0f0',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '1.5rem'
      }}>
        <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>
          {siteName}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {['Twitter / X', 'Instagram', 'LinkedIn'].map(s => (
            <a key={s} href="#" style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}
            >{s}</a>
          ))}
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#2a2a2a', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()}
          {(!planType || planType === 'basic') && ' — SitioListo'}
        </p>
      </footer>
    </div>
  );
}
