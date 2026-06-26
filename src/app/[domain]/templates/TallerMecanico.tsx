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
  { id: 's1', kind: 'service', title: 'Service completo', subtitle: null, description: 'Cambio de aceite, filtros y revisión general.', price: 45000, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Frenos', subtitle: null, description: 'Pastillas, discos y purgado.', price: 38000, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Tren delantero', subtitle: null, description: 'Alineación, balanceo y suspensión.', price: 30000, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Diagnóstico con scanner', subtitle: null, description: 'Lectura de fallas y chequeo electrónico.', price: 12000, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_FEATURES: Item[] = [
  { id: 'fe1', kind: 'feature', title: 'Garantía escrita', subtitle: null, description: 'Todos nuestros trabajos con garantía.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'fe2', kind: 'feature', title: 'Repuestos originales', subtitle: null, description: 'Trabajamos con primeras marcas.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 'fe3', kind: 'feature', title: 'Presupuesto sin cargo', subtitle: null, description: 'Te cotizamos antes de tocar nada.', price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Hacen presupuesto sin cargo?', subtitle: null, description: 'Sí. Revisamos tu vehículo y te pasamos el presupuesto antes de empezar.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Necesito turno?', subtitle: null, description: 'Para trabajos programados conviene coordinar por WhatsApp. Diagnósticos rápidos se atienden en el día.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function TallerMecanico({
  siteName = 'Mi Taller',
  primaryColor = '#f97316',
  secondaryColor = '#facc15',
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
        .tal-link { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .tal-link:hover { color: ${accent}; }
        @keyframes tal-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .tal-rise { animation: tal-rise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .tal-d1 { animation-delay: 0.1s; } .tal-d2 { animation-delay: 0.2s; } .tal-d3 { animation-delay: 0.3s; }
        .tal-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusSm}; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .tal-btn-primary { background: ${accentGradient}; color: #1a1a1a; box-shadow: ${btnShadow}; }
        .tal-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .tal-btn-ghost { background: transparent; border: 1.5px solid ${accent}66; color: ${t.textPrimary}; }
        .tal-btn-ghost:hover { background: ${accent}1a; }
        .tal-srv { transition: border-color 0.25s ease, transform 0.25s ease; }
        .tal-srv:hover { border-color: ${accent}66 !important; transform: translateY(-3px); }
        .tal-stripe { background: repeating-linear-gradient(-45deg, ${accent}, ${accent} 14px, transparent 14px, transparent 28px); }
        .tal-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusSm}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .tal-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 800; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .tal-faq summary::-webkit-details-marker { display: none; }
        .tal-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; }
        .tal-faq[open] summary::after { content: '−'; }
        .tal-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.02em', textTransform: 'uppercase', color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🔧</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#servicios" className="tal-link">Servicios</a>
          <a href="#porque" className="tal-link">Por qué</a>
          <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tal-btn tal-btn-primary" style={{ padding: '9px 20px', fontSize: '0.7rem' }}>Presupuesto</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', paddingTop: 'calc(70px + 5rem)', paddingBottom: '5rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: `radial-gradient(circle at 80% 30%, ${accent}1a, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 680 }}>
          <div className="tal-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 4, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            🔧 Mecánica de confianza
          </div>
          <h1 className="tal-rise tal-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 8vw, 5.2rem)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '1.4rem', textTransform: 'uppercase' }}>
            {heroTitle || 'Tu auto en manos expertas'}
          </h1>
          <p className="tal-rise tal-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 500, marginBottom: '2.5rem' }}>
            {heroSubtitle || 'Diagnóstico honesto, trabajo garantizado y presupuesto sin sorpresas. Resolvemos lo que tu vehículo necesita.'}
          </p>
          <div className="tal-rise tal-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tal-btn tal-btn-primary">Pedir presupuesto</a>
            <a href="#servicios" className="tal-btn tal-btn-ghost">Ver servicios</a>
          </div>
        </div>
      </section>

      <div className="tal-stripe" style={{ height: 10, opacity: 0.5 }} />

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Servicios</h2>
        <p style={{ color: t.textSecondary, marginBottom: '2.5rem' }}>Precios orientativos. El presupuesto final se confirma tras el diagnóstico.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
          {serviceList.map((s) => (
            <div key={s.id} className="tal-srv" style={{ padding: '1.75rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1.25rem' }}>{s.description}</p>}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                {s.price != null ? <span style={{ ...headingFont, fontSize: '1.5rem', color: accent }}>${s.price.toLocaleString('es-AR')}</span> : <span style={{ color: t.textMuted, fontSize: '0.85rem' }}>A confirmar</span>}
                <a href={wa(`Hola ${siteName}, quería un presupuesto de "${s.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tal-btn tal-btn-ghost" style={{ padding: '8px 16px', fontSize: '0.66rem' }}>Consultar</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POR QUE */}
      <section id="porque" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textTransform: 'uppercase', textAlign: 'center' }}>Por qué elegirnos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {featureList.map((f) => (
              <div key={f.id} style={{ padding: '2rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: t.radiusSm, background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>✓</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{f.title}</h3>
                {f.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55 }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="tal-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated, textAlign: 'center' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1rem', textTransform: 'uppercase' }}>Acercate al taller</h2>
          <p style={{ fontSize: '1.02rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 540, marginInline: 'auto' }}>
            {aboutText || 'Coordiná tu visita o pedí un presupuesto por WhatsApp. Te atendemos a la brevedad.'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="tal-btn tal-btn-primary">Pedir presupuesto por WhatsApp</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary, textTransform: 'uppercase' }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
