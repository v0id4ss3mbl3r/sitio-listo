'use client';

import React, { useState } from 'react';
import { User, Phone, Calendar, Clock } from 'lucide-react';

import { getTheme, type Theme } from '@/lib/themes';
import { buildBookingMessage, buildWhatsappUrl } from '@/lib/whatsapp';

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
  theme?: Theme;
  items?: Item[];
}

const SERVICE_GRADIENTS = [
  'linear-gradient(135deg, #e9d5c5 0%, #d4a373 100%)',
  'linear-gradient(135deg, #f3d2e0 0%, #d48fb0 100%)',
  'linear-gradient(135deg, #e9edc9 0%, #ccd5ae 100%)',
  'linear-gradient(135deg, #ead7d1 0%, #c9a0a0 100%)',
];

const DEFAULT_SERVICES: Array<{ id: string; title: string; price: number | null; description: string | null; image_url: string | null; meta: Record<string, unknown> }> = [
  { id: 'd1', title: 'Semipermanente', price: 2500, description: 'Esmaltado de larga duración con acabado brillante.', image_url: null, meta: { duration: '45 min' } },
  { id: 'd2', title: 'Kapping Gel', price: 3500, description: 'Fortalece tus uñas naturales y evita que se quiebren.', image_url: null, meta: { duration: '1 h' } },
  { id: 'd3', title: 'Esculpidas', price: 4500, description: 'Extensiones para un largo y forma perfectos.', image_url: null, meta: { duration: '1 h 30' } },
];

function metaStr(meta: Record<string, unknown>, key: string): string {
  const v = meta?.[key];
  return typeof v === 'string' ? v : '';
}

export default function BellezaEstetica({
  siteName = 'Estudio',
  primaryColor = '#d4a373',
  secondaryColor = '#c9a0a0',
  planType,
  heroTitle,
  heroSubtitle,
  aboutText,
  phone = '',
  theme = getTheme('oficina'),
  items = [],
}: TemplateProps) {
  const t = theme.tokens;
  const isDark = theme.mode === 'dark';
  const isGlow = t.surface === 'glow';

  const accent = primaryColor;
  const accent2 = secondaryColor;
  const pageBg = isGlow ? `linear-gradient(135deg, ${t.bgBase} 0%, ${t.bgSubtle} 100%)` : t.bgBase;
  const headingFont: React.CSSProperties = {
    fontFamily: t.fontHeading,
    fontStyle: t.headingItalic ? 'italic' : 'normal',
    fontWeight: t.headingWeight,
  };
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : t.bgCard;

  const services = items.filter((i) => i.kind === 'service');
  const gallery = items.filter((i) => i.kind === 'gallery' && i.image_url);
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const heroImage = gallery[0]?.image_url || services.find((s) => s.image_url)?.image_url || null;

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .be-nav-link { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.textSecondary}; text-decoration: none; transition: color 0.2s; }
        .be-nav-link:hover { color: ${accent}; }
        @keyframes be-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .be-fade { animation: be-fade 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .be-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; border-radius: 24px; overflow: hidden; }
        .be-card:hover { transform: translateY(-10px); box-shadow: ${isDark ? 'none' : t.shadowElevated}; }
        .be-card img { transition: transform 0.6s ease; }
        .be-card:hover img { transform: scale(1.08); }
        .be-gal { overflow: hidden; border-radius: 18px; aspect-ratio: 1/1; }
        .be-gal img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .be-gal:hover img { transform: scale(1.1); }
        .be-pill { background: ${accent}; color: #fff; padding: 12px 28px; border-radius: 999px; font-weight: 600; font-size: 0.9rem; text-decoration: none; display: inline-block; transition: all 0.25s ease; cursor: pointer; border: none; }
        .be-pill:hover { filter: brightness(1.06); transform: translateY(-2px); }
        .be-svc-input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.5rem; border-radius: 14px; background: ${isDark ? 'rgba(255,255,255,0.05)' : t.bgSubtle}; border: 1px solid ${t.borderSubtle}; color: ${t.textPrimary}; outline: none; font-size: 0.95rem; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', background: `${t.bgBase}E6`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 22, color: accent, letterSpacing: '-0.01em' }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#servicios" className="be-nav-link">Servicios</a>
          {gallery.length > 0 && <a href="#portfolio" className="be-nav-link">Portfolio</a>}
          <a href="#turnos" className="be-pill" style={{ padding: '9px 22px', fontSize: '0.8rem' }}>Agendá</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: heroImage ? `#000` : `linear-gradient(135deg, ${accent}22, ${accent2}22)` }}>
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt={siteName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          )}
        </div>
        <div className="be-fade" style={{ position: 'relative', zIndex: 10, maxWidth: 800 }}>
          <h1 style={{ ...headingFont, fontSize: 'clamp(3rem, 9vw, 6rem)', lineHeight: 1.05, marginBottom: '1.5rem', color: heroImage ? '#fff' : t.textPrimary, textShadow: heroImage ? '0 2px 20px rgba(0,0,0,0.4)' : 'none' }}>
            {heroTitle || 'Realzá tu belleza'}
          </h1>
          <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontStyle: 'italic', color: heroImage ? 'rgba(255,255,255,0.9)' : t.textSecondary, marginBottom: '2.5rem', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', textShadow: heroImage ? '0 2px 12px rgba(0,0,0,0.4)' : 'none' }}>
            {heroSubtitle || 'Diseños exclusivos para resaltar tu esencia.'}
          </p>
          <a href="#turnos" className="be-pill" style={{ padding: '15px 40px', fontSize: '1rem' }}>Agendar ahora</a>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '6rem 2.5rem', background: t.bgBase }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', textAlign: 'center', marginBottom: '3.5rem', color: t.textPrimary }}>Nuestros Servicios</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {serviceList.map((s, idx) => (
              <div key={('id' in s ? (s as Item).id : idx)} className="be-card" style={{ background: cardBg, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowCard, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 220, overflow: 'hidden', background: s.image_url ? undefined : SERVICE_GRADIENTS[idx % SERVICE_GRADIENTS.length] }}>
                  {s.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.image_url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ ...headingFont, fontSize: '1.5rem', marginBottom: '0.6rem', color: t.textPrimary }}>{s.title}</h3>
                  {s.description && <p style={{ fontSize: '0.9rem', color: t.textMuted, lineHeight: 1.65, marginBottom: '1.25rem' }}>{s.description}</p>}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      {s.price != null && <span style={{ ...headingFont, fontSize: '1.5rem', color: accent }}>${s.price.toLocaleString('es-AR')}</span>}
                      {metaStr(s.meta as Record<string, unknown>, 'duration') && (
                        <span style={{ fontSize: '0.78rem', color: t.textMuted }}>· {metaStr(s.meta as Record<string, unknown>, 'duration')}</span>
                      )}
                    </div>
                    <a href="#turnos" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: t.textPrimary, textDecoration: 'none', borderBottom: `2px solid ${accent}`, paddingBottom: 2 }}>Reservar</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      {gallery.length > 0 && (
        <section id="portfolio" style={{ padding: '6rem 2.5rem', background: t.bgSubtle }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ ...headingFont, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', textAlign: 'center', marginBottom: '3rem', color: t.textPrimary }}>Nuestro Portfolio</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {gallery.map((g) => (
                <div key={g.id} className="be-gal" style={{ border: `1px solid ${t.borderSubtle}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image_url as string} alt={g.title || siteName} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TURNOS */}
      <section id="turnos" style={{ padding: '6rem 2.5rem', background: t.bgBase }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', marginBottom: '0.75rem', color: t.textPrimary }}>Reservá tu turno</h2>
          <p style={{ textAlign: 'center', color: t.textMuted, marginBottom: '2.5rem', fontStyle: 'italic' }}>
            {aboutText || 'Elegí el servicio y coordinamos por WhatsApp.'}
          </p>
          <BookingWidget
            services={serviceList.map((s) => ({ name: s.title, price: s.price }))}
            phone={phone}
            accent={accent}
            t={t}
            isDark={isDark}
            headingFont={headingFont}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2.5rem', textAlign: 'center', borderTop: `1px solid ${t.borderSubtle}`, color: t.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>
        © {new Date().getFullYear()} {siteName}{(!planType || planType === 'basic') && ' — Creado con SitioListo'}
      </footer>
    </div>
  );
}

function BookingWidget({
  services,
  phone,
  accent,
  t,
  isDark,
  headingFont,
}: {
  services: Array<{ name: string; price: number | null }>;
  phone: string;
  accent: string;
  t: Theme['tokens'];
  isDark: boolean;
  headingFont: React.CSSProperties;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState('');
  const [name, setName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const cardStyle: React.CSSProperties = {
    maxWidth: 460, margin: '0 auto', background: isDark ? 'rgba(255,255,255,0.04)' : t.bgCard,
    padding: '2rem', borderRadius: 28, border: `1px solid ${t.borderSubtle}`, boxShadow: isDark ? 'none' : t.shadowElevated,
  };

  function confirm() {
    if (!name.trim() || !customerPhone.trim()) return;
    if (!phone) {
      alert('Este sitio todavía no tiene un WhatsApp configurado para recibir turnos.');
      return;
    }
    const msg = buildBookingMessage({
      services: service ? [service] : [],
      customerName: name.trim(),
      customerPhone: customerPhone.trim(),
      date: date || undefined,
      time: time || undefined,
    });
    window.open(buildWhatsappUrl(phone, msg), '_blank', 'noopener,noreferrer');
  }

  if (step === 1) {
    return (
      <div style={cardStyle}>
        <h3 style={{ ...headingFont, fontSize: '1.3rem', textAlign: 'center', marginBottom: '1.5rem', color: t.textPrimary }}>Seleccioná tu servicio</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {services.map((s) => (
            <button
              key={s.name}
              onClick={() => { setService(s.name); setStep(2); }}
              style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: 14, border: `1px solid ${t.borderSubtle}`, background: 'transparent', color: t.textPrimary, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              {s.price != null && <span style={{ fontWeight: 700, color: accent }}>${s.price.toLocaleString('es-AR')}</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '0.8rem', color: t.textMuted, marginBottom: '1.25rem', textAlign: 'center' }}>
        Turno para <strong style={{ color: accent }}>{service}</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: 12, top: 13, color: t.textMuted }} />
          <input className="be-svc-input" type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ position: 'relative' }}>
          <Phone size={18} style={{ position: 'absolute', left: 12, top: 13, color: t.textMuted }} />
          <input className="be-svc-input" type="tel" placeholder="Tu teléfono / WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Calendar size={18} style={{ position: 'absolute', left: 12, top: 13, color: t.textMuted, pointerEvents: 'none' }} />
            <input className="be-svc-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <Clock size={18} style={{ position: 'absolute', left: 12, top: 13, color: t.textMuted, pointerEvents: 'none' }} />
            <input className="be-svc-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <button
          onClick={confirm}
          disabled={!name.trim() || !customerPhone.trim()}
          style={{ width: '100%', padding: '1rem', borderRadius: 16, background: accent, color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', opacity: (!name.trim() || !customerPhone.trim()) ? 0.4 : 1, marginTop: '0.5rem' }}
        >
          Confirmar turno por WhatsApp
        </button>
        <button onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', color: t.textMuted, fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}>Volver</button>
      </div>
    </div>
  );
}
