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
  { id: 's1', kind: 'service', title: 'Liquidación de impuestos', subtitle: null, description: 'IVA, Ganancias, Ingresos Brutos y más.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Sueldos y cargas sociales', subtitle: null, description: 'Liquidación de haberes y F931.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Constitución de sociedades', subtitle: null, description: 'SAS, SRL y trámites en AFIP/IGJ.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Balances y estados contables', subtitle: null, description: 'Confección y presentación en término.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_PLANS: Item[] = [
  { id: 'p1', kind: 'plan', title: 'Monotributo', subtitle: null, description: 'Ideal para independientes.', price: 18000, image_url: null, meta: { period: '/mes', features: ['Recategorización', 'Facturación', 'Asesoramiento', 'Atención por WhatsApp'] }, sort_order: 0 },
  { id: 'p2', kind: 'plan', title: 'Responsable Inscripto', subtitle: null, description: 'Para comercios y profesionales.', price: 45000, image_url: null, meta: { period: '/mes', features: ['Liquidación de IVA', 'Ganancias', 'Libros digitales', 'Soporte prioritario'] }, sort_order: 1 },
  { id: 'p3', kind: 'plan', title: 'Empresas', subtitle: null, description: 'Pymes con personal a cargo.', price: null, image_url: null, meta: { period: '', features: ['Sueldos', 'Balances', 'Planificación fiscal', 'Reuniones mensuales'] }, sort_order: 2 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Atienden de forma remota?', subtitle: null, description: 'Sí. Operamos 100% online con firma digital y atención por WhatsApp y videollamada.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Puedo cambiar de contador fácilmente?', subtitle: null, description: 'Sí, gestionamos el traspaso por vos sin que tengas que ocuparte de nada.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function EstudioContable({
  siteName = 'Estudio Contable',
  primaryColor = '#0d9488',
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
  const faqs = items.filter((i) => i.kind === 'faq');
  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQ;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .con-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .con-link:hover { color: ${accent}; }
        @keyframes con-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .con-rise { animation: con-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .con-d1 { animation-delay: 0.1s; } .con-d2 { animation-delay: 0.2s; } .con-d3 { animation-delay: 0.3s; }
        .con-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.88rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .con-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .con-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .con-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .con-btn-ghost:hover { background: ${accent}12; }
        .con-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .con-card:hover { transform: translateY(-4px); box-shadow: ${btnShadow}; border-color: ${accent}55 !important; }
        .con-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .con-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .con-faq summary::-webkit-details-marker { display: none; }
        .con-faq summary::after { content: '+'; color: ${accent}; font-size: 1.3rem; font-weight: 400; }
        .con-faq[open] summary::after { content: '−'; }
        .con-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent }}>▣</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#servicios" className="con-link">Servicios</a>
          <a href="#planes" className="con-link">Planes</a>
          <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="con-btn con-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Presupuesto</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 6rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="con-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          ▣ Asesoramiento contable e impositivo
        </div>
        <h1 className="con-rise con-d1" style={{ ...headingFont, fontSize: 'clamp(2.5rem, 6.5vw, 4.6rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.4rem' }}>
          {heroTitle || 'Tu contabilidad, en orden y al día'}
        </h1>
        <p className="con-rise con-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Nos ocupamos de tus impuestos y obligaciones para que vos te dediques a tu negocio.'}
        </p>
        <div className="con-rise con-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="con-btn con-btn-primary">Pedir presupuesto</a>
          <a href="#planes" className="con-btn con-btn-ghost">Ver planes</a>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {serviceList.map((s) => (
            <div key={s.id} className="con-card" style={{ padding: '1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
              <div style={{ width: 46, height: 46, borderRadius: t.radiusSm, background: `${accent}14`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>▣</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6 }}>{s.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Planes mensuales</h2>
          <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '2.5rem' }}>Elegí el que se ajusta a tu actividad. Sin sorpresas.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {planList.map((p, idx) => {
              const features = Array.isArray(p.meta?.features) ? (p.meta.features as string[]) : [];
              const period = typeof p.meta?.period === 'string' ? p.meta.period : '';
              const featured = idx === 1;
              return (
                <div key={p.id} style={{ position: 'relative', padding: '2.25rem', borderRadius: t.radiusXl, background: featured ? accentGradient : cardBg, color: featured ? '#fff' : t.textPrimary, border: `1px solid ${featured ? 'transparent' : t.borderSubtle}`, boxShadow: featured ? btnShadow : (isDark ? 'none' : t.shadowCard), display: 'flex', flexDirection: 'column' }}>
                  {featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: accent, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 999 }}>Más elegido</div>}
                  <h3 style={{ ...headingFont, fontSize: '1.4rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  {p.price != null ? (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ ...headingFont, fontSize: '2.2rem' }}>${p.price.toLocaleString('es-AR')}</span>
                      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{period}</span>
                    </div>
                  ) : (
                    <div style={{ ...headingFont, fontSize: '1.6rem', marginBottom: '0.5rem' }}>A medida</div>
                  )}
                  {p.description && <p style={{ fontSize: '0.9rem', opacity: featured ? 0.92 : 0.8, lineHeight: 1.5, marginBottom: '1.25rem', color: featured ? '#fff' : t.textSecondary }}>{p.description}</p>}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.9rem', color: featured ? '#fff' : t.textSecondary }}>
                        <span style={{ color: featured ? '#fff' : accent, flexShrink: 0 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href={wa(`Hola ${siteName}, me interesa el plan "${p.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="con-btn" style={{ width: '100%', marginTop: 'auto', background: featured ? '#fff' : accentGradient, color: featured ? accent : '#fff', boxShadow: featured ? 'none' : btnShadow }}>
                    {p.price != null ? 'Contratar' : 'Pedir presupuesto'}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        {faqList.map((f) => (
          <details key={f.id} className="con-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated, textAlign: 'center' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>Hablemos de tu negocio</h2>
          <p style={{ fontSize: '1.02rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 540, marginInline: 'auto' }}>
            {aboutText || 'Contanos tu actividad y te armamos una propuesta a medida sin compromiso.'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}, quería pedir un presupuesto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="con-btn con-btn-primary">Pedir presupuesto por WhatsApp</a>
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
