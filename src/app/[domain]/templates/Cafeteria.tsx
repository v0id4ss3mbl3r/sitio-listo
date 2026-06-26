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

const DEFAULT_MENU: Item[] = [
  { id: 'm1', kind: 'menu', title: 'Espresso', subtitle: null, description: 'De origen, tostado de especialidad.', price: 1800, image_url: null, meta: { category: 'Cafés' }, sort_order: 0 },
  { id: 'm2', kind: 'menu', title: 'Flat White', subtitle: null, description: null, price: 2600, image_url: null, meta: { category: 'Cafés' }, sort_order: 1 },
  { id: 'm3', kind: 'menu', title: 'Cold Brew', subtitle: null, description: '12 horas de infusión en frío.', price: 2900, image_url: null, meta: { category: 'Cafés' }, sort_order: 2 },
  { id: 'm4', kind: 'menu', title: 'Medialunas (x3)', subtitle: null, description: 'De manteca, recién horneadas.', price: 2400, image_url: null, meta: { category: 'Para acompañar' }, sort_order: 3 },
  { id: 'm5', kind: 'menu', title: 'Tostado de campo', subtitle: null, description: 'Jamón natural y queso.', price: 4200, image_url: null, meta: { category: 'Para acompañar' }, sort_order: 4 },
  { id: 'm6', kind: 'menu', title: 'Cheesecake', subtitle: null, description: 'Con frutos rojos de estación.', price: 3800, image_url: null, meta: { category: 'Dulces' }, sort_order: 5 },
];

export default function Cafeteria({
  siteName = 'Mi Cafetería',
  primaryColor = '#8B6F3F',
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

  const menu = items.filter((i) => i.kind === 'menu');
  const menuList = menu.length > 0 ? menu : DEFAULT_MENU;
  const gallery = items.filter((i) => i.kind === 'gallery');

  // Agrupar la carta por sección (meta.category).
  const sections = new Map<string, Item[]>();
  menuList.forEach((m) => {
    const cat = (typeof m.meta?.category === 'string' && m.meta.category) || 'Carta';
    if (!sections.has(cat)) sections.set(cat, []);
    sections.get(cat)!.push(m);
  });

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#visitanos');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .caf-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .caf-link:hover { color: ${accent}; }
        @keyframes caf-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .caf-rise { animation: caf-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .caf-d1 { animation-delay: 0.08s; } .caf-d2 { animation-delay: 0.18s; } .caf-d3 { animation-delay: 0.28s; }
        .caf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: ${t.radiusMd}; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .caf-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .caf-btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .caf-btn-ghost { background: transparent; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .caf-btn-ghost:hover { background: ${accent}12; }
        .caf-row { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.95rem; }
        .caf-row .dots { flex: 1; border-bottom: 1.5px dotted ${t.borderHover}; transform: translateY(-4px); }
        .caf-gimg { transition: transform 0.5s ease; }
        .caf-gimg:hover { transform: scale(1.05); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '-0.01em', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#carta" className="caf-link">Carta</a>
          <a href="#visitanos" className="caf-link">Visitanos</a>
          <a href={wa(`Hola ${siteName}! Quería reservar una mesa.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="caf-btn caf-btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }}>Reservar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 6rem)', paddingBottom: '5rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="caf-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            ☕ Café de especialidad
          </div>
          <h1 className="caf-rise caf-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 6vw, 4.6rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.4rem' }}>
            {heroTitle || 'El mejor café, hecho con calma'}
          </h1>
          <p className="caf-rise caf-d2" style={{ fontSize: 'clamp(1.02rem, 2vw, 1.2rem)', color: t.textSecondary, lineHeight: 1.65, maxWidth: 480, marginBottom: '2.25rem' }}>
            {heroSubtitle || 'Un rincón para desconectar. Grano seleccionado, pastelería casera y la mejor compañía.'}
          </p>
          <div className="caf-rise caf-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a href="#carta" className="caf-btn caf-btn-primary">Ver la carta</a>
            <a href={wa(`Hola ${siteName}! Quería hacer una consulta.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="caf-btn caf-btn-ghost">Escribinos</a>
          </div>
        </div>
        <div className="caf-rise caf-d2" style={{ position: 'relative', aspectRatio: '4/5', borderRadius: t.radiusXl, overflow: 'hidden', background: gallery[0]?.image_url ? undefined : accentGradient, boxShadow: btnShadow, minHeight: 280 }}>
          {gallery[0]?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>☕</div>
          )}
        </div>
      </section>

      {/* CARTA */}
      <section id="carta" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary }}>Nuestra carta</h2>
            <p style={{ color: t.textSecondary, marginTop: '0.5rem' }}>Precios sujetos a temporada. Consultá opciones del día.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem 4rem' }}>
            {Array.from(sections.entries()).map(([cat, list]) => (
              <div key={cat}>
                <h3 style={{ ...headingFont, fontSize: '1.5rem', color: accent, marginBottom: '1.5rem', paddingBottom: '0.6rem', borderBottom: `2px solid ${accent}30` }}>{cat}</h3>
                {list.map((m) => (
                  <div key={m.id}>
                    <div className="caf-row">
                      <span style={{ fontWeight: 700, color: t.textPrimary, fontSize: '1rem' }}>{m.title}</span>
                      <span className="dots" />
                      {m.price != null && <span style={{ ...headingFont, fontWeight: 700, color: t.textPrimary, fontSize: '1rem' }}>${m.price.toLocaleString('es-AR')}</span>}
                    </div>
                    {m.description && <p style={{ fontSize: '0.85rem', color: t.textMuted, marginTop: '-0.65rem', marginBottom: '1rem', lineHeight: 1.5 }}>{m.description}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 0 && (
        <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>El ambiente</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map((g) => (
              <div key={g.id} style={{ aspectRatio: '1', borderRadius: t.radiusLg, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} className="caf-gimg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VISITANOS */}
      <section id="visitanos" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: t.textPrimary }}>Pasá a vernos</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Te esperamos con el café recién hecho. Ideal para trabajar, leer o juntarte con amigos.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Dirección" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>☕</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Reservá tu mesa</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Escribinos por WhatsApp y te guardamos el mejor lugar.</p>
            <a href={wa(`Hola ${siteName}! Quería reservar una mesa.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="caf-btn caf-btn-primary" style={{ width: '100%' }}>Reservar por WhatsApp</a>
          </div>
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
