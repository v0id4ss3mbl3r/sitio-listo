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

const SERVICE_ICONS = ['📱', '💻', '🖥️', '⌚', '🎮', '🔋'];

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'Cambio de pantalla', subtitle: null, description: 'Celulares y tablets de todas las marcas.', price: 35000, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Cambio de batería', subtitle: null, description: 'Recuperá la autonomía de tu equipo.', price: 22000, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Formateo y limpieza', subtitle: null, description: 'PC y notebooks más rápidas.', price: 15000, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Recuperación de datos', subtitle: null, description: 'Fotos y archivos importantes.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_FEATURES: Item[] = [
  { id: 'fe1', kind: 'feature', title: 'Diagnóstico gratis', subtitle: null, description: 'Revisamos tu equipo sin cargo.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'fe2', kind: 'feature', title: 'Reparación express', subtitle: null, description: 'Muchos arreglos en el día.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 'fe3', kind: 'feature', title: 'Garantía de 90 días', subtitle: null, description: 'Sobre cada reparación.', price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Cuánto tarda una reparación?', subtitle: null, description: 'Depende del equipo, pero muchos arreglos se hacen en el día. Te damos un plazo al diagnosticar.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿El diagnóstico tiene costo?', subtitle: null, description: 'No. Revisamos tu equipo sin cargo y te pasamos el presupuesto antes de reparar.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function TecnologiaReparaciones({
  siteName = 'Mi Servicio Técnico',
  primaryColor = '#22d3ee',
  secondaryColor = '#6366f1',
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
  const features = items.filter((i) => i.kind === 'feature');
  const featureList = features.length > 0 ? features : DEFAULT_FEATURES;
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .tec-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .tec-link:hover { color: ${accent}; }
        @keyframes tec-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .tec-rise { animation: tec-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .tec-d1 { animation-delay: 0.1s; } .tec-d2 { animation-delay: 0.2s; } .tec-d3 { animation-delay: 0.3s; }
        .tec-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 800; font-size: 0.86rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .tec-btn-primary { background: ${accentGradient}; color: #0a0a0a; box-shadow: ${btnShadow}; }
        .tec-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .tec-btn-ghost { background: transparent; border: 1.5px solid ${accent}66; color: ${t.textPrimary}; }
        .tec-btn-ghost:hover { background: ${accent}1a; }
        .tec-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .tec-card:hover { transform: translateY(-5px); box-shadow: ${btnShadow}; border-color: ${accent}66 !important; }
        .tec-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .tec-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .tec-faq summary::-webkit-details-marker { display: none; }
        .tec-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; }
        .tec-faq[open] summary::after { content: '−'; }
        .tec-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🔧</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#servicios" className="tec-link">Servicios</a>
          <a href="#ventajas" className="tec-link">Ventajas</a>
          <a href={wa(`Hola ${siteName}, quería cotizar una reparación.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tec-btn tec-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Cotizar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5.5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="tec-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          ⚡ Reparaciones express
        </div>
        <h1 className="tec-rise tec-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: '1.4rem' }}>
          {heroTitle || 'Reparamos tu tecnología'}
        </h1>
        <p className="tec-rise tec-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Celulares, notebooks y consolas. Diagnóstico sin cargo, reparación rápida y con garantía.'}
        </p>
        <div className="tec-rise tec-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={wa(`Hola ${siteName}, quería cotizar una reparación.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tec-btn tec-btn-primary">Cotizar reparación</a>
          <a href="#servicios" className="tec-btn tec-btn-ghost">Ver servicios</a>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {serviceList.map((s, idx) => (
            <div key={s.id} className="tec-card" style={{ padding: '1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 50, height: 50, borderRadius: t.radiusMd, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>{SERVICE_ICONS[idx % SERVICE_ICONS.length]}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1.25rem' }}>{s.description}</p>}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {s.price != null ? <span style={{ ...headingFont, fontSize: '1.35rem', color: accent }}>${s.price.toLocaleString('es-AR')}</span> : <span style={{ color: t.textMuted, fontSize: '0.82rem' }}>Cotizar</span>}
                <a href={wa(`Hola ${siteName}, quería cotizar: ${s.title}.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tec-btn tec-btn-ghost" style={{ padding: '8px 16px', fontSize: '0.7rem' }}>Consultar</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENTAJAS */}
      <section id="ventajas" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Por qué elegirnos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {featureList.map((f) => (
              <div key={f.id} style={{ padding: '2rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>✓</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{f.title}</h3>
                {f.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55 }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="tec-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated, textAlign: 'center' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>¿Tu equipo necesita una mano?</h2>
          <p style={{ fontSize: '1.02rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 540, marginInline: 'auto' }}>
            {aboutText || 'Contanos qué le pasa a tu dispositivo y te ayudamos al toque por WhatsApp.'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}, quería cotizar una reparación.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tec-btn tec-btn-primary">Escribir por WhatsApp</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
