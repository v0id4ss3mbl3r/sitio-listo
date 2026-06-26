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
  { id: 'b1', kind: 'menu', title: 'IPA de la casa', subtitle: null, description: 'Lupulada, amarga, 6.2%. Pinta.', price: 3500, image_url: null, meta: { category: 'Cervezas' }, sort_order: 0 },
  { id: 'b2', kind: 'menu', title: 'Honey Amber', subtitle: null, description: 'Suave y dorada, con miel. Pinta.', price: 3200, image_url: null, meta: { category: 'Cervezas' }, sort_order: 1 },
  { id: 'b3', kind: 'menu', title: 'Negroni', subtitle: null, description: 'Gin, campari, vermouth rosso.', price: 5200, image_url: null, meta: { category: 'Tragos' }, sort_order: 2 },
  { id: 'b4', kind: 'menu', title: 'Gin Tonic premium', subtitle: null, description: 'Con botánicos y cítricos.', price: 4800, image_url: null, meta: { category: 'Tragos' }, sort_order: 3 },
  { id: 'b5', kind: 'menu', title: 'Tabla para compartir', subtitle: null, description: 'Fiambres, quesos y picadas.', price: 9800, image_url: null, meta: { category: 'Para picar' }, sort_order: 4 },
  { id: 'b6', kind: 'menu', title: 'Papas bravas', subtitle: null, description: 'Con alioli ahumado.', price: 4500, image_url: null, meta: { category: 'Para picar' }, sort_order: 5 },
];

export default function BarCerveceria({
  siteName = 'Mi Bar',
  primaryColor = '#f59e0b',
  secondaryColor = '#a855f7',
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
  const pageBg = isGlow ? `linear-gradient(180deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
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

  const cats = Array.from(new Set(menuList.map((m) => (typeof m.meta?.category === 'string' && m.meta.category) || 'Carta')));

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#donde');
  const marquee = ['Happy Hour 18 a 20h', '🍺 Cervezas tiradas', 'Música en vivo', '🍸 Coctelería de autor', 'Reservá tu mesa'];

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .bar-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .bar-link:hover { color: ${accent}; }
        @keyframes bar-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
        .bar-rise { animation: bar-rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .bar-d1 { animation-delay: 0.1s; } .bar-d2 { animation-delay: 0.22s; } .bar-d3 { animation-delay: 0.34s; }
        @keyframes bar-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bar-marquee { display: inline-flex; gap: 3rem; padding-right: 3rem; animation: bar-scroll 22s linear infinite; }
        .bar-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 30px; border-radius: ${t.radiusMd}; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .bar-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .bar-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .bar-btn-ghost { background: transparent; border: 1.5px solid ${accent}66; color: ${t.textPrimary}; }
        .bar-btn-ghost:hover { background: ${accent}1a; }
        .bar-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .bar-card:hover { transform: translateY(-4px); border-color: ${accent}66 !important; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.02em', textTransform: 'uppercase', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#carta" className="bar-link">Carta</a>
          <a href="#donde" className="bar-link">Dónde</a>
          <a href={wa(`Hola ${siteName}! Quería reservar una mesa.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="bar-btn bar-btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }}>Reservar</a>
        </nav>
      </header>

      {/* HERO full-bleed */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: gallery[0]?.image_url ? undefined : `radial-gradient(circle at 30% 20%, ${accent}26, transparent 55%), radial-gradient(circle at 75% 80%, ${accent2}26, transparent 55%)` }}>
          {gallery[0]?.image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${t.bgBase}99, ${t.bgBase}cc)` }} />
            </>
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 820 }}>
          <div className="bar-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            🍻 {siteName}
          </div>
          <h1 className="bar-rise bar-d1" style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.03em', lineHeight: 0.98, marginBottom: '1.5rem' }}>
            {heroTitle || 'Buena birra, mejor compañía'}
          </h1>
          <p className="bar-rise bar-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            {heroSubtitle || 'Cervezas artesanales tiradas, coctelería de autor y la mejor música. Tu lugar para after y noches largas.'}
          </p>
          <div className="bar-rise bar-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#carta" className="bar-btn bar-btn-primary">Ver la carta</a>
            <a href={wa(`Hola ${siteName}! Quería reservar una mesa.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="bar-btn bar-btn-ghost">Reservar mesa</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '1rem 0', background: accentGradient, color: '#fff', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
        <div className="bar-marquee">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* CARTA */}
      <section id="carta" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '0.5rem', textAlign: 'center' }}>La carta</h2>
        <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '3rem' }}>Lo que tomamos y comemos. Hay más en el local.</p>
        {cats.map((cat) => (
          <div key={cat} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: 999, background: `${accent}1a`, color: accent, fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{cat}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {menuList.filter((m) => ((typeof m.meta?.category === 'string' && m.meta.category) || 'Carta') === cat).map((m) => (
                <div key={m.id} className="bar-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem 1.4rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.3rem' }}>{m.title}</h3>
                    {m.description && <p style={{ fontSize: '0.85rem', color: t.textMuted, lineHeight: 1.5 }}>{m.description}</p>}
                  </div>
                  {m.price != null && <span style={{ ...headingFont, fontSize: '1.15rem', color: accent, flexShrink: 0 }}>${m.price.toLocaleString('es-AR')}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* GALERIA */}
      {gallery.length > 1 && (
        <section style={{ padding: '0 clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {gallery.slice(1).map((g) => (
              <div key={g.id} style={{ aspectRatio: '1', borderRadius: t.radiusMd, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DONDE */}
      <section id="donde" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: t.textPrimary }}>Te esperamos</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Un bar pensado para quedarse. Vení con amigos, reservá para tu grupo o sumate a la previa.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Dirección" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍻</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Reservá tu mesa</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Para grupos, cumpleaños y after office. Escribinos y coordinamos.</p>
            <a href={wa(`Hola ${siteName}! Quería reservar una mesa.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="bar-btn bar-btn-primary" style={{ width: '100%' }}>Reservar por WhatsApp</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ ...headingFont, fontSize: 16, color: t.textSecondary, textTransform: 'uppercase' }}>{siteName}</span>
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
