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
  address?: string;
  openingHours?: string;
  theme?: Theme;
  items?: Item[];
}

const SERVICE_ICONS = ['🎧', '🔊', '💡', '📺', '🎤', '✨'];

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'DJ profesional', subtitle: null, description: 'Música para toda la noche, adaptada a tu evento.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Sonido e iluminación', subtitle: null, description: 'Equipos de alta potencia y luces robóticas.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Pantallas LED', subtitle: null, description: 'Visuales y proyección para impactar.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Pista y efectos', subtitle: null, description: 'Humo, chispas frías y cabina de fotos.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_TESTIMONIALS: Item[] = [
  { id: 'r1', kind: 'testimonial', title: 'Caro & Nico', subtitle: 'Casamiento', description: '¡La pista no paró en toda la noche! Hicieron una fiesta increíble.', price: null, image_url: null, meta: { rating: '5' }, sort_order: 0 },
  { id: 'r2', kind: 'testimonial', title: 'Empresa Lumina', subtitle: 'Evento corporativo', description: 'Súper profesionales, puntuales y con un sonido impecable.', price: null, image_url: null, meta: { rating: '5' }, sort_order: 1 },
];

function stars(meta: Record<string, unknown>): string {
  const n = Math.max(1, Math.min(5, Number(meta?.rating) || 5));
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

export default function EventosDj({
  siteName = 'Eventos & DJ',
  primaryColor = '#a855f7',
  secondaryColor = '#ec4899',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText,
  phone = '',
  address = '',
  openingHours = '',
  theme = getTheme('glow'),
  items = [],
}: TemplateProps) {
  const t = theme.tokens;
  const isDark = theme.mode === 'dark';
  const isGlow = t.surface === 'glow';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const accentGradient = t.useGradients ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;
  const pageBg = isGlow ? `linear-gradient(180deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : t.bgCard;
  const btnShadow = isGlow ? `0 16px 32px -8px ${accent}66` : t.shadowElevated;

  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const gallery = items.filter((i) => i.kind === 'gallery');
  const testimonials = items.filter((i) => i.kind === 'testimonial');
  const testimonialList = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .evt-link { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .evt-link:hover { color: ${accent}; }
        @keyframes evt-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
        .evt-rise { animation: evt-rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .evt-d1 { animation-delay: 0.1s; } .evt-d2 { animation-delay: 0.22s; } .evt-d3 { animation-delay: 0.34s; }
        .evt-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 32px; border-radius: 999px; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .evt-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .evt-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .evt-btn-ghost { background: transparent; border: 1.5px solid ${accent}66; color: ${t.textPrimary}; }
        .evt-btn-ghost:hover { background: ${accent}1a; }
        .evt-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .evt-card:hover { transform: translateY(-5px); border-color: ${accent}66 !important; }
        .evt-grad { background: ${t.useGradients ? t.gradientHero : accent}; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.02em', textTransform: 'uppercase', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#servicios" className="evt-link">Servicios</a>
          <a href="#galeria" className="evt-link">Galería</a>
          <a href={wa(`Hola ${siteName}, quería cotizar un evento.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="evt-btn evt-btn-primary" style={{ padding: '9px 20px', fontSize: '0.7rem' }}>Cotizar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: gallery[0]?.image_url ? undefined : `radial-gradient(circle at 25% 25%, ${accent}2e, transparent 55%), radial-gradient(circle at 75% 75%, ${accent2}2e, transparent 55%)` }}>
          {gallery[0]?.image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${t.bgBase}aa, ${t.bgBase}dd)` }} />
            </>
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 820 }}>
          <div className="evt-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            🎉 Hacemos de tu fiesta un éxito
          </div>
          <h1 className="evt-rise evt-d1" style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.02em', lineHeight: 0.98, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            <span className="evt-grad">{heroTitle || 'Tu evento, otro nivel'}</span>
          </h1>
          <p className="evt-rise evt-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            {heroSubtitle || 'DJ, sonido, iluminación y pantallas para casamientos, cumpleaños y eventos corporativos.'}
          </p>
          <div className="evt-rise evt-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={wa(`Hola ${siteName}, quería cotizar un evento.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="evt-btn evt-btn-primary">Cotizar mi evento</a>
            <a href="#servicios" className="evt-btn evt-btn-ghost">Ver servicios</a>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center', textTransform: 'uppercase' }}>Servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {serviceList.map((s, idx) => (
            <div key={s.id} className="evt-card" style={{ padding: '2rem 1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
              <div style={{ width: 56, height: 56, borderRadius: t.radiusMd, background: `${accent}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1rem' }}>{SERVICE_ICONS[idx % SERVICE_ICONS.length]}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55 }}>{s.description}</p>}
              {s.price != null && <div style={{ ...headingFont, fontSize: '1.2rem', color: accent, marginTop: '0.85rem' }}>${s.price.toLocaleString('es-AR')}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={{ padding: '0 clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>Nuestros eventos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {(gallery.length > 0 ? gallery : Array.from({ length: 6 }, (_, i) => ({ id: `ph${i}`, image_url: null, title: '' } as Item))).map((g, idx) => (
            <div key={g.id} style={{ aspectRatio: idx % 4 === 0 ? '3/4' : '1', borderRadius: t.radiusMd, overflow: 'hidden', background: g.image_url ? undefined : `linear-gradient(135deg, ${accent}1f, ${accent2}1f)`, border: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {g.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : <span style={{ fontSize: '2rem', opacity: 0.5 }}>🎶</span>}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center', textTransform: 'uppercase' }}>Lo que dicen</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonialList.map((r) => (
              <div key={r.id} style={{ padding: '2rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>{stars(r.meta)}</div>
                {r.description && <p style={{ fontSize: '1rem', color: t.textPrimary, lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>“{r.description}”</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: accentGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{r.title.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: t.textPrimary, fontSize: '0.95rem' }}>{r.title}</div>
                    {r.subtitle && <div style={{ fontSize: '0.8rem', color: t.textMuted }}>{r.subtitle}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1rem', textTransform: 'uppercase' }}>¿Tenés un evento?</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Contanos la fecha y el tipo de evento, y te armamos una propuesta a tu medida.'}
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
          {address && <span>📍 {address}</span>}
          {openingHours && <span>🕒 {openingHours}</span>}
          {phone && <span>📞 {phone}</span>}
        </div>
        <a href={wa(`Hola ${siteName}, quería cotizar un evento.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="evt-btn evt-btn-primary">Cotizar por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary, textTransform: 'uppercase' }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
