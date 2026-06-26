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
  { id: 's1', kind: 'service', title: 'Caribe all inclusive', subtitle: null, description: 'Playas paradisíacas con todo incluido.', price: 850000, image_url: null, meta: { duration: '7 noches' }, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Europa clásica', subtitle: null, description: 'Recorré las capitales más icónicas.', price: 1900000, image_url: null, meta: { duration: '12 días' }, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Sur argentino', subtitle: null, description: 'Bariloche y los lagos del sur.', price: 420000, image_url: null, meta: { duration: '5 noches' }, sort_order: 2 },
];

const DEFAULT_TESTIMONIALS: Item[] = [
  { id: 'r1', kind: 'testimonial', title: 'Familia Gómez', subtitle: 'Viaje al Caribe', description: 'Organizaron todo a la perfección. ¡Volveríamos a elegirlos!', price: null, image_url: null, meta: { rating: '5' }, sort_order: 0 },
  { id: 'r2', kind: 'testimonial', title: 'Lucía y Martín', subtitle: 'Luna de miel', description: 'Nos asesoraron increíble y conseguimos un precio genial.', price: null, image_url: null, meta: { rating: '5' }, sort_order: 1 },
];

function stars(meta: Record<string, unknown>): string {
  const n = Math.max(1, Math.min(5, Number(meta?.rating) || 5));
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

export default function AgenciaViajes({
  siteName = 'Mi Agencia de Viajes',
  primaryColor = '#0ea5e9',
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
  const gallery = items.filter((i) => i.kind === 'gallery');
  const testimonials = items.filter((i) => i.kind === 'testimonial');
  const testimonialList = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .via-link { font-size: 0.8rem; font-weight: 700; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .via-link:hover { color: ${accent}; }
        @keyframes via-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .via-rise { animation: via-rise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .via-d1 { animation-delay: 0.1s; } .via-d2 { animation-delay: 0.2s; } .via-d3 { animation-delay: 0.3s; }
        .via-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: 999px; font-weight: 800; font-size: 0.86rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .via-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .via-btn-primary:hover { filter: brightness(1.07); transform: translateY(-2px); }
        .via-btn-light { background: #fff; color: ${accent}; }
        .via-btn-ghost { background: transparent; border: 1.5px solid #ffffff88; color: #fff; }
        .via-btn-ghost:hover { background: #ffffff1a; }
        .via-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .via-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; }
        .via-card img { transition: transform 0.5s ease; }
        .via-card:hover img { transform: scale(1.06); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>✈️</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'center' }}>
          <a href="#paquetes" className="via-link">Paquetes</a>
          <a href="#opiniones" className="via-link">Opiniones</a>
          <a href={wa(`Hola ${siteName}, quería consultar por un viaje.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="via-btn via-btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>Consultar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {gallery[0]?.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.5))' }} />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${accent} 0%, ${accent2} 100%)` }} />
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 800, color: '#fff' }}>
          <div className="via-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: '1px solid #ffffff66', background: '#ffffff1f', color: '#fff', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            ✈️ Viví experiencias inolvidables
          </div>
          <h1 className="via-rise via-d1" style={{ ...headingFont, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.02em', lineHeight: 1.04, marginBottom: '1.5rem' }}>
            {heroTitle || 'Tu próximo viaje empieza acá'}
          </h1>
          <p className="via-rise via-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem', opacity: 0.95 }}>
            {heroSubtitle || 'Armamos el viaje de tus sueños a medida. Vuelos, hoteles y excursiones, sin complicaciones.'}
          </p>
          <div className="via-rise via-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#paquetes" className="via-btn via-btn-light">Ver paquetes</a>
            <a href={wa(`Hola ${siteName}, quería armar un viaje a medida.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="via-btn via-btn-ghost">Viaje a medida</a>
          </div>
        </div>
      </section>

      {/* PAQUETES */}
      <section id="paquetes" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>Destinos destacados</h2>
        <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '3rem' }}>Paquetes pensados para todos los gustos y presupuestos.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {serviceList.map((s) => (
            <div key={s.id} className="via-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusXl, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', background: s.image_url ? undefined : `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image_url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: '3rem' }}>🏝️</span>}
                {typeof s.meta?.duration === 'string' && s.meta.duration && <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ffffffe6', color: t.textPrimary, fontSize: '0.72rem', fontWeight: 800, padding: '5px 12px', borderRadius: 999 }}>{s.meta.duration}</span>}
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1.25rem' }}>{s.description}</p>}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {s.price != null && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: t.textMuted, fontWeight: 600 }}>desde</div>
                      <span style={{ ...headingFont, fontSize: '1.5rem', color: accent }}>${s.price.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <a href={wa(`Hola ${siteName}, me interesa el paquete "${s.title}".`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="via-btn via-btn-primary" style={{ padding: '9px 18px', fontSize: '0.72rem', marginLeft: 'auto' }}>Consultar</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 1 && (
        <section style={{ padding: '0 clamp(1.25rem,4vw,3rem) 4rem', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {gallery.slice(1).map((g) => (
              <div key={g.id} style={{ aspectRatio: '1', borderRadius: t.radiusLg, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OPINIONES */}
      <section id="opiniones" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Viajeros felices</h2>
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

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1rem' }}>¿A dónde querés ir?</h2>
        <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 560, marginInline: 'auto' }}>
          {aboutText || 'Contanos tu destino soñado y armamos una propuesta a tu medida sin compromiso.'}
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600 }}>
          {address && <span>📍 {address}</span>}
          {openingHours && <span>🕒 {openingHours}</span>}
          {phone && <span>📞 {phone}</span>}
        </div>
        <a href={wa(`Hola ${siteName}, quería consultar por un viaje.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="via-btn via-btn-primary">Consultar por WhatsApp</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary }}>{siteName}</span>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>© {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}</p>
      </footer>
    </div>
  );
}
