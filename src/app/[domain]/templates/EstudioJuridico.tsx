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
  { id: 's1', kind: 'service', title: 'Derecho de familia', subtitle: null, description: 'Divorcios, alimentos, sucesiones y régimen de comunicación.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Derecho laboral', subtitle: null, description: 'Despidos, accidentes y reclamos por relación de trabajo.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Daños y perjuicios', subtitle: null, description: 'Accidentes de tránsito y mala praxis.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Derecho comercial', subtitle: null, description: 'Contratos, sociedades y cobro de deudas.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Dra. Martínez', subtitle: 'Socia · Familia', description: 'Más de 20 años de ejercicio profesional.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Dr. Herrera', subtitle: 'Socio · Laboral', description: 'Especialista en litigios complejos.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿La primera consulta tiene costo?', subtitle: null, description: 'La consulta inicial es sin cargo y totalmente confidencial. Escribinos para coordinarla.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Atienden casos de otras provincias?', subtitle: null, description: 'Sí, trabajamos de forma remota y presencial según el caso. Consultanos tu situación.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

const STATS = [
  { value: '+20', label: 'Años de trayectoria' },
  { value: '+800', label: 'Casos resueltos' },
  { value: '100%', label: 'Confidencialidad' },
];

export default function EstudioJuridico({
  siteName = 'Estudio Jurídico',
  primaryColor = '#1e3a5f',
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

  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const team = items.filter((i) => i.kind === 'team');
  const teamList = team.length > 0 ? team : DEFAULT_TEAM;
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .jur-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .jur-link:hover { color: ${accent}; }
        @keyframes jur-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .jur-rise { animation: jur-rise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .jur-d1 { animation-delay: 0.1s; } .jur-d2 { animation-delay: 0.2s; } .jur-d3 { animation-delay: 0.3s; }
        .jur-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 30px; border-radius: ${t.radiusSm}; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .jur-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .jur-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .jur-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .jur-btn-ghost:hover { background: ${accent}0d; }
        .jur-area { transition: border-color 0.25s ease, transform 0.25s ease; }
        .jur-area:hover { border-color: ${accent}66 !important; transform: translateY(-3px); }
        .jur-faq { border-bottom: 1px solid ${t.borderSubtle}; }
        .jur-faq summary { cursor: pointer; padding: 1.25rem 0; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; font-size: 1.05rem; }
        .jur-faq summary::-webkit-details-marker { display: none; }
        .jur-faq summary::after { content: '+'; color: ${accent}; font-size: 1.4rem; font-weight: 300; }
        .jur-faq[open] summary::after { content: '−'; }
        .jur-faq p { padding: 0 0 1.25rem; color: ${t.textSecondary}; line-height: 1.7; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '-0.01em', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#areas" className="jur-link">Áreas</a>
          <a href="#equipo" className="jur-link">Equipo</a>
          <a href={wa(`Hola ${siteName}, quería solicitar una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="jur-btn jur-btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }}>Consulta</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 6rem)', paddingBottom: '5rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="jur-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 4, border: `1px solid ${accent}40`, background: `${accent}0d`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            ⚖ Asesoramiento legal
          </div>
          <h1 className="jur-rise jur-d1" style={{ ...headingFont, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '1.4rem' }}>
            {heroTitle || 'Defendemos tus derechos con compromiso'}
          </h1>
          <p className="jur-rise jur-d2" style={{ fontSize: 'clamp(1.02rem, 2vw, 1.2rem)', color: t.textSecondary, lineHeight: 1.7, maxWidth: 480, marginBottom: '2.25rem' }}>
            {heroSubtitle || 'Atención personalizada y estrategia jurídica clara. Tu tranquilidad es nuestra prioridad.'}
          </p>
          <div className="jur-rise jur-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a href={wa(`Hola ${siteName}, quería solicitar una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="jur-btn jur-btn-primary">Consulta confidencial</a>
            <a href="#areas" className="jur-btn jur-btn-ghost">Áreas de práctica</a>
          </div>
        </div>
        <div className="jur-rise jur-d2" style={{ padding: '2.5rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ ...headingFont, fontSize: '1.8rem', color: accent }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: t.textMuted, fontWeight: 600, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
            {address && <InfoRow icon="📍" label="Oficina" value={address} t={t} />}
            {openingHours && <InfoRow icon="🕒" label="Atención" value={openingHours} t={t} />}
            {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
          </div>
          <a href={wa(`Hola ${siteName}, quería solicitar una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="jur-btn jur-btn-primary" style={{ width: '100%' }}>Solicitar consulta</a>
        </div>
      </section>

      {/* AREAS */}
      <section id="areas" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Áreas de práctica</h2>
          <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '2.5rem' }}>Asesoramiento integral en las principales ramas del derecho.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {serviceList.map((s, idx) => (
              <div key={s.id} className="jur-area" style={{ padding: '1.75rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
                <div style={{ ...headingFont, fontSize: '0.9rem', color: accent, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>{String(idx + 1).padStart(2, '0')}</div>
                <h3 style={{ ...headingFont, fontSize: '1.25rem', color: t.textPrimary, marginBottom: '0.5rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>El estudio</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {teamList.map((p) => (
            <div key={p.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.75rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
              <div style={{ width: 72, height: 72, borderRadius: t.radiusSm, flexShrink: 0, overflow: 'hidden', background: p.image_url ? undefined : accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem' }}>
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '⚖'}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ ...headingFont, fontSize: '1.2rem', color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <div style={{ fontSize: '0.8rem', color: accent, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{p.subtitle}</div>}
                {p.description && <p style={{ fontSize: '0.88rem', color: t.textSecondary, lineHeight: 1.55 }}>{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1.5rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
          {faqList.map((f) => (
            <details key={f.id} className="jur-faq">
              <summary>{f.title}</summary>
              {f.description && <p>{f.description}</p>}
            </details>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1rem' }}>Consultá tu caso</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Contanos tu situación. La primera consulta es confidencial y sin compromiso.'}
        </p>
        <a href={wa(`Hola ${siteName}, quería solicitar una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="jur-btn jur-btn-primary">Solicitar consulta por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}

function InfoRow({ icon, label, value, t }: { icon: string; label: string; value: string; t: Theme['tokens'] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted }}>{label}</div>
        <div style={{ fontSize: '0.92rem', color: t.textPrimary, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
