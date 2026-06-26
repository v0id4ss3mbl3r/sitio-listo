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

const DEFAULT_PROPERTIES: Item[] = [
  { id: 'pr1', kind: 'property', title: 'Departamento 2 ambientes', subtitle: null, description: 'Luminoso, con balcón y cochera.', price: 95000, image_url: null, meta: { operation: 'Venta', location: 'Centro', bedrooms: '2 amb', area: '55 m²' }, sort_order: 0 },
  { id: 'pr2', kind: 'property', title: 'Casa con jardín', subtitle: null, description: 'Tres dormitorios y patio amplio.', price: 280000, image_url: null, meta: { operation: 'Venta', location: 'Barrio Norte', bedrooms: '3 dorm', area: '120 m²' }, sort_order: 1 },
  { id: 'pr3', kind: 'property', title: 'Monoambiente a estrenar', subtitle: null, description: 'Ideal inversión o estudiante.', price: 320000, image_url: null, meta: { operation: 'Alquiler', location: 'Universidad', bedrooms: '1 amb', area: '32 m²' }, sort_order: 2 },
];

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'Tasaciones', subtitle: null, description: 'Conocé el valor real de tu propiedad sin cargo.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Gestión de alquileres', subtitle: null, description: 'Administramos tu propiedad de principio a fin.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Asesoramiento legal', subtitle: null, description: 'Escrituras y trámites con respaldo profesional.', price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿La tasación tiene costo?', subtitle: null, description: 'No. Realizamos la tasación de tu propiedad de forma gratuita y sin compromiso.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Qué documentación necesito para vender?', subtitle: null, description: 'Te asesoramos en todo el proceso y te indicamos la documentación según tu caso.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

function metaStr(meta: Record<string, unknown>, key: string): string {
  return typeof meta?.[key] === 'string' ? (meta[key] as string) : '';
}

export default function Inmobiliaria({
  siteName = 'Mi Inmobiliaria',
  primaryColor = '#0f766e',
  secondaryColor = '#b8956a',
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

  const properties = items.filter((i) => i.kind === 'property');
  const propertyList = properties.length > 0 ? properties : DEFAULT_PROPERTIES;
  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .inm-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .inm-link:hover { color: ${accent}; }
        @keyframes inm-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .inm-rise { animation: inm-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .inm-d1 { animation-delay: 0.1s; } .inm-d2 { animation-delay: 0.2s; } .inm-d3 { animation-delay: 0.3s; }
        .inm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.86rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .inm-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .inm-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .inm-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .inm-btn-ghost:hover { background: ${accent}10; }
        .inm-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .inm-card:hover { transform: translateY(-5px); box-shadow: ${btnShadow}; }
        .inm-card img { transition: transform 0.5s ease; }
        .inm-card:hover img { transform: scale(1.05); }
        .inm-faq { border-bottom: 1px solid ${t.borderSubtle}; }
        .inm-faq summary { cursor: pointer; padding: 1.2rem 0; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .inm-faq summary::-webkit-details-marker { display: none; }
        .inm-faq summary::after { content: '+'; color: ${accent}; font-size: 1.4rem; font-weight: 300; }
        .inm-faq[open] summary::after { content: '−'; }
        .inm-faq p { padding: 0 0 1.25rem; color: ${t.textSecondary}; line-height: 1.7; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🏠</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#propiedades" className="inm-link">Propiedades</a>
          <a href="#servicios" className="inm-link">Servicios</a>
          <a href={wa(`Hola ${siteName}, quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="inm-btn inm-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div className="inm-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          🏡 Tu próxima propiedad, acá
        </div>
        <h1 className="inm-rise inm-d1" style={{ ...headingFont, fontSize: 'clamp(2.5rem, 6.5vw, 4.6rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.4rem' }}>
          {heroTitle || 'Encontrá el lugar para tu próxima historia'}
        </h1>
        <p className="inm-rise inm-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 580, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Compra, venta y alquiler con asesoramiento honesto. Te acompañamos en cada paso.'}
        </p>
        <div className="inm-rise inm-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#propiedades" className="inm-btn inm-btn-primary">Ver propiedades</a>
          <a href={wa(`Hola ${siteName}, quería tasar mi propiedad.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="inm-btn inm-btn-ghost">Tasar mi propiedad</a>
        </div>
      </section>

      {/* PROPIEDADES */}
      <section id="propiedades" style={{ padding: '3rem clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Propiedades destacadas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {propertyList.map((p) => {
            const op = metaStr(p.meta, 'operation');
            const loc = metaStr(p.meta, 'location');
            const beds = metaStr(p.meta, 'bedrooms');
            const area = metaStr(p.meta, 'area');
            return (
              <div key={p.id} className="inm-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusLg, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}1f, ${accent2}1f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '3rem' }}>🏠</span>}
                  {op && <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: accent, color: '#fff', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999 }}>{op}</span>}
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.3rem' }}>{p.title}</h3>
                  {loc && <div style={{ fontSize: '0.85rem', color: t.textMuted, marginBottom: '0.85rem' }}>📍 {loc}</div>}
                  {p.price != null && <div style={{ ...headingFont, fontSize: '1.6rem', color: accent, marginBottom: '0.85rem' }}>${p.price.toLocaleString('es-AR')}</div>}
                  {(beds || area) && (
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: t.textSecondary, fontWeight: 600, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      {beds && <span>🛏 {beds}</span>}
                      {area && <span>📐 {area}</span>}
                    </div>
                  )}
                  <a href={wa(`Hola ${siteName}, me interesa "${p.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="inm-btn inm-btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Consultar</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Cómo te ayudamos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {serviceList.map((s) => (
              <div key={s.id} style={{ padding: '2rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
                <div style={{ width: 50, height: 50, borderRadius: t.radiusMd, background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>🔑</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1.5rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="inm-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>¿Comprás, vendés o alquilás?</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Contanos qué buscás y te acompañamos para encontrarlo. Asesoramiento sin compromiso.'}
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
          {address && <span>📍 {address}</span>}
          {openingHours && <span>🕒 {openingHours}</span>}
          {phone && <span>📞 {phone}</span>}
        </div>
        <a href={wa(`Hola ${siteName}, quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="inm-btn inm-btn-primary">Escribir por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
