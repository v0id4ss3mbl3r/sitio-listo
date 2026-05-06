import React from 'react';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
}

const PROJECTS = [
  { id: '01', title: 'Brand Identity', category: 'Identidad Visual', year: '2024' },
  { id: '02', title: 'E-commerce', category: 'Desarrollo Web', year: '2024' },
  { id: '03', title: 'App Móvil', category: 'Diseño de Producto', year: '2023' },
  { id: '04', title: 'Campaña Digital', category: 'Estrategia', year: '2023' }
];

export default function PortfolioMinimal({ 
  siteName = 'Tu Nombre',
  primaryColor = '#6366f1',
  heroTitle,
  heroSubtitle,
  aboutText
}: TemplateProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;0,900;1,700;1,900&display=swap');
        
        .pm-nav-link {
          font-size: 10px; font-weight: 900; letter-spacing: 0.25em;
          text-transform: uppercase; color: #aaa; text-decoration: none;
          transition: color 0.2s;
        }
        .pm-nav-link:hover { color: #111; }
        
        .pm-project-card { transition: transform 0.3s ease; }
        .pm-project-card:hover { transform: translateY(-6px); }
        
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
      `}} />

      {/* ── NAV ──────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'rgba(248,248,246,0.85)',
        backdropFilter: 'blur(20px)',
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
      <section style={{ paddingTop: 'calc(64px + clamp(5rem,12vw,12rem))', paddingBottom: 'clamp(5rem,10vw,10rem)', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: 1280, margin: '0 auto' }}>
        {/* Badge */}
        <div className="pm-fade" style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: 999,
          border: '1px solid rgba(0,0,0,0.1)',
          fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: primaryColor, background: `${primaryColor}10`,
          marginBottom: '2.5rem'
        }}>
          Estudio Digital
        </div>

        <h1 className="pm-fade pm-fade-d1" style={{
          fontSize: 'clamp(3rem, 11vw, 9.5rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.05em', lineHeight: 0.85,
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          wordBreak: 'break-word'
        }}>
          {heroTitle || siteName}
        </h1>

        <p className="pm-fade pm-fade-d2" style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: '#888', lineHeight: 1.55, fontWeight: 500,
          maxWidth: 580
        }}>
          {heroSubtitle || 'Diseño y estrategia para marcas que buscan destacar en la era digital.'}
        </p>
      </section>

      {/* ── PROYECTOS ────────────────────────────────── */}
      <section id="work" style={{ background: '#111', color: '#f0f0f0', padding: 'clamp(5rem,10vw,10rem) 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end',
            gap: '1rem', marginBottom: 'clamp(3rem,6vw,6rem)'
          }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', lineHeight: 0.85 }}>
              Proyectos
            </h2>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#333' }}>
              Selección 2023–2024
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)'
          }}>
            {PROJECTS.map(item => (
              <div key={item.id} className="pm-project-card" style={{ cursor: 'pointer' }}>
                {/* Placeholder de imagen */}
                <div style={{
                  aspectRatio: '4/3', borderRadius: 20, marginBottom: '1.5rem',
                  background: '#1a1a1a', overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: '4rem', fontWeight: 900, fontStyle: 'italic', color: 'rgba(255,255,255,0.06)' }}>
                    {item.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#444', marginBottom: '0.4rem' }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
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
      <section id="about" style={{ padding: 'clamp(5rem,10vw,10rem) 2rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3rem' }}>
          {/* Icono del estudio — usa la primera letra real del nombre */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: '#111', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 900, fontStyle: 'italic',
            flexShrink: 0
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>

          <p style={{
            fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#111'
          }}>
            {aboutText || 'Diseñador independiente que ayuda a marcas con visión a transformar sus ideas en experiencias digitales memorables.'}
          </p>

          <button style={{
            padding: '18px 56px', borderRadius: 999,
            background: primaryColor, color: '#fff',
            fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer',
            transition: 'filter 0.2s, transform 0.2s',
            boxShadow: `0 8px 24px ${primaryColor}40`
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Hablemos hoy
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer id="contact" style={{
        padding: 'clamp(3rem,6vw,5rem) 2rem',
        background: '#f8f8f6',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '1.5rem'
      }}>
        <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic' }}>
          {siteName}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {['Twitter / X', 'Instagram', 'LinkedIn'].map(s => (
            <a key={s} href="#" className="pm-social-link">{s}</a>
          ))}
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#ccc', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} — SitioListo
        </p>
      </footer>
    </div>
  );
}
