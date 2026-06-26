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

const DEFAULT_FEATURES: Item[] = [
  { id: 'fe1', kind: 'feature', title: 'Apoyo escolar', subtitle: null, description: 'Acompañamos a niños y niñas en su trayecto educativo.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'fe2', kind: 'feature', title: 'Comedor comunitario', subtitle: null, description: 'Brindamos viandas nutritivas todos los días.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 'fe3', kind: 'feature', title: 'Ropero solidario', subtitle: null, description: 'Recibimos y distribuimos donaciones de abrigo.', price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Ana', subtitle: 'Coordinadora', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Jorge', subtitle: 'Voluntario', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 't3', kind: 'team', title: 'Sofía', subtitle: 'Voluntaria', description: null, price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Cómo puedo donar?', subtitle: null, description: 'Podés colaborar con donaciones de dinero, alimentos o ropa. Escribinos y te contamos cómo.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Cómo me sumo como voluntario?', subtitle: null, description: 'Contanos en qué te gustaría ayudar y coordinamos una charla inicial. ¡Toda ayuda suma!', price: null, image_url: null, meta: {}, sort_order: 1 },
];

const STATS = [
  { value: '+2.000', label: 'Personas ayudadas' },
  { value: '+120', label: 'Voluntarios' },
  { value: '10', label: 'Años de trabajo' },
];

export default function OngFundacion({
  siteName = 'Mi Fundación',
  primaryColor = '#16a34a',
  secondaryColor = '#0ea5e9',
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

  const features = items.filter((i) => i.kind === 'feature');
  const featureList = features.length > 0 ? features : DEFAULT_FEATURES;
  const team = items.filter((i) => i.kind === 'team');
  const teamList = team.length > 0 ? team : DEFAULT_TEAM;
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#ayudar');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ong-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .ong-link:hover { color: ${accent}; }
        @keyframes ong-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .ong-rise { animation: ong-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .ong-d1 { animation-delay: 0.1s; } .ong-d2 { animation-delay: 0.2s; } .ong-d3 { animation-delay: 0.3s; }
        .ong-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: 999px; font-weight: 800; font-size: 0.86rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .ong-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .ong-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .ong-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .ong-btn-ghost:hover { background: ${accent}10; }
        .ong-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ong-card:hover { transform: translateY(-4px); box-shadow: ${btnShadow}; }
        .ong-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .ong-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .ong-faq summary::-webkit-details-marker { display: none; }
        .ong-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; }
        .ong-faq[open] summary::after { content: '−'; }
        .ong-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🤝</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#programas" className="ong-link">Programas</a>
          <a href="#equipo" className="ong-link">Equipo</a>
          <a href="#ayudar" className="ong-btn ong-btn-primary" style={{ padding: '9px 22px', fontSize: '0.78rem' }}>Quiero ayudar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '3rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div className="ong-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          🤝 Juntos podemos más
        </div>
        <h1 className="ong-rise ong-d1" style={{ ...headingFont, fontSize: 'clamp(2.5rem, 6.5vw, 4.6rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.4rem' }}>
          {heroTitle || 'Construimos un futuro mejor, juntos'}
        </h1>
        <p className="ong-rise ong-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 580, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Trabajamos cada día por quienes más lo necesitan. Tu ayuda transforma vidas.'}
        </p>
        <div className="ong-rise ong-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#ayudar" className="ong-btn ong-btn-primary">Quiero ayudar</a>
          <a href="#programas" className="ong-btn ong-btn-ghost">Conocé nuestra labor</a>
        </div>
      </section>

      {/* IMPACTO */}
      <section style={{ padding: '2rem clamp(1.25rem,4vw,3rem)', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '2rem', borderRadius: t.radiusXl, background: accentGradient, color: '#fff', boxShadow: btnShadow }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ ...headingFont, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMAS */}
      <section id="programas" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestros programas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {featureList.map((f) => (
            <div key={f.id} className="ong-card" style={{ borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '16/9', background: f.image_url ? undefined : `linear-gradient(135deg, ${accent}22, ${accent2}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {f.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image_url} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: '2.5rem' }}>💚</span>}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{f.title}</h3>
                {f.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{f.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Quienes lo hacen posible</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
            {teamList.map((p) => (
              <div key={p.id} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}26, ${accent2}26)`, border: `1px solid ${t.borderSubtle}`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 130, marginInline: 'auto' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '2.5rem' }}>🙋</span>}
                </div>
                <h3 style={{ ...headingFont, fontSize: '1.1rem', color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <p style={{ fontSize: '0.82rem', color: accent, fontWeight: 700 }}>{p.subtitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AYUDAR */}
      <section id="ayudar" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Cómo ayudar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💝</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Hacé una donación</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Tu aporte, grande o chico, hace la diferencia. Escribinos y te contamos cómo.</p>
            <a href={wa(`Hola ${siteName}, quería hacer una donación.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="ong-btn ong-btn-primary" style={{ width: '100%' }}>Quiero donar</a>
          </div>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🙌</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Sumate como voluntario</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Regalá tu tiempo y tus ganas. Hay un lugar para vos en nuestro equipo.</p>
            <a href={wa(`Hola ${siteName}, quería sumarme como voluntario.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="ong-btn ong-btn-ghost" style={{ width: '100%' }}>Quiero ser voluntario</a>
          </div>
        </div>
        {(address || openingHours || phone) && (
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2.5rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="ong-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
        {aboutText && <p style={{ textAlign: 'center', color: t.textMuted, marginTop: '2rem', lineHeight: 1.7 }}>{aboutText}</p>}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
