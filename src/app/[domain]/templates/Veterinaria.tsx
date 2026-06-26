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

const SERVICE_ICONS = ['🐾', '💉', '🩺', '✂️', '🦴', '🏥'];

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'Consultas', subtitle: null, description: 'Atención clínica general para tu mascota.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Vacunación', subtitle: null, description: 'Plan sanitario completo y desparasitación.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Cirugías', subtitle: null, description: 'Quirófano equipado y monitoreo.', price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 's4', kind: 'service', title: 'Peluquería', subtitle: null, description: 'Baño, corte y estética para perros y gatos.', price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Dra. Luna', subtitle: 'Clínica de pequeños animales', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Dr. Bruno', subtitle: 'Cirugía', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
];

const DEFAULT_FAQ: Item[] = [
  { id: 'f1', kind: 'faq', title: '¿Atienden urgencias?', subtitle: null, description: 'Sí. Escribinos por WhatsApp y te indicamos cómo proceder según el caso.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'f2', kind: 'faq', title: '¿Necesito turno previo?', subtitle: null, description: 'Para consultas y peluquería sí. Las urgencias se atienden por orden de llegada.', price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function Veterinaria({
  siteName = 'Mi Veterinaria',
  primaryColor = '#16a34a',
  secondaryColor = '#f59e0b',
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
        .vet-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .vet-link:hover { color: ${accent}; }
        @keyframes vet-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .vet-rise { animation: vet-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .vet-d1 { animation-delay: 0.1s; } .vet-d2 { animation-delay: 0.2s; } .vet-d3 { animation-delay: 0.3s; }
        .vet-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: 999px; font-weight: 800; font-size: 0.88rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .vet-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .vet-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .vet-btn-ghost { background: ${t.bgCard}; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .vet-btn-ghost:hover { background: ${accent}10; }
        .vet-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .vet-card:hover { transform: translateY(-5px); box-shadow: ${btnShadow}; }
        .vet-faq { border: 1px solid ${t.borderSubtle}; border-radius: ${t.radiusMd}; background: ${cardBg}; margin-bottom: 0.75rem; overflow: hidden; }
        .vet-faq summary { cursor: pointer; padding: 1.1rem 1.4rem; font-weight: 700; color: ${t.textPrimary}; list-style: none; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
        .vet-faq summary::-webkit-details-marker { display: none; }
        .vet-faq summary::after { content: '🐾'; }
        .vet-faq p { padding: 0 1.4rem 1.2rem; color: ${t.textSecondary}; line-height: 1.65; margin: 0; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🐾</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#servicios" className="vet-link">Servicios</a>
          <a href="#equipo" className="vet-link">Equipo</a>
          <a href={wa(`Hola ${siteName}! Quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="vet-btn vet-btn-primary" style={{ padding: '9px 22px', fontSize: '0.78rem' }}>Turnos</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="vet-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            🐶 Cuidamos a quien más querés
          </div>
          <h1 className="vet-rise vet-d1" style={{ ...headingFont, fontSize: 'clamp(2.5rem, 6.5vw, 4.6rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.4rem' }}>
            {heroTitle || 'Salud y amor para tu mascota'}
          </h1>
          <p className="vet-rise vet-d2" style={{ fontSize: 'clamp(1.02rem, 2vw, 1.2rem)', color: t.textSecondary, lineHeight: 1.65, maxWidth: 480, marginBottom: '2.25rem' }}>
            {heroSubtitle || 'Atención veterinaria integral con un equipo que ama a los animales tanto como vos.'}
          </p>
          <div className="vet-rise vet-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a href={wa(`Hola ${siteName}! Quería pedir un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="vet-btn vet-btn-primary">Pedir turno</a>
            <a href="#servicios" className="vet-btn vet-btn-ghost">Ver servicios</a>
          </div>
        </div>
        <div className="vet-rise vet-d2" style={{ aspectRatio: '4/3', borderRadius: t.radiusXl, overflow: 'hidden', background: `linear-gradient(135deg, ${accent}22, ${accent2}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${t.borderSubtle}` }}>
          <span style={{ fontSize: '6rem' }}>🐕‍🦺</span>
        </div>
      </section>

      {/* URGENCIAS */}
      <div style={{ padding: '1.1rem clamp(1.25rem,4vw,3rem)', background: `${accent2}1a`, borderTop: `1px solid ${accent2}33`, borderBottom: `1px solid ${accent2}33` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', textAlign: 'center' }}>
          <span style={{ fontWeight: 800, color: t.textPrimary }}>🚨 ¿Es una urgencia?</span>
          <span style={{ color: t.textSecondary, fontSize: '0.92rem' }}>Escribinos ahora y te ayudamos lo antes posible.</span>
          <a href={wa(`Hola ${siteName}! Tengo una URGENCIA con mi mascota.`)} target={phone ? '_blank' : undefined} rel="noreferrer" style={{ fontWeight: 800, color: accent, textDecoration: 'none' }}>Contactar →</a>
        </div>
      </div>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {serviceList.map((s, idx) => (
            <div key={s.id} className="vet-card" style={{ padding: '2rem 1.75rem', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', margin: '0 auto 1rem' }}>{SERVICE_ICONS[idx % SERVICE_ICONS.length]}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
              {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55 }}>{s.description}</p>}
              {s.price != null && <div style={{ ...headingFont, fontSize: '1.2rem', color: accent, marginTop: '0.85rem' }}>${s.price.toLocaleString('es-AR')}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
          <details key={f.id} className="vet-faq">
            <summary>{f.title}</summary>
            {f.description && <p>{f.description}</p>}
          </details>
        ))}
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: t.radiusXl, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated, textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🐾</div>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>Pedí tu turno</h2>
          <p style={{ fontSize: '1.02rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 540, marginInline: 'auto' }}>
            {aboutText || 'Estamos para cuidar a tu compañero. Coordiná tu visita por WhatsApp.'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}! Quería pedir un turno.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="vet-btn vet-btn-primary">Pedir turno por WhatsApp</a>
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
