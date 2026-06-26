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
  { id: 's1', kind: 'service', title: 'Inglés general', subtitle: null, description: 'Todos los niveles, grupos reducidos.', price: 22000, image_url: null, meta: { duration: 'Cuatrimestral' }, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Programación web', subtitle: null, description: 'Desde cero hasta tu primer proyecto.', price: 35000, image_url: null, meta: { duration: '4 meses' }, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Diseño gráfico', subtitle: null, description: 'Herramientas y portfolio profesional.', price: 30000, image_url: null, meta: { duration: '3 meses' }, sort_order: 2 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Prof. Acosta', subtitle: 'Idiomas', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Prof. Díaz', subtitle: 'Tecnología', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 't3', kind: 'team', title: 'Prof. Romero', subtitle: 'Diseño', description: null, price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Las clases son presenciales u online?', subtitle: null, description: 'Ofrecemos ambas modalidades. Elegís la que mejor se adapte a vos.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Entregan certificado?', subtitle: null, description: 'Sí, al finalizar cada curso recibís un certificado de aprobación.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

const STATS = [
  { value: '+1.500', label: 'Alumnos' },
  { value: '+25', label: 'Cursos' },
  { value: '15', label: 'Años enseñando' },
];

export default function Academia({
  siteName = 'Mi Academia',
  primaryColor = '#7c3aed',
  secondaryColor = '#ec4899',
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
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .aca-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .aca-link:hover { color: ${accent}; }
        @keyframes aca-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .aca-rise { animation: aca-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .aca-d1 { animation-delay: 0.1s; } .aca-d2 { animation-delay: 0.2s; } .aca-d3 { animation-delay: 0.3s; }
        .aca-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 800; font-size: 0.86rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .aca-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .aca-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .aca-btn-ghost { background: ${t.bgCard}; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .aca-btn-ghost:hover { background: ${accent}10; }
        .aca-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .aca-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; }
        .aca-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .aca-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .aca-faq summary::-webkit-details-marker { display: none; }
        .aca-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; }
        .aca-faq[open] summary::after { content: '−'; }
        .aca-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🎓</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#cursos" className="aca-link">Cursos</a>
          <a href="#profes" className="aca-link">Profesores</a>
          <a href={wa(`Hola ${siteName}, quería información sobre los cursos.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="aca-btn aca-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Inscribirme</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '3rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="aca-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          🎓 Formación con propósito
        </div>
        <h1 className="aca-rise aca-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: '1.4rem' }}>
          {heroTitle || 'Aprendé algo que te cambie la vida'}
        </h1>
        <p className="aca-rise aca-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Cursos prácticos dictados por profesionales. Modalidad presencial y online, a tu ritmo.'}
        </p>
        <div className="aca-rise aca-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#cursos" className="aca-btn aca-btn-primary">Ver cursos</a>
          <a href={wa(`Hola ${siteName}, quería información sobre los cursos.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="aca-btn aca-btn-ghost">Hablar con asesor</a>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 clamp(1.25rem,4vw,3rem) 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.75rem', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ ...headingFont, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: accent }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: t.textMuted, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestros cursos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {serviceList.map((s) => (
            <div key={s.id} className="aca-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusXl, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '16/9', background: s.image_url ? undefined : `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image_url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: '2.5rem' }}>📚</span>}
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {typeof s.meta?.duration === 'string' && s.meta.duration && (
                  <span style={{ display: 'inline-block', width: 'fit-content', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, background: `${accent}12`, padding: '3px 10px', borderRadius: 999, marginBottom: '0.6rem' }}>{s.meta.duration}</span>
                )}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1.25rem' }}>{s.description}</p>}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {s.price != null && <span style={{ ...headingFont, fontSize: '1.3rem', color: accent }}>${s.price.toLocaleString('es-AR')}</span>}
                  <a href={wa(`Hola ${siteName}, quería inscribirme en "${s.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="aca-btn aca-btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', marginLeft: 'auto' }}>Inscribirme</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROFES */}
      <section id="profes" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestros profesores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
            {teamList.map((p) => (
              <div key={p.id} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}26, ${accent2}26)`, border: `1px solid ${t.borderSubtle}`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 150, marginInline: 'auto' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '2.5rem' }}>👩‍🏫</span>}
                </div>
                <h3 style={{ ...headingFont, fontSize: '1.1rem', color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <p style={{ fontSize: '0.82rem', color: accent, fontWeight: 700 }}>{p.subtitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="aca-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusXl, background: accentGradient, color: '#fff', textAlign: 'center', boxShadow: btnShadow }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Empezá hoy mismo</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, margin: '0 auto 2rem', opacity: 0.95 }}>
            {aboutText || 'Sumate a nuestra comunidad de aprendizaje. Inscripciones abiertas todo el año.'}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', fontSize: '0.92rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}, quería información sobre los cursos.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="aca-btn" style={{ background: '#fff', color: accent }}>Inscribirme por WhatsApp</a>
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
