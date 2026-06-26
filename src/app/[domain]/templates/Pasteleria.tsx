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
  { id: 'p1', kind: 'menu', title: 'Torta de chocolate', subtitle: null, description: 'Bizcocho húmedo, ganache y frutos rojos.', price: 18000, image_url: null, meta: { category: 'Tortas' }, sort_order: 0 },
  { id: 'p2', kind: 'menu', title: 'Lemon pie', subtitle: null, description: 'Crema de limón y merengue italiano.', price: 14000, image_url: null, meta: { category: 'Tortas' }, sort_order: 1 },
  { id: 'p3', kind: 'menu', title: 'Cookies (x6)', subtitle: null, description: 'Con chips de chocolate belga.', price: 6500, image_url: null, meta: { category: 'Para llevar' }, sort_order: 2 },
  { id: 'p4', kind: 'menu', title: 'Alfajores de maicena', subtitle: null, description: 'Rellenos de dulce de leche.', price: 5200, image_url: null, meta: { category: 'Para llevar' }, sort_order: 3 },
  { id: 'p5', kind: 'menu', title: 'Mesa dulce (10 pers.)', subtitle: null, description: 'Variedad de mini postres y bocados.', price: 42000, image_url: null, meta: { category: 'Eventos' }, sort_order: 4 },
];

export default function Pasteleria({
  siteName = 'Mi Pastelería',
  primaryColor = '#db2777',
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

  const menu = items.filter((i) => i.kind === 'menu');
  const menuList = menu.length > 0 ? menu : DEFAULT_MENU;
  const gallery = items.filter((i) => i.kind === 'gallery');

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#encargar');
  const steps = [
    { n: '1', icon: '🍰', title: 'Elegí', text: 'Mirá nuestros productos y decidí qué querés.' },
    { n: '2', icon: '💬', title: 'Escribinos', text: 'Mandanos el pedido por WhatsApp con fecha.' },
    { n: '3', icon: '🎀', title: 'Retirá', text: 'Te avisamos cuando esté listo para retirar.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .pas-link { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .pas-link:hover { color: ${accent}; }
        @keyframes pas-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .pas-rise { animation: pas-rise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
        .pas-d1 { animation-delay: 0.1s; } .pas-d2 { animation-delay: 0.2s; } .pas-d3 { animation-delay: 0.3s; }
        .pas-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 28px; border-radius: 999px; font-weight: 800; font-size: 0.82rem; letter-spacing: 0.02em; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .pas-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .pas-btn-primary:hover { filter: brightness(1.06); transform: translateY(-2px); }
        .pas-btn-ghost { background: ${t.bgCard}; border: 1.5px solid ${t.borderHover}; color: ${t.textPrimary}; }
        .pas-btn-ghost:hover { background: ${accent}10; }
        .pas-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .pas-card:hover { transform: translateY(-6px); box-shadow: ${btnShadow}; }
        .pas-card img { transition: transform 0.5s ease; }
        .pas-card:hover img { transform: scale(1.06); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#productos" className="pas-link">Productos</a>
          <a href="#como" className="pas-link">Cómo encargar</a>
          <a href={wa(`Hola ${siteName}! Quería hacer un encargo.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="pas-btn pas-btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }}>Encargar</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(70px + 5rem)', paddingBottom: '4rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
        <div className="pas-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          🧁 Pastelería artesanal
        </div>
        <h1 className="pas-rise pas-d1" style={{ ...headingFont, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.03em', lineHeight: 1.02, marginBottom: '1.4rem', maxWidth: 820, marginInline: 'auto' }}>
          {heroTitle || 'Dulces hechos con amor'}
        </h1>
        <p className="pas-rise pas-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
          {heroSubtitle || 'Tortas, postres y bocados para tus momentos especiales. Encargá el tuyo por WhatsApp.'}
        </p>
        <div className="pas-rise pas-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#productos" className="pas-btn pas-btn-primary">Ver productos</a>
          <a href={wa(`Hola ${siteName}! Quería hacer un encargo personalizado.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="pas-btn pas-btn-ghost">Encargo personalizado</a>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Nuestros productos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
          {menuList.map((m) => (
            <div key={m.id} className="pas-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, borderRadius: t.radiusXl, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', background: m.image_url ? undefined : `linear-gradient(135deg, ${accent}22, ${accent2}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {m.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image_url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '3rem' }}>🍰</span>
                )}
              </div>
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {typeof m.meta?.category === 'string' && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, marginBottom: '0.4rem' }}>{m.meta.category}</span>
                )}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.4rem' }}>{m.title}</h3>
                {m.description && <p style={{ fontSize: '0.88rem', color: t.textSecondary, lineHeight: 1.55, marginBottom: '1rem' }}>{m.description}</p>}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {m.price != null && <span style={{ ...headingFont, fontSize: '1.35rem', color: accent }}>${m.price.toLocaleString('es-AR')}</span>}
                  <a href={wa(`Hola ${siteName}! Quería encargar: ${m.title}.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="pas-btn pas-btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', marginLeft: 'auto' }}>Encargar</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO ENCARGAR */}
      <section id="como" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', color: t.textPrimary, marginBottom: '2.5rem', textAlign: 'center' }}>Cómo encargar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {steps.map((s) => (
              <div key={s.n} style={{ textAlign: 'center', padding: '2rem 1.5rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: accentGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>{s.icon}</div>
                <h3 style={{ ...headingFont, fontSize: '1.2rem', color: t.textPrimary, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: t.textSecondary, lineHeight: 1.55 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 0 && (
        <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center' }}>Nuestras creaciones</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map((g) => (
              <div key={g.id} style={{ aspectRatio: '1', borderRadius: t.radiusLg, overflow: 'hidden', background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.image_url && <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACTO */}
      <section style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: t.textPrimary }}>Hacé tu pedido</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Tortas personalizadas para cumpleaños, casamientos y eventos. Contanos qué imaginás y lo hacemos realidad.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Dirección" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <div style={{ padding: '2.25rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎂</div>
            <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.6rem' }}>Encargá por WhatsApp</h3>
            <p style={{ fontSize: '0.92rem', color: t.textSecondary, lineHeight: 1.6, marginBottom: '1.5rem' }}>Te respondemos con disponibilidad y presupuesto al instante.</p>
            <a href={wa(`Hola ${siteName}! Quería hacer un encargo.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="pas-btn pas-btn-primary" style={{ width: '100%' }}>Abrir WhatsApp</a>
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
