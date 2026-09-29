'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone, X } from 'lucide-react';

// Ancho al que se renderiza la preview dentro del iframe. Es el mismo en la
// miniatura y en el visor: así la miniatura es literalmente el sitio, escalado.
const ANCHO_ESCRITORIO = 1280;
const ANCHO_CELULAR = 390;

export type Dispositivo = 'escritorio' | 'celular';

/**
 * Miniatura: el sitio real renderizado y escalado, sin interacción.
 *
 * El ancho de la tarjeta es fijo a propósito (ver la grilla de la galería):
 * con un ancho variable habría que medir el contenedor en JS para calcular la
 * escala, y no vale la pena por una miniatura.
 */
export function PreviewMiniatura({
  templateId,
  ancho,
  alto,
}: {
  templateId: string;
  ancho: number;
  alto: number;
}) {
  const escala = ancho / ANCHO_ESCRITORIO;

  return (
    <div
      aria-hidden="true"
      style={{
        width: ancho,
        height: alto,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg-card-hover)',
        borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)',
      }}
    >
      <iframe
        src={`/preview/${templateId}`}
        title=""
        tabIndex={-1}
        loading="lazy"
        style={{
          width: ANCHO_ESCRITORIO,
          height: alto / escala,
          border: 0,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
          // La miniatura no se toca: el clic es de la tarjeta.
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/** Visor a pantalla completa, con selector de escritorio y celular. */
export function PreviewVisor({
  templateId,
  nombre,
  onCerrar,
}: {
  templateId: string;
  nombre: string;
  onCerrar: () => void;
}) {
  const [dispositivo, setDispositivo] = useState<Dispositivo>('escritorio');

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alTeclear);

    // Bloquear el scroll del fondo mientras el visor está abierto.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  const esCelular = dispositivo === 'celular';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa de la plantilla ${nombre}`}
      onClick={onCerrar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10, 10, 10, 0.72)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-4)',
        gap: 'var(--space-4)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          background: 'var(--bg-card)',
          border: 'var(--border-width, 1px) solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-3)',
        }}
      >
        <strong
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}
        >
          {nombre}
        </strong>

        <div style={{ display: 'flex', gap: 'var(--space-1)', marginLeft: 'auto' }}>
          {([
            { id: 'escritorio' as const, Icono: Monitor, texto: 'Escritorio' },
            { id: 'celular' as const, Icono: Smartphone, texto: 'Celular' },
          ]).map(({ id, Icono, texto }) => {
            const activo = dispositivo === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setDispositivo(id)}
                aria-pressed={activo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  height: 44,
                  padding: '0 var(--space-4)',
                  background: activo ? 'var(--color-primary)' : 'transparent',
                  color: activo ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'var(--border-width, 1px) solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Icono size={16} />
                {texto}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar vista previa"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            background: 'transparent',
            color: 'var(--text-primary)',
            border: 'var(--border-width, 1px) solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <iframe
          key={dispositivo}
          src={`/preview/${templateId}`}
          title={`Vista previa de ${nombre}`}
          style={{
            width: esCelular ? ANCHO_CELULAR : '100%',
            maxWidth: '100%',
            height: '100%',
            border: 0,
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            // El marco solo aparece en celular, donde ayuda a leer el ancho.
            boxShadow: esCelular ? '0 0 0 8px rgba(10,10,10,0.5)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
