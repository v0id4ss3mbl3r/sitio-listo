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

const DEFAULT_ROOMS: Item[] = [
  { id: 'r1', kind: 'property', title: 'Cabaña del bosque', subtitle: null, description: 'Con hogar a leña y vista a la montaña.', price: 85000, image_url: null, meta: { bedrooms: '4 personas', area: 'Vista al bosque' }, sort_order: 0 },
  { id: 'r2', kind: 'property', title: 'Suite con jacuzzi', subtitle: null, description: 'Ideal para escapadas en pareja.', price: 120000, image_url: null, meta: { bedrooms: '2 personas', area: 'Jacuzzi privado' }, sort_order: 1 },
  { id: 'r3', kind: 'property', title: 'Cabaña familiar', subtitle: null, description: 'Amplia, con parrilla y juegos.', price: 110000, image_url: null, meta: { bedrooms: '6 personas', area: 'Parrilla propia' }, sort_order: 2 },
];

const DEFAULT_FEATURES: Item[] = [
  { id: 'fe1', kind: 'feature', title: 'Pileta climatizada', subtitle: null, description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'fe2', kind: 'feature', title: 'Wi-Fi en todo el predio', subtitle: null, description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 'fe3', kind: 'feature', title: 'Desayuno incluido', subtitle: null, description: null, price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 'fe4', kind: 'feature', title: 'Estacionamiento', subtitle: null, description: null, price: null, image_url: null, meta: {}, sort_order: 3 },
];

function metaStr(meta: Record<string, unknown>, key: string): string {
  return typeof meta?.[key] === 'string' ? (meta[key] as string) : '';
}

export default function HotelCabanas({
  siteName = 'Mi Hotel',
  primaryColor = '#5C7060',
  secondaryColor = '#B8956A',
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

  const rooms = items.filter((i) => i.kind === 'property');
  const roomList = rooms.length > 0 ? rooms : DEFAULT_ROOMS;
  const features = items.filter((i) => i.kind === 'feature');
  const featureList = features.length > 0 ? features : DEFAULT_FEATURES;
  const gallery = items.filter((i) => i.kind === 'gallery');

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#reservar');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hot-link { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .hot-link:hover { color: ${accent}; }
        @keyframes hot-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .hot-rise { animation: hot-rise 1s cubic-bezier(0.16,1,0.3,1) both; }
        .hot-d1 { animation-delay: 0.12s; } .hot-d2 { animation-delay: 0.24s; } .hot-d3 { animation-delay: 0.36s; }
        .hot-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 32px; border-radius: ${t.radiusMd}; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.3s ease; }
        .hot-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .hot-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .hot-btn-light { background: #fff; color: ${accent}; }
        .hot-btn-ghost { background: transparent; border: 1.5px solid #ffffff88; color: #fff; }
        .hot-btn-ghost:hover { background: #ffffff1a; }
        .hot-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .hot-card:hover { transform: translateY(-5px); box-shadow: ${btnShadow}; }
        .hot-card img { transition: transform 0.5s ease; }
        .hot-card:hover img { transform: scale(1.05); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.02em', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#habitaciones" className="hot-link">Habitaciones</a>
          <a href="#servicios" className="hot-link">Servicios</a>
          <a href={wa(`Hola ${siteName}, quería consultar disponibilidad.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="hot-btn hot-btn-primary" style={{ padding: '9px 22px', fontSize: '0.7rem' }}>Reservar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {gallery[0]?.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.55))' }} />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${accent} 0%, ${accent2} 100%)` }} />
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 780, color: '#fff' }}>
          <div className="hot-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: '1px solid #ffffff66', background: '#ffffff1f', color: '#fff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            🌄 Tu lugar de descanso
          </div>
          <h1 className="hot-rise hot-d1" style={{ ...headingFont, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.02em', lineHeight: 1.04, marginBottom: '1.5rem' }}>
            {heroTitle || 'Desconectá y disfrutá'}
          </h1>
          <p className="hot-rise hot-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem', opacity: 0.95 }}>
            {heroSubtitle || 'Un refugio entre la naturaleza, con todas las comodidades para tu escapada perfecta.'}
          </p>
          <div className="hot-rise hot-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#habitaciones" className="hot-btn hot-btn-light">Ver habitaciones</a>
            <a href={wa(`Hola ${siteName}, quería consultar disponibilidad.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="hot-btn hot-btn-ghost">Consultar disponibilidad</a>
          </div>
        </div>
      </section>

      {/* HABITACIONES */}
      <section id="habitaciones" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Habitaciones y cabañas</h2>
        <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '3rem' }}>Espacios pensados para tu confort.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {roomList.map((r) => {
            const cap = metaStr(r.meta, 'bedrooms');
            const extra = metaStr(r.meta, 'area');
            return (
              <div key={r.id} className="hot-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusLg, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                <div style={{ aspectRatio: '4/3', background: r.image_url ? undefined : `linear-gradient(135deg, ${accent}22, ${accent2}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {r.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '3rem' }}>🏡</span>}
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.3rem' }}>{r.title}</h3>
                  {r.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '0.85rem' }}>{r.description}</p>}
                  {(cap || extra) && (
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: t.textSecondary, fontWeight: 600, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      {cap && <span>👥 {cap}</span>}
                      {extra && <span>✨ {extra}</span>}
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    {r.price != null && (
                      <div>
                        <span style={{ ...headingFont, fontSize: '1.5rem', color: accent }}>${r.price.toLocaleString('es-AR')}</span>
                        <span style={{ fontSize: '0.8rem', color: t.textMuted }}> /noche</span>
                      </div>
                    )}
                    <a href={wa(`Hola ${siteName}, quería reservar "${r.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="hot-btn hot-btn-primary" style={{ padding: '9px 18px', fontSize: '0.68rem', marginLeft: 'auto' }}>Reservar</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICIOS / AMENITIES */}
      <section id="servicios" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Servicios incluidos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {featureList.map((f) => (
              <div key={f.id} style={{ padding: '1.75rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>✓</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: t.textPrimary }}>{f.title}</h3>
                {f.description && <p style={{ fontSize: '0.85rem', color: t.textSecondary, lineHeight: 1.5, marginTop: '0.35rem' }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 1 && (
        <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>El lugar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.slice(1).map((g) => (
              <div key={g.id} style={{ aspectRatio: '4/3', borderRadius: t.radiusLg, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RESERVAR */}
      <section id="reservar" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1rem' }}>Reservá tu estadía</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Consultanos disponibilidad para tus fechas y armamos tu escapada ideal.'}
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
          {address && <span>📍 {address}</span>}
          {openingHours && <span>🕒 {openingHours}</span>}
          {phone && <span>📞 {phone}</span>}
        </div>
        <a href={wa(`Hola ${siteName}, quería consultar disponibilidad.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="hot-btn hot-btn-primary">Consultar por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
