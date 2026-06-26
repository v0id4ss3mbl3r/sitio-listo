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

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'Masaje descontracturante', subtitle: null, description: 'Libera tensiones y relaja la musculatura.', price: 12000, image_url: null, meta: { duration: '60 min' }, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Masaje con piedras calientes', subtitle: null, description: 'Calor profundo y relajación total.', price: 15000, image_url: null, meta: { duration: '75 min' }, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Tratamiento facial', subtitle: null, description: 'Limpieza e hidratación profunda.', price: 11000, image_url: null, meta: { duration: '50 min' }, sort_order: 2 },
];

const DEFAULT_PLANS: Item[] = [
  { id: 'p1', kind: 'plan', title: 'Día de spa', subtitle: null, description: 'Una jornada completa de relax.', price: 38000, image_url: null, meta: { period: '', features: ['Masaje 60 min', 'Facial', 'Acceso a sauna', 'Té e infusiones'] }, sort_order: 0 },
  { id: 'p2', kind: 'plan', title: 'Escapada en pareja', subtitle: null, description: 'Para compartir y desconectar.', price: 62000, image_url: null, meta: { period: '', features: ['Masaje doble', 'Hidromasaje', 'Copa de bienvenida'] }, sort_order: 1 },
];

export default function Spa({
  siteName = 'Mi Spa',
  primaryColor = '#5C7060',
  secondaryColor = '#B8956A',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText,
  phone = '',
  address = '',
  openingHours = '',
  theme = getTheme('oficina'),
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

  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const plans = items.filter((i) => i.kind === 'plan');
  const planList = plans.length > 0 ? plans : DEFAULT_PLANS;
  const gallery = items.filter((i) => i.kind === 'gallery');

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#reservar');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .spa-link { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .spa-link:hover { color: ${accent}; }
        @keyframes spa-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .spa-rise { animation: spa-rise 1s cubic-bezier(0.16,1,0.3,1) both; }
        .spa-d1 { animation-delay: 0.12s; } .spa-d2 { animation-delay: 0.24s; } .spa-d3 { animation-delay: 0.36s; }
        .spa-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.3s ease; }
        .spa-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .spa-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .spa-btn-ghost { background: transparent; border: 1.5px solid #ffffff88; color: #fff; }
        .spa-btn-ghost:hover { background: #ffffff1a; }
        .spa-srv { border-bottom: 1px solid ${t.borderSubtle}; transition: background 0.25s ease; }
        .spa-srv:hover { background: ${accent}08; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.02em', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#servicios" className="spa-link">Servicios</a>
          <a href="#paquetes" className="spa-link">Paquetes</a>
          <a href={wa(`Hola ${siteName}! Quería reservar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="spa-btn spa-btn-primary" style={{ padding: '9px 22px', fontSize: '0.7rem' }}>Reservar</a>
        </nav>
      </header>

      {/* HERO full-bleed */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {gallery[0]?.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${accent}66, ${accent}aa)` }} />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${accent} 0%, ${accent2} 100%)` }} />
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 760, color: '#fff' }}>
          <div className="spa-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: '1px solid #ffffff66', background: '#ffffff1f', color: '#fff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            🌿 Bienestar &amp; relax
          </div>
          <h1 className="spa-rise spa-d1" style={{ ...headingFont, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.02em', lineHeight: 1.04, marginBottom: '1.5rem' }}>
            {heroTitle || 'Un oasis para tus sentidos'}
          </h1>
          <p className="spa-rise spa-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 2.5rem', opacity: 0.95 }}>
            {heroSubtitle || 'Date un respiro. Masajes, tratamientos y rituales pensados para tu equilibrio.'}
          </p>
          <div className="spa-rise spa-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#servicios" className="spa-btn spa-btn-primary">Ver servicios</a>
            <a href={wa(`Hola ${siteName}! Quería reservar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="spa-btn spa-btn-ghost">Reservar</a>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Nuestros servicios</h2>
        <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '3rem' }}>Cada tratamiento, una experiencia.</p>
        <div>
          {serviceList.map((s) => (
            <div key={s.id} className="spa-srv" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 0.5rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ ...headingFont, fontSize: '1.3rem', color: t.textPrimary, marginBottom: '0.3rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.5 }}>{s.description}</p>}
              </div>
              {typeof s.meta?.duration === 'string' && s.meta.duration && <span style={{ fontSize: '0.82rem', color: t.textMuted, fontWeight: 600, flexShrink: 0 }}>{s.meta.duration}</span>}
              {s.price != null && <span style={{ ...headingFont, fontSize: '1.4rem', color: accent, flexShrink: 0, minWidth: 90, textAlign: 'right' }}>${s.price.toLocaleString('es-AR')}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* PAQUETES */}
      <section id="paquetes" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Paquetes y experiencias</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {planList.map((p) => {
              const features = Array.isArray(p.meta?.features) ? (p.meta.features as string[]) : [];
              return (
                <div key={p.id} style={{ padding: '2.25rem', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ ...headingFont, fontSize: '1.5rem', color: t.textPrimary, marginBottom: '0.4rem' }}>{p.title}</h3>
                  {p.description && <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1.25rem' }}>{p.description}</p>}
                  {p.price != null && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{ ...headingFont, fontSize: '2rem', color: accent }}>${p.price.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.92rem', color: t.textSecondary }}>
                        <span style={{ color: accent, flexShrink: 0 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href={wa(`Hola ${siteName}! Me interesa el paquete "${p.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="spa-btn spa-btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Reservar</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 1 && (
        <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>El espacio</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.slice(1).map((g) => (
              <div key={g.id} style={{ aspectRatio: '3/4', borderRadius: t.radiusLg, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RESERVAR */}
      <section id="reservar" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1rem' }}>Regalate un momento</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 540, marginInline: 'auto' }}>
          {aboutText || 'Reservá tu turno y dejanos cuidarte. Te esperamos para una experiencia única.'}
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
          {address && <span>📍 {address}</span>}
          {openingHours && <span>🕒 {openingHours}</span>}
          {phone && <span>📞 {phone}</span>}
        </div>
        <a href={wa(`Hola ${siteName}! Quería reservar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="spa-btn spa-btn-primary">Reservar por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
