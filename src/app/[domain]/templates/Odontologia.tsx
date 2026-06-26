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
  { id: 's1', kind: 'service', title: 'Limpieza y prevención', subtitle: null, description: 'Higiene profesional y control de caries.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Ortodoncia', subtitle: null, description: 'Brackets y alineadores invisibles.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Implantes', subtitle: null, description: 'Recuperá tu sonrisa de forma definitiva.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Blanqueamiento', subtitle: null, description: 'Resultados visibles en una sesión.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Dra. Ramírez', subtitle: 'Ortodoncista', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Dr. Sosa', subtitle: 'Implantología', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
];

const DEFAULT_TESTIMONIALS: Item[] = [
  { id: 'r1', kind: 'testimonial', title: 'Marina L.', subtitle: 'Ortodoncia', description: 'Excelente atención, me encantó el resultado. Súper recomendable.', price: null, image_url: null, meta: { rating: '5' }, sort_order: 0 },
  { id: 'r2', kind: 'testimonial', title: 'Diego R.', subtitle: 'Implantes', description: 'Profesionales de primera y muy buen trato. Volvería sin dudar.', price: null, image_url: null, meta: { rating: '5' }, sort_order: 1 },
];

function stars(meta: Record<string, unknown>): string {
  const n = Math.max(1, Math.min(5, Number(meta?.rating) || 5));
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

export default function Odontologia({
  siteName = 'Mi Consultorio Dental',
  primaryColor = '#0ea5e9',
  secondaryColor = '#22d3ee',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText,
  phone = '',
  address = '',
  openingHours = '',
  theme = getTheme('vivo'),
  items = [],
}: TemplateProps) {
  const t = theme.tokens;
  const isDark = theme.mode === 'dark';
  const isGlow = t.surface === 'glow';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const accentGradient = t.useGradients ? `linear-gradient(135deg, ${accent}, ${accent2})` : accent;
  const pageBg = isGlow ? `linear-gradient(160deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
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
  const testimonials = items.filter((i) => i.kind === 'testimonial');
  const testimonialList = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .odo-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .odo-link:hover { color: ${accent}; }
        @keyframes odo-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .odo-rise { animation: odo-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .odo-d1 { animation-delay: 0.1s; } .odo-d2 { animation-delay: 0.2s; } .odo-d3 { animation-delay: 0.3s; }
        .odo-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: 999px; font-weight: 800; font-size: 0.88rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .odo-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .odo-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .odo-btn-ghost { background: ${t.bgCard}; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .odo-btn-ghost:hover { background: ${accent}10; }
        .odo-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .odo-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🦷</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#tratamientos" className="odo-link">Tratamientos</a>
          <a href="#opiniones" className="odo-link">Opiniones</a>
          <a href={wa(`Hola ${siteName}! Quería pedir un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="odo-btn odo-btn-primary" style={{ padding: '9px 22px', fontSize: '0.78rem' }}>Turno</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="odo-rise" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😁</div>
        <div className="odo-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Odontología integral
        </div>
        <h1 className="odo-rise odo-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: '1.4rem' }}>
          {heroTitle || 'Sonreí con confianza'}
        </h1>
        <p className="odo-rise odo-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Cuidamos tu salud bucal con tecnología y un trato humano. Tu sonrisa en buenas manos.'}
        </p>
        <div className="odo-rise odo-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={wa(`Hola ${siteName}! Quería pedir un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="odo-btn odo-btn-primary">Pedir turno</a>
          <a href="#tratamientos" className="odo-btn odo-btn-ghost">Ver tratamientos</a>
        </div>
      </section>

      {/* TRATAMIENTOS */}
      <section id="tratamientos" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Tratamientos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {serviceList.map((s, idx) => (
            <div key={s.id} className="odo-card" style={{ position: 'relative', padding: '2rem 1.75rem', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', ...headingFont, fontSize: '2.5rem', color: `${accent}26`, lineHeight: 1 }}>{String(idx + 1).padStart(2, '0')}</div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>🦷</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{s.description}</p>}
              {s.price != null && <div style={{ ...headingFont, fontSize: '1.2rem', color: accent, marginTop: '0.85rem' }}>${s.price.toLocaleString('es-AR')}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* OPINIONES */}
      <section id="opiniones" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Lo que dicen nuestros pacientes</h2>
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

      {/* EQUIPO */}
      <section style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestro equipo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
          {teamList.map((p) => (
            <div key={p.id} style={{ textAlign: 'center' }}>
              <div style={{ aspectRatio: '1', borderRadius: t.radiusXl, overflow: 'hidden', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}26, ${accent2}26)`, border: `1px solid ${t.borderSubtle}`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: '3rem' }}>👩‍⚕️</span>}
              </div>
              <h3 style={{ ...headingFont, fontSize: '1.15rem', color: t.textPrimary }}>{p.title}</h3>
              {p.subtitle && <p style={{ fontSize: '0.85rem', color: accent, fontWeight: 700 }}>{p.subtitle}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusXl, background: accentGradient, color: '#fff', textAlign: 'center', boxShadow: btnShadow }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Reservá tu turno hoy</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, margin: '0 auto 2rem', opacity: 0.95 }}>
            {aboutText || 'Te esperamos para cuidar tu sonrisa. Coordinamos el horario que mejor te quede.'}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', fontSize: '0.92rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}! Quería pedir un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="odo-btn" style={{ background: '#fff', color: accent }}>Pedir turno por WhatsApp</a>
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
