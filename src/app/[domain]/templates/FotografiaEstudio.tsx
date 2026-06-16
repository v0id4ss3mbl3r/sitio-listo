'use client';

import React from 'react';

import { getTheme, type Theme } from '@/lib/themes';
import { buildWhatsappUrl } from '@/lib/whatsapp';

type Item = {
  id: string;
  kind: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number | null;
  image_url: string | null;
  meta: Record<string, unknown>;
  sort_order: number;
};

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planType?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  phone?: string;
  theme?: Theme;
  items?: Item[];
}

// Placeholders para que un sitio nuevo (sin items cargados) ya se vea vivo.
const DEFAULT_GALLERY_GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'linear-gradient(135deg, #2d1065 0%, #1a0533 100%)',
  'linear-gradient(135deg, #0f2b1e 0%, #0a1e1b 100%)',
  'linear-gradient(135deg, #3a1c2b 0%, #1a0e16 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
  'linear-gradient(135deg, #1a0533 0%, #2d1065 100%)',
];

const DEFAULT_PACKAGES: Array<{ title: string; price: number | null; meta: { duration?: string; features?: string[] }; description: string }> = [
  { title: 'Sesión Retrato', price: 45000, meta: { duration: '1 h', features: ['10 fotos editadas', 'Locación a elección'] }, description: 'Ideal para perfiles, books y redes.' },
  { title: 'Evento Social', price: 120000, meta: { duration: '4 h', features: ['Cobertura completa', 'Galería online', '80+ fotos'] }, description: 'Cumpleaños, civil, brindis.' },
  { title: 'Producto / Marca', price: 70000, meta: { duration: '2 h', features: ['Fondo neutro', 'Retoque pro', 'Uso comercial'] }, description: 'Catálogo y e-commerce.' },
];

function asFeatures(v: unknown): string[] {
  return Array.isArray(v) ? (v as unknown[]).map(String) : [];
}

export default function FotografiaEstudio({
  siteName = 'Estudio',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText,
  phone = '',
  theme = getTheme('glow'),
  items = [],
}: TemplateProps) {
  const t = theme.tokens;
  const isDark = theme.mode === 'dark';
  const isGlow = t.surface === 'glow';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const accentGradient = t.useGradients ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;
  const pageBg = isGlow ? `linear-gradient(135deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : t.bgCard;
  const btnShadow = isGlow ? `0 16px 32px -8px ${accent}66` : t.shadowElevated;

  const galleryItems = items.filter((i) => i.kind === 'gallery' && i.image_url);
  const serviceItems = items.filter((i) => i.kind === 'service');

  const reserveUrl = (msg: string) =>
    phone ? buildWhatsappUrl(phone, msg) : '#paquetes';

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .fe-nav-link { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .fe-nav-link:hover { color: ${t.textPrimary}; }
        @keyframes fe-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fe-fade { animation: fe-fade 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .fe-d1 { animation-delay: 0.1s; } .fe-d2 { animation-delay: 0.2s; } .fe-d3 { animation-delay: 0.3s; }
        .fe-photo { position: relative; overflow: hidden; border-radius: ${t.radiusLg}; aspect-ratio: 3/4; }
        .fe-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .fe-photo:hover img { transform: scale(1.06); }
        .fe-pkg { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; border-radius: ${t.radiusLg}; }
        .fe-pkg:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; border-color: ${t.borderHover} !important; }
        .fe-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .fe-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .fe-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .fe-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .fe-btn-ghost:hover { background: ${accent}14; }
      `}} />

      {/* NAV */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem',
        background: `${t.bgBase}E6`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.borderSubtle}`,
      }}>
        <span style={{ ...headingFont, fontSize: 19, letterSpacing: '-0.02em', textTransform: 'uppercase', color: t.textPrimary }}>
          {siteName}
        </span>
        <nav style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
          <a href="#galeria" className="fe-nav-link">Galería</a>
          <a href="#paquetes" className="fe-nav-link">Paquetes</a>
          <a href="#sobre" className="fe-nav-link">Sobre mí</a>
          <a href={reserveUrl(`Hola ${siteName}! Quiero reservar una sesión.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="fe-btn fe-btn-primary" style={{ padding: '10px 22px', fontSize: '0.78rem' }}>
            Reservar
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 7rem)', paddingBottom: '6rem', paddingLeft: '3rem', paddingRight: '3rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="fe-fade" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999,
          border: `1px solid ${accent}40`, background: `${accent}14`, color: accent,
          fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
          Estudio de Fotografía
        </div>
        <h1 className="fe-fade fe-d1" style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.04em', lineHeight: 1.02, marginBottom: '1.5rem', maxWidth: 900 }}>
          {heroTitle || 'Capturamos la luz de cada momento'}
        </h1>
        <p className="fe-fade fe-d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, marginBottom: '2.5rem' }}>
          {heroSubtitle || 'Retrato, eventos y producto con una mirada propia. Reservá tu sesión en minutos.'}
        </p>
        <div className="fe-fade fe-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#galeria" className="fe-btn fe-btn-ghost">Ver galería</a>
          <a href={reserveUrl(`Hola ${siteName}! Quiero reservar una sesión.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="fe-btn fe-btn-primary">Reservar sesión</a>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" style={{ padding: '5rem 3rem', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', color: t.textPrimary }}>
            Trabajos recientes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {galleryItems.length > 0
              ? galleryItems.map((g) => (
                  <figure key={g.id} className="fe-photo" style={{ margin: 0, border: `1px solid ${t.borderSubtle}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.image_url as string} alt={g.title || siteName} />
                    {g.title && (
                      <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1rem', fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                        {g.title}
                      </figcaption>
                    )}
                  </figure>
                ))
              : DEFAULT_GALLERY_GRADIENTS.map((grad, i) => (
                  <div key={i} className="fe-photo" style={{ background: grad, border: `1px solid ${t.borderSubtle}` }} />
                ))}
          </div>
        </div>
      </section>

      {/* PAQUETES */}
      <section id="paquetes" style={{ padding: '6rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', color: t.textPrimary }}>
          Paquetes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {(serviceItems.length > 0 ? serviceItems : DEFAULT_PACKAGES).map((pkg, idx) => {
            const title = pkg.title;
            const price = pkg.price;
            const duration = (pkg.meta as { duration?: string })?.duration;
            const features = asFeatures((pkg.meta as { features?: unknown })?.features);
            const description = pkg.description ?? null;
            return (
              <div key={('id' in pkg ? (pkg as Item).id : idx)} className="fe-pkg" style={{ padding: '2rem', background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.35rem' }}>{title}</h3>
                {duration && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted }}>{duration}</span>
                )}
                {price != null && (
                  <div style={{ ...headingFont, fontSize: '2rem', color: accent, margin: '0.75rem 0', letterSpacing: '-0.02em' }}>
                    ${price.toLocaleString('es-AR')}
                  </div>
                )}
                {description && (
                  <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1rem' }}>{description}</p>
                )}
                {features.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: t.textSecondary }}>
                        <span style={{ color: accent, fontWeight: 900 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href={reserveUrl(`Hola ${siteName}! Me interesa el paquete "${title}". ¿Tenés disponibilidad?`)}
                  target={phone ? '_blank' : undefined}
                  rel="noreferrer"
                  className="fe-btn fe-btn-primary"
                  style={{ marginTop: 'auto', justifyContent: 'center' }}
                >
                  Reservar
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ padding: '6rem 3rem', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.5rem', color: t.textPrimary }}>
            Detrás de la cámara
          </h2>
          <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.8 }}>
            {aboutText || 'Soy fotógrafo/a independiente. Me obsesiona la luz natural y contar historias reales. Trabajemos juntos en tu próximo proyecto.'}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem 3rem', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, textTransform: 'uppercase', color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>
          © {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}
        </p>
      </footer>
    </div>
  );
}
