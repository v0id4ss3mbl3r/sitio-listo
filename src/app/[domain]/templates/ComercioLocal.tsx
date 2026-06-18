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

const FEATURE_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const DEFAULT_FEATURES = [
  { id: 'd1', title: 'Producto destacado', description: 'Lo más pedido de la semana.', price: 9999, image_url: null },
  { id: 'd2', title: 'Servicio express', description: 'Resolvemos en el día.', price: null, image_url: null },
  { id: 'd3', title: 'Combo del mes', description: 'La mejor relación precio-calidad.', price: 14999, image_url: null },
];

export default function ComercioLocal({
  siteName = 'Mi Comercio',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
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

  const contactUrl = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#info');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cl-nav-link { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .cl-nav-link:hover { color: ${t.textPrimary}; }
        @keyframes cl-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .cl-fade { animation: cl-fade 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .cl-d1 { animation-delay: 0.1s; } .cl-d2 { animation-delay: 0.2s; } .cl-d3 { animation-delay: 0.3s; }
        .cl-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; border-radius: ${t.radiusLg}; overflow: hidden; }
        .cl-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; border-color: ${t.borderHover} !important; }
        .cl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .cl-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .cl-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .cl-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .cl-btn-ghost:hover { background: ${accent}14; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', background: `${t.bgBase}E6`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, letterSpacing: '-0.02em', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
          <a href="#destacados" className="cl-nav-link">Destacados</a>
          <a href="#info" className="cl-nav-link">Dónde estamos</a>
          <a href={contactUrl(`Hola ${siteName}! Quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="cl-btn cl-btn-primary" style={{ padding: '10px 22px', fontSize: '0.78rem' }}>Contactar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 7rem)', paddingBottom: '6rem', paddingLeft: '3rem', paddingRight: '3rem', maxWidth: 1100, margin: '0 auto' }}>
        <div className="cl-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} /> {siteName}
        </div>
        <h1 className="cl-fade cl-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 7vw, 4.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.5rem', maxWidth: 800 }}>
          {heroTitle || 'Tu comercio de confianza en el barrio'}
        </h1>
        <p className="cl-fade cl-d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, marginBottom: '2.5rem' }}>
          {heroSubtitle || 'Atención personalizada, los mejores productos y la mejor onda. Pasá a vernos o escribinos.'}
        </p>
        <div className="cl-fade cl-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#destacados" className="cl-btn cl-btn-ghost">Ver destacados</a>
          <a href={contactUrl(`Hola ${siteName}! Quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="cl-btn cl-btn-primary">Escribinos</a>
        </div>
      </section>

      {/* DESTACADOS */}
      <section id="destacados" style={{ padding: '5rem 3rem', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', color: t.textPrimary }}>Destacados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {featureList.map((f, idx) => (
              <div key={('id' in f ? (f as Item).id : idx)} className="cl-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                <div style={{ aspectRatio: '16/10', background: f.image_url ? undefined : FEATURE_GRADIENTS[idx % FEATURE_GRADIENTS.length], position: 'relative' }}>
                  {f.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.image_url} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{f.title}</h3>
                  {f.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1rem' }}>{f.description}</p>}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    {f.price != null && <span style={{ ...headingFont, fontSize: '1.4rem', color: accent }}>${f.price.toLocaleString('es-AR')}</span>}
                    <a href={contactUrl(`Hola ${siteName}! Me interesa "${f.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="cl-btn cl-btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', marginLeft: 'auto' }}>Consultar</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO */}
      <section id="info" style={{ padding: '6rem 3rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.5rem', color: t.textPrimary }}>Dónde estamos</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Estamos para ayudarte. Pasá por el local o escribinos por WhatsApp.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Dirección" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <div style={{ padding: '2rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.75rem' }}>Escribinos por WhatsApp</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Te respondemos al toque y coordinamos lo que necesites.</p>
            <a href={contactUrl(`Hola ${siteName}! Quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="cl-btn cl-btn-primary" style={{ width: '100%' }}>Abrir WhatsApp</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem 3rem', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
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
