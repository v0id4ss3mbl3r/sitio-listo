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

const DEFAULT_PLANS = [
  { id: 'd1', title: 'Mensual', price: 18000, meta: { period: '/mes', features: ['Acceso libre', 'Sala de musculación', 'Clases grupales'] }, description: null },
  { id: 'd2', title: 'Trimestral', price: 45000, meta: { period: '/3 meses', features: ['Todo lo del mensual', '1 sesión con coach', '15% off'] }, description: null },
  { id: 'd3', title: 'Anual', price: 150000, meta: { period: '/año', features: ['Acceso total', 'Plan personalizado', 'Nutrición incluida'] }, description: null },
];

const DEFAULT_SCHEDULE = [
  { id: 's1', title: 'Funcional', meta: { day: 'Lun / Mié / Vie', time: '08:00', instructor: 'Caro' } },
  { id: 's2', title: 'Spinning', meta: { day: 'Mar / Jue', time: '19:00', instructor: 'Diego' } },
  { id: 's3', title: 'Cross Training', meta: { day: 'Lun a Vie', time: '20:00', instructor: 'Sol' } },
  { id: 's4', title: 'Yoga', meta: { day: 'Sáb', time: '10:00', instructor: 'Vale' } },
];

function asFeatures(v: unknown): string[] {
  return Array.isArray(v) ? (v as unknown[]).map(String) : [];
}
function metaStr(meta: Record<string, unknown>, key: string): string {
  const v = meta?.[key];
  return typeof v === 'string' ? v : '';
}

export default function GimnasioFitness({
  siteName = 'Gimnasio',
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

  const plans = items.filter((i) => i.kind === 'plan');
  const schedule = items.filter((i) => i.kind === 'schedule');
  const planList = plans.length > 0 ? plans : DEFAULT_PLANS;
  const scheduleList = schedule.length > 0 ? schedule : DEFAULT_SCHEDULE;

  const joinUrl = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#planes');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .gf-nav-link { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .gf-nav-link:hover { color: ${t.textPrimary}; }
        @keyframes gf-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .gf-fade { animation: gf-fade 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .gf-d1 { animation-delay: 0.1s; } .gf-d2 { animation-delay: 0.2s; } .gf-d3 { animation-delay: 0.3s; }
        .gf-plan { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; border-radius: ${t.radiusLg}; }
        .gf-plan:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; border-color: ${t.borderHover} !important; }
        .gf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .gf-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .gf-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .gf-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .gf-btn-ghost:hover { background: ${accent}14; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', background: `${t.bgBase}E6`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, letterSpacing: '-0.02em', textTransform: 'uppercase', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
          <a href="#planes" className="gf-nav-link">Planes</a>
          <a href="#clases" className="gf-nav-link">Clases</a>
          <a href="#sobre" className="gf-nav-link">Nosotros</a>
          <a href={joinUrl(`Hola ${siteName}! Quiero asociarme.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="gf-btn gf-btn-primary" style={{ padding: '10px 22px', fontSize: '0.78rem' }}>Inscribirme</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 7rem)', paddingBottom: '6rem', paddingLeft: '3rem', paddingRight: '3rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="gf-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} /> Entrená con nosotros
        </div>
        <h1 className="gf-fade gf-d1" style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.04em', lineHeight: 1.02, marginBottom: '1.5rem', maxWidth: 900, textTransform: 'uppercase' }}>
          {heroTitle || 'Tu mejor versión empieza hoy'}
        </h1>
        <p className="gf-fade gf-d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, marginBottom: '2.5rem' }}>
          {heroSubtitle || 'Planes flexibles, clases todos los días y coaches que te acompañan. Sumate.'}
        </p>
        <div className="gf-fade gf-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#planes" className="gf-btn gf-btn-ghost">Ver planes</a>
          <a href={joinUrl(`Hola ${siteName}! Quiero asociarme.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="gf-btn gf-btn-primary">Inscribirme</a>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: '5rem 3rem', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', color: t.textPrimary }}>Planes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {planList.map((p, idx) => {
              const featured = idx === 1 && planList.length >= 3;
              const features = asFeatures((p.meta as { features?: unknown })?.features);
              const period = metaStr(p.meta as Record<string, unknown>, 'period');
              return (
                <div key={('id' in p ? (p as Item).id : idx)} className="gf-plan" style={{ padding: '2rem', background: featured ? accentGradient : cardBg, color: featured ? '#fff' : t.textPrimary, border: `1px solid ${featured ? 'transparent' : t.borderSubtle}`, boxShadow: featured ? btnShadow : (isDark ? 'none' : t.shadowCard), display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.25rem' }}>
                    {p.price != null && <span style={{ ...headingFont, fontSize: '2.4rem', letterSpacing: '-0.03em', color: featured ? '#fff' : accent }}>${p.price.toLocaleString('es-AR')}</span>}
                    {period && <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{period}</span>}
                  </div>
                  {features.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
                      {features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem', opacity: featured ? 0.95 : 1, color: featured ? '#fff' : t.textSecondary }}>
                          <span style={{ fontWeight: 900, color: featured ? '#fff' : accent }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <a href={joinUrl(`Hola ${siteName}! Quiero el plan "${p.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="gf-btn" style={{ marginTop: 'auto', background: featured ? '#fff' : accentGradient, color: featured ? accent : '#fff' }}>Empezar</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLASES */}
      <section id="clases" style={{ padding: '6rem 3rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', color: t.textPrimary }}>Grilla de clases</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {scheduleList.map((c, idx) => {
            const m = c.meta as Record<string, unknown>;
            return (
              <div key={('id' in c ? (c as Item).id : idx)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1.1rem 1.5rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ ...headingFont, fontSize: '1.05rem', color: accent }}>{metaStr(m, 'time') || '—'}</span>
                  <strong style={{ fontSize: '1rem', color: t.textPrimary }}>{c.title}</strong>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: t.textMuted, fontWeight: 600 }}>
                  {metaStr(m, 'day') && <span>{metaStr(m, 'day')}</span>}
                  {metaStr(m, 'instructor') && <span>👤 {metaStr(m, 'instructor')}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ padding: '6rem 3rem', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.5rem', color: t.textPrimary }}>Sobre el gimnasio</h2>
          <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '2rem' }}>
            {aboutText || 'Más de 400 m² equipados, vestuarios, y un equipo de profes para acompañarte en cada objetivo.'}
          </p>
          <a href={joinUrl(`Hola ${siteName}! Quiero asociarme.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="gf-btn gf-btn-primary">Sumate ahora</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem 3rem', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, textTransform: 'uppercase', color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
