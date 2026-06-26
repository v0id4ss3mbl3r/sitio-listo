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

const DEFAULT_PRODUCTS: Item[] = [
  { id: 'm1', kind: 'menu', title: 'Ramo de rosas', subtitle: null, description: 'Doce rosas frescas con follaje.', price: 18000, image_url: null, meta: { category: 'Ramos' }, sort_order: 0 },
  { id: 'm2', kind: 'menu', title: 'Bouquet primaveral', subtitle: null, description: 'Mix de flores de estación.', price: 15000, image_url: null, meta: { category: 'Ramos' }, sort_order: 1 },
  { id: 'm3', kind: 'menu', title: 'Caja de flores', subtitle: null, description: 'Arreglo en caja premium.', price: 22000, image_url: null, meta: { category: 'Arreglos' }, sort_order: 2 },
  { id: 'm4', kind: 'menu', title: 'Planta en maceta', subtitle: null, description: 'Suculentas y plantas de interior.', price: 9000, image_url: null, meta: { category: 'Plantas' }, sort_order: 3 },
];

const OCCASIONS = [
  { icon: '🎂', label: 'Cumpleaños' },
  { icon: '💍', label: 'Aniversario' },
  { icon: '❤️', label: 'Amor' },
  { icon: '🤍', label: 'Condolencias' },
  { icon: '🎉', label: 'Felicitaciones' },
];

export default function Floreria({
  siteName = 'Mi Florería',
  primaryColor = '#db2777',
  secondaryColor = '#5C7060',
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

  const products = items.filter((i) => i.kind === 'menu');
  const productList = products.length > 0 ? products : DEFAULT_PRODUCTS;
  const gallery = items.filter((i) => i.kind === 'gallery');

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .flo-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .flo-link:hover { color: ${accent}; }
        @keyframes flo-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .flo-rise { animation: flo-rise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .flo-d1 { animation-delay: 0.1s; } .flo-d2 { animation-delay: 0.2s; } .flo-d3 { animation-delay: 0.3s; }
        .flo-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: 999px; font-weight: 800; font-size: 0.82rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .flo-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .flo-btn-primary:hover { filter: brightness(1.06); transform: translateY(-2px); }
        .flo-btn-ghost { background: ${t.bgCard}; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .flo-btn-ghost:hover { background: ${accent}10; }
        .flo-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .flo-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; }
        .flo-card img { transition: transform 0.5s ease; }
        .flo-card:hover img { transform: scale(1.06); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}><span>🌷</span>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#productos" className="flo-link">Productos</a>
          <a href="#ocasiones" className="flo-link">Ocasiones</a>
          <a href={wa(`Hola ${siteName}, quería hacer un pedido de flores.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="flo-btn flo-btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }}>Pedir</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '3rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="flo-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            🌸 Flores frescas todos los días
          </div>
          <h1 className="flo-rise flo-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)', letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: '1.4rem' }}>
            {heroTitle || 'Flores que dicen lo que sentís'}
          </h1>
          <p className="flo-rise flo-d2" style={{ fontSize: 'clamp(1.02rem, 2vw, 1.2rem)', color: t.textSecondary, lineHeight: 1.65, maxWidth: 480, marginBottom: '2.25rem' }}>
            {heroSubtitle || 'Ramos, arreglos y plantas para cada momento. Hacemos envíos a domicilio el mismo día.'}
          </p>
          <div className="flo-rise flo-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a href="#productos" className="flo-btn flo-btn-primary">Ver productos</a>
            <a href={wa(`Hola ${siteName}, quería enviar flores.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="flo-btn flo-btn-ghost">Enviar flores</a>
          </div>
        </div>
        <div className="flo-rise flo-d2" style={{ aspectRatio: '4/5', borderRadius: t.radiusXl, overflow: 'hidden', background: gallery[0]?.image_url ? undefined : accentGradient, boxShadow: btnShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
          {gallery[0]?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : <span style={{ fontSize: '6rem' }}>💐</span>}
        </div>
      </section>

      {/* OCASIONES */}
      <section id="ocasiones" style={{ padding: '3rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {OCCASIONS.map((o) => (
            <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: 999, background: cardBg, border: `1px solid ${t.borderSubtle}`, fontSize: '0.9rem', fontWeight: 700, color: t.textPrimary }}>
              <span style={{ fontSize: '1.1rem' }}>{o.icon}</span> {o.label}
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" style={{ padding: '3rem clamp(1.25rem,4vw,3rem) 4rem', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestros productos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {productList.map((m) => (
            <div key={m.id} className="flo-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusXl, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '1', background: m.image_url ? undefined : `linear-gradient(135deg, ${accent}1f, ${accent2}1f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {m.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image_url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: '3rem' }}>🌹</span>}
              </div>
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {typeof m.meta?.category === 'string' && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, marginBottom: '0.4rem' }}>{m.meta.category}</span>
                )}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{m.title}</h3>
                {m.description && <p style={{ fontSize: '0.86rem', color: t.textSecondary, lineHeight: 1.5, marginBottom: '1rem' }}>{m.description}</p>}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {m.price != null && <span style={{ ...headingFont, fontSize: '1.3rem', color: accent }}>${m.price.toLocaleString('es-AR')}</span>}
                  <a href={wa(`Hola ${siteName}, quería pedir: ${m.title}.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="flo-btn flo-btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', marginLeft: 'auto' }}>Pedir</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENVIOS */}
      <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '1.25rem' }}>Envíos a domicilio</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Hacemos llegar tus flores frescas el mismo día. Sorprendé a quien quieras con un detalle especial.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Local" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💐</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Pedí por WhatsApp</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Contanos qué buscás y coordinamos el envío al instante.</p>
            <a href={wa(`Hola ${siteName}, quería hacer un pedido de flores.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="flo-btn flo-btn-primary" style={{ width: '100%' }}>Hacer mi pedido</a>
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
