"use client";
import React, { useState } from 'react';

import { getTheme, type Theme } from '@/lib/themes';

export type CategoryId = 'burgers' | 'sides' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: string;
}

export interface MenuCategory {
  id: CategoryId;
  label: string;
}

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  categories?: MenuCategory[];
  menuItems?: Record<CategoryId, MenuItem[]>;
  /** Tema visual. Define el ambiente; los colores de marca son el acento.
   *  El hero (foto con overlay) se mantiene oscuro en todos los temas. */
  theme?: Theme;
}

const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'burgers', label: 'Hamburguesas' },
  { id: 'sides', label: 'Acompañamientos' },
  { id: 'drinks', label: 'Bebidas' }
];

const DEFAULT_MENU: Record<CategoryId, MenuItem[]> = {
  burgers: [
    { id: '01', name: 'Original Smash', desc: 'Doble carne, cheddar real, cebolla braseada.', price: '$8.200' },
    { id: '02', name: 'Blue Cheese', desc: 'Roquefort premium, nueces y miel de caña.', price: '$9.500' },
    { id: '03', name: 'Crispy Truffle', desc: 'Aceite de trufa blanca y hongos silvestres.', price: '$10.800' }
  ],
  sides: [
    { id: '04', name: 'Papas Rústicas', desc: 'Con romero, sal marina y alioli de la casa.', price: '$4.200' },
    { id: '05', name: 'Onion Rings', desc: 'Aros de cebolla gigantes con dip de BBQ.', price: '$4.500' }
  ],
  drinks: [
    { id: '06', name: 'IPA Artesanal', desc: 'Cerveza tirada, amargor intenso y frutal.', price: '$3.500' },
    { id: '07', name: 'Limonada Ginger', desc: 'Jengibre, menta y almíbar orgánico.', price: '$2.800' }
  ]
};

// Placeholders oscuros (estilo "foto") para los ítems del menú.
const ITEM_COLORS = ['#1a1a1a', '#141414', '#111111'];

export default function SaborUrbano({
  siteName = "Sabor Urbano",
  primaryColor = "#ff4500",
  planType,
  heroTitle = "Sabor que conecta",
  heroSubtitle = "Artesanía en cada mordida. Ingredientes reales, recetas propias y la mejor vibra de la ciudad.",
  aboutText = "Nuestra mística nace de la paciencia. Seleccionamos cada corte, horneamos nuestro propio pan y creamos salsas que no existen en ningún otro lugar.",
  categories = DEFAULT_CATEGORIES,
  menuItems = DEFAULT_MENU,
  theme = getTheme('glow'),
}: TemplateProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(categories[0].id);

  const t = theme.tokens;
  const isGlow = t.surface === 'glow';
  // Claro vs oscuro = modo (Vivo es glow pero claro). isGlow solo para efectos.
  const isDark = theme.mode === 'dark';
  const accent = primaryColor;

  const pageBg = isGlow ? `linear-gradient(135deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : t.bgCard;
  const darkBg = isDark ? t.bgSubtle : '#0a0a0a';
  // El hero es una foto oscura; el overlay funde hacia el fondo del tema.
  const heroOverlay = `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 38%, ${t.bgBase}E6 86%, ${t.bgBase} 100%)`;

  return (
    <div
      className="min-h-screen scroll-smooth overflow-x-hidden"
      style={{ '--primary': accent, fontFamily: t.fontBody, background: pageBg, color: t.textPrimary } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .su-btn-primary {
          background: var(--primary);
          color: #fff;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .su-btn-primary:hover { filter: brightness(1.12); transform: translateY(-2px); }
        .su-btn-primary:active { transform: scale(0.97); }

        .su-btn-ghost {
          border: 1.5px solid ${t.borderHover};
          color: ${t.textPrimary};
          transition: background 0.2s, border-color 0.2s;
        }
        .su-btn-ghost:hover { background: ${accent}1f; border-color: ${accent}; }

        .su-card {
          background: ${cardBg};
          border: 1px solid ${t.borderSubtle};
          box-shadow: ${isDark ? 'none' : t.shadowCard};
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .su-card:hover {
          transform: translateY(-4px);
          box-shadow: ${isDark ? 'none' : t.shadowElevated};
          border-color: ${t.borderHover};
        }

        .su-cat-btn {
          border-bottom: 2px solid transparent;
          color: ${t.textMuted};
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding-bottom: 8px;
          transition: color 0.2s, border-color 0.2s;
          cursor: pointer;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          white-space: nowrap;
        }
        .su-cat-btn:hover { color: ${t.textSecondary}; }
        .su-cat-btn.active { color: ${t.textPrimary}; border-bottom-color: var(--primary); }

        @keyframes su-reveal {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .su-reveal { animation: su-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .su-reveal-d1 { animation-delay: 0.1s; opacity: 0; }
        .su-reveal-d2 { animation-delay: 0.2s; opacity: 0; }
        .su-reveal-d3 { animation-delay: 0.3s; opacity: 0; }

        @keyframes su-item-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .su-item-in { animation: su-item-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}} />

      {/* ── NAV ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem',
        background: `${t.bgBase}D9`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.borderSubtle}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: t.radiusSm,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 20, color: '#fff', fontStyle: 'italic',
            flexShrink: 0, fontFamily: 'var(--font-jetbrains)'
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic', fontFamily: 'var(--font-jetbrains)', color: t.textPrimary }}>
            {siteName}
          </span>
        </div>

        <div className="hidden lg:flex" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {['La Carta', 'Historia', 'Visitanos'].map((label, i) => (
            <a key={i} href={['#menu', '#about', '#location'][i]}
              style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = t.textPrimary)}
              onMouseLeave={e => (e.currentTarget.style.color = t.textMuted)}
            >{label}</a>
          ))}
        </div>

        <button className="su-btn-primary" style={{
          padding: '10px 24px', borderRadius: t.radiusSm,
          fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer'
        }}>
          RESERVAR
        </button>
      </nav>

      {/* ── HERO (foto oscura, constante en todos los temas) ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 1.5rem', paddingTop: '72px',
        overflow: 'hidden'
      }}>
        {/* Imagen de fondo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/templates/restaurant_hero.png')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.28) contrast(1.1)'
        }} />
        {/* Viñeta inferior que funde hacia el fondo del tema */}
        <div style={{
          position: 'absolute', inset: 0,
          background: heroOverlay
        }} />

        <div className="su-reveal" style={{ position: 'relative', zIndex: 10, maxWidth: 900 }}>
          <div className="su-reveal-d1 su-reveal" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            border: '1px solid', borderColor: 'var(--primary)',
            color: 'var(--primary)', background: 'rgba(0,0,0,0.3)',
            fontSize: 9, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase',
            marginBottom: '2.5rem', backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'su-reveal 1s ease infinite alternate' }} />
            Urban Excellence
          </div>

          <h2 className="su-reveal su-reveal-d2" style={{
            ...headingFont,
            fontSize: 'clamp(3rem, 11vw, 9.5rem)',
            lineHeight: 0.85, letterSpacing: '-0.05em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
            color: '#fafafa'
          }}>
            {heroTitle}
          </h2>

          <p className="su-reveal su-reveal-d3" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#cbcbcb', maxWidth: 560, margin: '0 auto 3rem',
            lineHeight: 1.6, fontWeight: 500
          }}>
            {heroSubtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a href="#menu" className="su-btn-primary" style={{
              padding: '16px 40px', borderRadius: t.radiusMd,
              fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
              textDecoration: 'none', display: 'inline-block'
            }}>
              Explorar Menú
            </a>
            <a href="#about" style={{
              padding: '16px 40px', borderRadius: t.radiusMd,
              border: '1.5px solid rgba(255,255,255,0.2)', color: '#fafafa',
              fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
              textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, border-color 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              Nuestra Mística
            </a>
          </div>
        </div>
      </section>

      {/* ── MENÚ ─────────────────────────────────────── */}
      <section id="menu" style={{ padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Encabezado del menú */}
          <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{
              ...headingFont,
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '-0.05em', textTransform: 'uppercase',
              lineHeight: 0.85, color: t.textPrimary
            }}>La Carta</h3>
            <p style={{ color: t.textMuted, fontSize: '1.05rem', maxWidth: 420 }}>
              Seleccioná una categoría y descubrí nuestra propuesta.
            </p>
            {/* Tabs de categorías */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: `1px solid ${t.borderSubtle}`, paddingBottom: 0, marginTop: '0.5rem' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`su-cat-btn${activeCategory === cat.id ? ' active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla de ítems */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {menuItems[activeCategory]?.map((item, idx) => (
              <div
                key={`${activeCategory}-${item.id}`}
                className="su-card su-item-in"
                style={{ borderRadius: t.radiusXl, padding: '1.5rem', animationDelay: `${idx * 0.08}s` }}
              >
                {/* Placeholder visual del ítem */}
                <div style={{
                  aspectRatio: '4/3', borderRadius: t.radiusMd, marginBottom: '1.25rem',
                  background: ITEM_COLORS[idx % ITEM_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px'
                }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, fontStyle: 'italic', color: 'rgba(255,255,255,0.1)' }}>
                    {item.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.75rem' }}>
                  <h4 style={{ ...headingFont, textTransform: 'uppercase', fontSize: '1.1rem', lineHeight: 1.1, letterSpacing: '-0.02em', color: t.textPrimary }}>
                    {item.name}
                  </h4>
                  <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--primary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {item.price}
                  </span>
                </div>
                <p style={{ color: t.textMuted, fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {item.desc}
                </p>
                <button className="su-btn-primary" style={{
                  width: '100%', padding: '12px',
                  borderRadius: t.radiusSm,
                  fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer'
                }}>
                  PEDIR AHORA
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ─────────────────────────────────── */}
      <section id="about" style={{ padding: 'clamp(5rem,10vw,10rem) 1.5rem', background: darkBg }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(3rem, 6vw, 7rem)', alignItems: 'center'
        }}>
          {/* Imagen / placeholder */}
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '4/5', borderRadius: t.radiusXl,
              overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
              background: '#0c0c0c',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)',
              backgroundSize: '18px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/templates/restaurant_hero.png"
                alt="Historia"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.55)', transition: 'filter 0.8s ease' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0) brightness(0.9)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(1) brightness(0.55)')}
              />
            </div>
            {/* Badge 100% */}
            <div style={{
              position: 'absolute', bottom: '-1.5rem', right: '-1rem',
              width: 120, height: 120, borderRadius: '50%',
              background: darkBg, border: `6px solid ${isGlow ? t.bgBase : darkBg}`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--primary)', lineHeight: 1 }}>100%</span>
              <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa' }}>Calidad</span>
            </div>
          </div>

          {/* Texto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{
              ...headingFont,
              fontSize: 'clamp(2rem, 7vw, 5rem)',
              letterSpacing: '-0.05em', textTransform: 'uppercase',
              lineHeight: 0.9, color: t.textPrimary
            }}>
              Fuego<br />& <span style={{ color: 'var(--primary)' }}>Espíritu</span>
            </h3>
            <p style={{ color: t.textSecondary, fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500 }}>
              {aboutText}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '2rem', borderTop: `1px solid ${t.borderSubtle}` }}>
              {[{ n: '12+', l: 'Variedades' }, { n: '5★', l: 'Calificación' }].map(s => (
                <div key={s.l}>
                  <span style={{ ...headingFont, display: 'block', fontSize: 'clamp(2rem,6vw,3.5rem)', lineHeight: 1, marginBottom: '0.4rem', color: t.textPrimary }}>{s.n}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: t.textMuted }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HORARIOS & UBICACIÓN ─────────────────────── */}
      <section id="location" style={{ padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem', alignItems: 'stretch'
        }}>
          {/* Horarios */}
          <div className="su-card" style={{ borderRadius: t.radiusXl, padding: 'clamp(2rem, 5vw, 3.5rem)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ ...headingFont, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', textTransform: 'uppercase', letterSpacing: '-0.04em', color: t.textPrimary }}>
              Horarios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { d: 'Lun — Jue', h: '19:00 — 00:00' },
                { d: 'Vie — Sáb', h: '19:00 — 02:00' },
                { d: 'Domingos', h: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.d} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: '1.25rem', borderBottom: `1px solid ${t.borderSubtle}`
                }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.textMuted }}>{item.d}</span>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem', color: t.textPrimary }}>{item.h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="su-card" style={{ borderRadius: t.radiusXl, padding: 'clamp(2rem, 5vw, 3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ ...headingFont, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', textTransform: 'uppercase', letterSpacing: '-0.04em', color: t.textPrimary }}>
                Visitanos
              </h3>
              <div>
                <p style={{ ...headingFont, fontSize: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '0.4rem', color: t.textPrimary }}>
                  Av. Siempreviva 742
                </p>
                <p style={{ fontSize: '0.8rem', color: t.textMuted, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Buenos Aires, Argentina
                </p>
              </div>
            </div>
            <button className="su-btn-primary" style={{
              width: '100%', padding: '18px',
              borderRadius: t.radiusMd, fontSize: 10, fontWeight: 900,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              border: 'none', cursor: 'pointer'
            }}>
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{
        padding: 'clamp(3rem,6vw,5rem) 1.5rem',
        borderTop: `1px solid ${t.borderSubtle}`,
        background: darkBg,
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: t.radiusSm,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18, color: '#fff', fontStyle: 'italic', flexShrink: 0
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ ...headingFont, fontSize: 'clamp(1.25rem,4vw,2rem)', textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#fafafa' }}>
            {siteName}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {['Instagram', 'Facebook', 'WhatsApp'].map(s => (
            <a key={s} href="#" style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >{s}</a>
          ))}
        </div>

        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#666' }}>
          © {new Date().getFullYear()} {siteName}
          {(!planType || planType === 'basic') && ' — Powered by SitioListo'}
        </p>
      </footer>
    </div>
  );
}
