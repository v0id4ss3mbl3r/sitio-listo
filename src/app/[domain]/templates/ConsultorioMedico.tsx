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
  { id: 's1', kind: 'service', title: 'Clínica médica', subtitle: null, description: 'Controles generales y seguimiento integral.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Cardiología', subtitle: null, description: 'Estudios y control de factores de riesgo.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Laboratorio', subtitle: null, description: 'Análisis clínicos con resultados rápidos.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Chequeo preventivo', subtitle: null, description: 'Plan anual de prevención personalizado.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Dra. González', subtitle: 'Clínica médica', description: 'Más de 15 años de experiencia.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Dr. Pérez', subtitle: 'Cardiología', description: 'Especialista en prevención.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Atienden con obra social?', subtitle: null, description: 'Trabajamos con las principales obras sociales y prepagas. Consultanos por la tuya.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Cómo saco un turno?', subtitle: null, description: 'Escribinos por WhatsApp y coordinamos día y horario según disponibilidad.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function ConsultorioMedico({
  siteName = 'Mi Consultorio',
  primaryColor = '#2563eb',
  secondaryColor = '#0891b2',
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
        .med-link { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.03em; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .med-link:hover { color: ${accent}; }
        @keyframes med-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .med-rise { animation: med-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .med-d1 { animation-delay: 0.1s; } .med-d2 { animation-delay: 0.2s; } .med-d3 { animation-delay: 0.3s; }
        .med-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.88rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .med-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .med-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .med-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .med-btn-ghost:hover { background: ${accent}10; }
        .med-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .med-card:hover { transform: translateY(-4px); box-shadow: ${btnShadow}; border-color: ${accent}55 !important; }
        .med-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .med-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .med-faq summary::-webkit-details-marker { display: none; }
        .med-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; font-weight: 400; }
        .med-faq[open] summary::after { content: '−'; }
        .med-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent }}>✚</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#especialidades" className="med-link">Especialidades</a>
          <a href="#equipo" className="med-link">Equipo</a>
          <a href={wa(`Hola ${siteName}! Quería solicitar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="med-btn med-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Turnos</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="med-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            ✚ Salud y bienestar
          </div>
          <h1 className="med-rise med-d1" style={{ ...headingFont, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', letterSpacing: '-0.03em', lineHeight: 1.06, marginBottom: '1.4rem' }}>
            {heroTitle || 'Tu salud en las mejores manos'}
          </h1>
          <p className="med-rise med-d2" style={{ fontSize: 'clamp(1.02rem, 2vw, 1.2rem)', color: t.textSecondary, lineHeight: 1.65, maxWidth: 480, marginBottom: '2.25rem' }}>
            {heroSubtitle || 'Atención cercana y profesional. Especialistas, estudios y seguimiento personalizado para vos y tu familia.'}
          </p>
          <div className="med-rise med-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a href={wa(`Hola ${siteName}! Quería solicitar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="med-btn med-btn-primary">Pedir turno</a>
            <a href="#especialidades" className="med-btn med-btn-ghost">Ver especialidades</a>
          </div>
        </div>
        <div className="med-rise med-d2" style={{ padding: '2.25rem', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated }}>
          <h3 style={{ ...headingFont, fontSize: '1.3rem', color: t.textPrimary, marginBottom: '1.25rem' }}>Solicitá tu turno</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {address && <InfoRow icon="📍" label="Dónde" value={address} t={t} />}
            {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
            {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
          </div>
          <a href={wa(`Hola ${siteName}! Quería solicitar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="med-btn med-btn-primary" style={{ width: '100%' }}>Coordinar por WhatsApp</a>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Especialidades</h2>
          <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '2.5rem' }}>Atención integral con un equipo de profesionales.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {serviceList.map((s) => (
              <div key={s.id} className="med-card" style={{ padding: '1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
                <div style={{ width: 46, height: 46, borderRadius: t.radiusMd, background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>✚</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{s.description}</p>}
                {s.price != null && <div style={{ ...headingFont, fontSize: '1.2rem', color: accent, marginTop: '0.85rem' }}>${s.price.toLocaleString('es-AR')}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestro equipo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {teamList.map((p) => (
            <div key={p.id} className="med-card" style={{ padding: '1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: p.image_url ? undefined : accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem' }}>
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '👨‍⚕️'}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <div style={{ fontSize: '0.82rem', color: accent, fontWeight: 700 }}>{p.subtitle}</div>}
                {p.description && <p style={{ fontSize: '0.85rem', color: t.textSecondary, lineHeight: 1.5, marginTop: '0.35rem' }}>{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
          {faqList.map((f) => (
            <details key={f.id} className="med-faq">
              <summary>{f.title}</summary>
              {f.description && <p>{f.description}</p>}
            </details>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>Estamos para ayudarte</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Coordiná tu consulta de forma rápida y simple. Te respondemos a la brevedad.'}
        </p>
        <a href={wa(`Hola ${siteName}! Quería solicitar un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="med-btn med-btn-primary">Solicitar turno por WhatsApp</a>
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
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted }}>{label}</div>
        <div style={{ fontSize: '0.95rem', color: t.textPrimary, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
