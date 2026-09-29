'use client';

import { useState } from 'react';

import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/constants';
import { PreviewMiniatura, PreviewVisor } from './TemplatePreview';

const PLAN_LABEL: Record<string, string> = { basic: 'Básico', pro: 'Pro', extremo: 'Extremo' };

// La vitrina se deriva de TEMPLATES → se mantiene sola al sumar plantillas.
const previews = TEMPLATES.map((tpl) => ({
  id: tpl.id,
  name: tpl.name,
  category: tpl.type as string,
  plan: PLAN_LABEL[tpl.plan] ?? tpl.plan,
}));

// Con 30 plantillas, mostrarlas todas de entrada obligaba a scrollear media
// página para llegar a los precios. Se muestran de a 6.
const INICIALES = 6;
const PASO = 6;

// La tarjeta tiene ancho FIJO para que la miniatura pueda escalar el sitio
// (1280px) por un factor conocido sin medir el contenedor en JS.
const ANCHO_TARJETA = 300;
const ALTO_MINIATURA = 200;

export default function TemplateGallery() {
  const [visibles, setVisibles] = useState(INICIALES);
  const [abierta, setAbierta] = useState<{ id: string; name: string } | null>(null);

  const mostradas = previews.slice(0, visibles);
  const restantes = previews.length - visibles;

  return (
    <section
      id="plantillas"
      style={{
        padding: 'var(--space-24) var(--space-6)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-8)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
          Plantillas
        </span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: 'var(--space-3)', lineHeight: 1.1 }}>
          {previews.length} diseños listos para usar
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-4)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Uno para cada rubro. Elegís, cambiás los textos y publicás.
        </p>
      </div>

      {/* Categorías — referencia visual de la variedad, no un filtro. */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <span
            key={cat.slug}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'var(--bg-card)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {cat.name}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${ANCHO_TARJETA}px)`,
          justifyContent: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {mostradas.map((tpl) => (
          <div
            key={tpl.name}
            className="template-card"
            style={{
              overflow: 'hidden',
              width: ANCHO_TARJETA,
              background: 'var(--bg-card)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <PreviewMiniatura
                templateId={tpl.id}
                ancho={ANCHO_TARJETA}
                alto={ALTO_MINIATURA}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  border: 'var(--border-width, 1px) solid var(--border-subtle)',
                }}
              >
                {tpl.plan}
              </div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tpl.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                {TEMPLATE_CATEGORIES.find((c) => c.slug === tpl.category)?.name || tpl.category}
              </p>
              <button
                type="button"
                onClick={() => setAbierta({ id: tpl.id, name: tpl.name })}
                className="nav-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-4)',
                  padding: 0,
                  background: 'transparent',
                  border: 0,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                }}
              >
                Ver esta plantilla
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {restantes > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
          <button
            type="button"
            onClick={() => setVisibles((v) => v + PASO)}
            className="hero-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '48px',
              padding: '0 var(--space-6)',
              boxSizing: 'border-box',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Ver {Math.min(PASO, restantes)} más
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({restantes} restantes)</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
      {abierta && (
        <PreviewVisor
          templateId={abierta.id}
          nombre={abierta.name}
          onCerrar={() => setAbierta(null)}
        />
      )}
    </section>
  );
}
