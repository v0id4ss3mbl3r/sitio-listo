'use client';

import React, { useState } from 'react';

import { getTheme, type Theme } from '@/lib/themes';
import { buildWhatsappUrl, buildBookingMessage } from '@/lib/whatsapp';

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
  { id: 's1', kind: 'service', title: 'Corte clásico', subtitle: null, description: 'Tijera y máquina, lavado incluido.', price: 6000, image_url: null, meta: { duration: '40 min' }, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Corte + barba', subtitle: null, description: 'Perfilado y toalla caliente.', price: 9000, image_url: null, meta: { duration: '60 min' }, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Afeitado a navaja', subtitle: null, description: 'Ritual completo con vapor.', price: 5500, image_url: null, meta: { duration: '30 min' }, sort_order: 2 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'El Jefe', subtitle: 'Barbero master', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Tato', subtitle: 'Especialista en fades', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function Barberia({
  siteName = 'Mi Barbería',
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

  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const team = items.filter((i) => i.kind === 'team');
  const teamList = team.length > 0 ? team : DEFAULT_TEAM;
  const gallery = items.filter((i) => i.kind === 'gallery');

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#turno');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .brb-link { font-size: 0.76rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .brb-link:hover { color: ${accent}; }
        @keyframes brb-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
        .brb-rise { animation: brb-rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .brb-d1 { animation-delay: 0.1s; } .brb-d2 { animation-delay: 0.22s; } .brb-d3 { animation-delay: 0.34s; }
        .brb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 14px 32px; border-radius: ${t.radiusSm}; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .brb-btn-primary { background: ${accentGradient}; color: #fff; box-shadow: ${btnShadow}; }
        .brb-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .brb-btn-ghost { background: transparent; border: 1.5px solid ${accent}66; color: ${t.textPrimary}; }
        .brb-btn-ghost:hover { background: ${accent}1a; }
        .brb-srv { transition: border-color 0.25s ease, background 0.25s ease; }
        .brb-srv:hover { border-color: ${accent}66 !important; }
        .brb-input { width: 100%; padding: 12px 14px; border-radius: ${t.radiusSm}; background: ${isDark ? 'rgba(255,255,255,0.05)' : t.bgSubtle}; border: 1px solid ${t.borderSubtle}; color: ${t.textPrimary}; font-size: 0.92rem; outline: none; font-family: inherit; }
        .brb-input:focus { border-color: ${accent}; }
        .brb-stripe { background: repeating-linear-gradient(45deg, ${accent}, ${accent} 12px, ${t.bgBase} 12px, ${t.bgBase} 24px); }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 20, letterSpacing: '0.04em', textTransform: 'uppercase', color: t.textPrimary }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#servicios" className="brb-link">Servicios</a>
          <a href="#equipo" className="brb-link">Equipo</a>
          <a href="#turno" className="brb-btn brb-btn-primary" style={{ padding: '9px 20px', fontSize: '0.7rem' }}>Turno</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '8rem clamp(1.25rem,4vw,3rem) 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {gallery[0]?.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].image_url} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${t.bgBase}f2, ${t.bgBase}99)` }} />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 30%, ${accent}1f, transparent 50%)` }} />
          )}
        </div>
        <div style={{ position: 'relative', maxWidth: 760 }}>
          <div className="brb-rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 4, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            ✂️ Barbería &amp; estilo
          </div>
          <h1 className="brb-rise brb-d1" style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6.5rem)', letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            {heroTitle || 'Tu mejor versión'}
          </h1>
          <p className="brb-rise brb-d2" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 500, marginBottom: '2.5rem' }}>
            {heroSubtitle || 'Cortes con identidad, barba a punto y un ritual pensado para vos. Reservá tu turno.'}
          </p>
          <div className="brb-rise brb-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#turno" className="brb-btn brb-btn-primary">Reservar turno</a>
            <a href="#servicios" className="brb-btn brb-btn-ghost">Ver servicios</a>
          </div>
        </div>
      </section>

      <div className="brb-stripe" style={{ height: 8 }} />

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 980, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Servicios</h2>
        <p style={{ color: t.textSecondary, marginBottom: '2.5rem' }}>Precios de referencia. Consultá combos y planes mensuales.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {serviceList.map((s) => (
            <div key={s.id} className="brb-srv" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem', borderRadius: t.radiusMd, background: cardBg, border: `1px solid ${t.borderSubtle}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '0.25rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.88rem', color: t.textMuted, lineHeight: 1.5 }}>{s.description}</p>}
                {typeof s.meta?.duration === 'string' && <span style={{ fontSize: '0.76rem', color: accent, fontWeight: 700, letterSpacing: '0.05em' }}>⏱ {s.meta.duration}</span>}
              </div>
              {s.price != null && <span style={{ ...headingFont, fontSize: '1.5rem', color: accent, flexShrink: 0 }}>${s.price.toLocaleString('es-AR')}</span>}
              <a href="#turno" className="brb-btn brb-btn-ghost" style={{ padding: '9px 18px', fontSize: '0.68rem', flexShrink: 0 }}>Reservar</a>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem', textTransform: 'uppercase', textAlign: 'center' }}>El equipo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
            {teamList.map((p) => (
              <div key={p.id} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', borderRadius: t.radiusLg, overflow: 'hidden', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}33, ${accent2}33)`, border: `1px solid ${t.borderSubtle}`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>💈</span>
                  )}
                </div>
                <h3 style={{ ...headingFont, fontSize: '1.2rem', color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <p style={{ fontSize: '0.85rem', color: accent, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.subtitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {gallery.length > 1 && (
        <section style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1180, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>Trabajos</h2>
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

      {/* TURNO */}
      <section id="turno" style={{ padding: '5.5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1.25rem', textTransform: 'uppercase' }}>Pedí tu turno</h2>
            <p style={{ fontSize: '1rem', color: t.textSecondary, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {aboutText || 'Elegí el servicio y el día. Te confirmamos por WhatsApp en minutos.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {address && <InfoRow icon="📍" label="Dirección" value={address} t={t} />}
              {openingHours && <InfoRow icon="🕒" label="Horarios" value={openingHours} t={t} />}
              {phone && <InfoRow icon="📞" label="Teléfono" value={phone} t={t} />}
            </div>
          </div>
          <BookingWidget services={serviceList} siteName={siteName} wa={wa} hasPhone={!!phone} t={t} headingFont={headingFont} cardBg={cardBg} isDark={isDark} />
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

function BookingWidget({
  services, siteName, wa, hasPhone, t, headingFont, cardBg, isDark,
}: {
  services: Item[];
  siteName: string;
  wa: (msg: string) => string;
  hasPhone: boolean;
  t: Theme['tokens'];
  headingFont: React.CSSProperties;
  cardBg: string;
  isDark: boolean;
}) {
  const [service, setService] = useState(services[0]?.title ?? '');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const ready = name.trim() && tel.trim() && service;
  const msg = buildBookingMessage({
    services: service ? [service] : [],
    customerName: name.trim(),
    customerPhone: tel.trim(),
    date: date || undefined,
    time: time || undefined,
    notes: `Turno solicitado en ${siteName}`,
  });

  return (
    <div style={{ padding: '2rem', borderRadius: t.radiusLg, background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard }}>
      <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '1.25rem', textTransform: 'uppercase' }}>Reserva</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div>
          <label style={labelStyle(t)}>Servicio</label>
          <select className="brb-input" value={service} onChange={(e) => setService(e.target.value)}>
            {services.map((s) => (
              <option key={s.id} value={s.title}>{s.title}{s.price != null ? ` — $${s.price.toLocaleString('es-AR')}` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle(t)}>Nombre</label>
          <input className="brb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div>
          <label style={labelStyle(t)}>Teléfono</label>
          <input className="brb-input" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Tu teléfono" />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle(t)}>Día</label>
            <input className="brb-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle(t)}>Hora</label>
            <input className="brb-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <a
          href={ready ? wa(msg) : undefined}
          target={hasPhone ? '_blank' : undefined}
          rel="noreferrer"
          className="brb-btn brb-btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', opacity: ready ? 1 : 0.5, pointerEvents: ready ? 'auto' : 'none' }}
          aria-disabled={!ready}
        >
          {ready ? 'Confirmar por WhatsApp' : 'Completá tus datos'}
        </a>
        <p style={{ fontSize: '0.72rem', color: t.textMuted, textAlign: 'center', marginTop: '0.25rem' }}>Sujeto a confirmación de disponibilidad.</p>
      </div>
    </div>
  );
}

function labelStyle(t: Theme['tokens']): React.CSSProperties {
  return { display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMuted, marginBottom: '0.35rem' };
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
