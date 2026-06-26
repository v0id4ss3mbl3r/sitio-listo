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

const DEFAULT_GALLERY: Item[] = [
  { id: 'g1', kind: 'gallery', title: 'Casa Patios', subtitle: 'Vivienda unifamiliar · 2024', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 'g2', kind: 'gallery', title: 'Edificio Norte', subtitle: 'Multifamiliar · 2023', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 'g3', kind: 'gallery', title: 'Oficinas Mística', subtitle: 'Comercial · 2023', description: null, price: null, image_url: null, meta: {}, sort_order: 2 },
  { id: 'g4', kind: 'gallery', title: 'Refugio Sierra', subtitle: 'Vivienda · 2022', description: null, price: null, image_url: null, meta: {}, sort_order: 3 },
];

const DEFAULT_SERVICES: Item[] = [
  { id: 's1', kind: 'service', title: 'Anteproyecto', subtitle: null, description: 'Ideas, partido y volumetría inicial.', price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 's2', kind: 'service', title: 'Proyecto ejecutivo', subtitle: null, description: 'Documentación técnica completa.', price: null, image_url: null, meta: {}, sort_order: 1 },
  { id: 's3', kind: 'service', title: 'Dirección de obra', subtitle: null, description: 'Seguimiento y control en obra.', price: null, image_url: null, meta: {}, sort_order: 2 },
];

const DEFAULT_TEAM: Item[] = [
  { id: 't1', kind: 'team', title: 'Arq. Daniela Ríos', subtitle: 'Directora', description: null, price: null, image_url: null, meta: {}, sort_order: 0 },
  { id: 't2', kind: 'team', title: 'Arq. Pablo Vega', subtitle: 'Proyecto', description: null, price: null, image_url: null, meta: {}, sort_order: 1 },
];

export default function Arquitectura({
  siteName = 'Estudio de Arquitectura',
  primaryColor = '#2A2A24',
  secondaryColor = '#8B6F3F',
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
  const gallery = items.filter((i) => i.kind === 'gallery');
  const galleryList = gallery.length > 0 ? gallery : DEFAULT_GALLERY;
  const services = items.filter((i) => i.kind === 'service');
  const serviceList = services.length > 0 ? services : DEFAULT_SERVICES;
  const team = items.filter((i) => i.kind === 'team');
  const teamList = team.length > 0 ? team : DEFAULT_TEAM;

  const wa = (msg: string) => (phone ? buildWhatsappUrl(phone, msg) : '#contacto');

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: t.textPrimary, fontFamily: t.fontBody, overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .arq-link { font-size: 0.76rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.textMuted}; text-decoration: none; transition: color 0.2s; }
        .arq-link:hover { color: ${accent}; }
        @keyframes arq-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .arq-rise { animation: arq-rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .arq-d1 { animation-delay: 0.12s; } .arq-d2 { animation-delay: 0.24s; } .arq-d3 { animation-delay: 0.36s; }
        .arq-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 13px 30px; border-radius: 0; font-weight: 600; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; transition: all 0.25s ease; }
        .arq-btn-primary { background: ${accent}; color: ${t.bgBase}; }
        .arq-btn-primary:hover { background: ${accent2}; }
        .arq-btn-ghost { background: transparent; border: 1px solid ${accent}; color: ${t.textPrimary}; }
        .arq-btn-ghost:hover { background: ${accent}0d; }
        .arq-proj { position: relative; overflow: hidden; }
        .arq-proj img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .arq-proj:hover img { transform: scale(1.04); }
        .arq-proj .cap { transition: opacity 0.3s ease; }
      `}} />

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.25rem,4vw,3rem)', background: `${t.bgBase}E6`, backdropFilter: 'blur(18px)', borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...headingFont, fontSize: 19, letterSpacing: '0.02em', color: t.textPrimary, textTransform: 'uppercase' }}>{siteName}</span>
        <nav style={{ display: 'flex', gap: 'clamp(1rem,3vw,2.25rem)', alignItems: 'center' }}>
          <a href="#proyectos" className="arq-link">Proyectos</a>
          <a href="#proceso" className="arq-link">Proceso</a>
          <a href={wa(`Hola ${siteName}, quería consultar por un proyecto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="arq-btn arq-btn-primary" style={{ padding: '9px 20px', fontSize: '0.68rem' }}>Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 'calc(72px + 5rem)', paddingBottom: '3rem', paddingLeft: 'clamp(1.25rem,4vw,3rem)', paddingRight: 'clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
        <div className="arq-rise" style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent2, marginBottom: '1.5rem' }}>Arquitectura &amp; Diseño</div>
        <h1 className="arq-rise arq-d1" style={{ ...headingFont, fontSize: 'clamp(2.6rem, 8vw, 6rem)', letterSpacing: '-0.03em', lineHeight: 1.02, marginBottom: '1.5rem', maxWidth: 900 }}>
          {heroTitle || 'Espacios que cuentan historias'}
        </h1>
        <p className="arq-rise arq-d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: t.textSecondary, lineHeight: 1.6, maxWidth: 540, marginBottom: '2.5rem' }}>
          {heroSubtitle || 'Diseñamos viviendas y espacios comerciales con identidad, función y luz natural.'}
        </p>
        <div className="arq-rise arq-d3" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a href="#proyectos" className="arq-btn arq-btn-primary">Ver proyectos</a>
          <a href={wa(`Hola ${siteName}, quería consultar por un proyecto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="arq-btn arq-btn-ghost">Iniciar proyecto</a>
        </div>
        <div className="arq-rise arq-d3 arq-proj" style={{ aspectRatio: '21/9', background: galleryList[0]?.image_url ? undefined : accentGradient, border: `1px solid ${t.borderSubtle}` }}>
          {galleryList[0]?.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={galleryList[0].image_url} alt={galleryList[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff55', fontSize: '4rem' }}>▤</div>
          )}
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" style={{ padding: '4rem clamp(1.25rem,4vw,3rem)', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem' }}>Proyectos seleccionados</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {galleryList.map((g, idx) => (
            <div key={g.id} className="arq-proj" style={{ aspectRatio: idx % 3 === 0 ? '4/5' : '4/3', background: g.image_url ? undefined : `linear-gradient(135deg, ${accent}1a, ${accent2}1a)`, border: `1px solid ${t.borderSubtle}` }}>
              {g.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: '2.5rem' }}>▤</div>
              )}
              <div className="cap" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                <div style={{ ...headingFont, fontSize: '1.2rem', color: '#fff' }}>{g.title}</div>
                {g.subtitle && <div style={{ fontSize: '0.78rem', color: '#ffffffcc', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{g.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', background: t.bgSubtle, borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '2.5rem' }}>Nuestro proceso</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {serviceList.map((s, idx) => (
              <div key={s.id}>
                <div style={{ ...headingFont, fontSize: '2.5rem', color: accent2, marginBottom: '1rem', borderTop: `2px solid ${accent}`, paddingTop: '1rem' }}>{String(idx + 1).padStart(2, '0')}</div>
                <h3 style={{ ...headingFont, fontSize: '1.4rem', color: t.textPrimary, marginBottom: '0.5rem' }}>{s.title}</h3>
                {s.description && <p style={{ fontSize: '0.95rem', color: t.textSecondary, lineHeight: 1.65 }}>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section style={{ padding: '5rem clamp(1.25rem,4vw,3rem)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', color: t.textPrimary, marginBottom: '1.25rem' }}>El estudio</h2>
            <p style={{ fontSize: '1.05rem', color: t.textSecondary, lineHeight: 1.8 }}>
              {aboutText || 'Somos un equipo apasionado por el diseño. Cada proyecto es una oportunidad para crear espacios que mejoren la vida de quienes los habitan.'}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
            {teamList.map((p) => (
              <div key={p.id} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: p.image_url ? undefined : `linear-gradient(135deg, ${accent}1a, ${accent2}1a)`, border: `1px solid ${t.borderSubtle}`, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '2.2rem' }}>📐</span>}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: t.textPrimary }}>{p.title}</h3>
                {p.subtitle && <p style={{ fontSize: '0.78rem', color: t.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{p.subtitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ padding: '4rem clamp(1.25rem,4vw,3rem) 5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ padding: 'clamp(2.5rem, 6vw, 4.5rem)', background: accent, color: t.bgBase }}>
          <h2 style={{ ...headingFont, fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-0.02em', marginBottom: '1rem', color: t.bgBase }}>¿Tenés un proyecto en mente?</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560, opacity: 0.85 }}>
            Contanos tu idea y la convertimos en un espacio único. Primera reunión sin cargo.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600, opacity: 0.85 }}>
            {address && <span>📍 {address}</span>}
            {openingHours && <span>🕒 {openingHours}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
          <a href={wa(`Hola ${siteName}, quería consultar por un proyecto.`)} target={phone ? '_blank' : undefined} rel="noreferrer" className="arq-btn" style={{ background: t.bgBase, color: accent }}>Escribir por WhatsApp</a>
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
