'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RotateCcw } from 'lucide-react';

import { Toast, type ToastData } from '@/components/Toast';

export type Opcion = { id: string; label: string };
export type OpcionColor = Opcion & { hex: string };

export type Override = {
  primary?: string;
  secondary?: string;
  fontHeading?: string;
  fontBody?: string;
  borderWidth?: string;
  surface?: 'glow' | 'flat';
  useGradients?: boolean;
};

const etiquetaEstilo: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '0.6rem',
};

const grupoEstilo: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

export default function ThemeCustomizer({
  themeId,
  label,
  override,
  colors,
  fonts,
  borders,
}: {
  themeId: string;
  label: string;
  override: Override;
  colors: OpcionColor[];
  fonts: Opcion[];
  borders: Opcion[];
}) {
  const router = useRouter();
  const [actual, setActual] = useState<Override>(override);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState<ToastData>(null);

  // Cada cambio guarda solo: son decisiones de una sola cosa y el resultado se
  // ve al instante en la propia página del panel, que usa el tema global.
  async function guardar(siguiente: Override, mensaje: string) {
    setGuardando(true);
    setToast(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_overrides: { [themeId]: siguiente } }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'No se pudo guardar');
      }
      setActual(siguiente);
      setToast({ type: 'ok', text: mensaje });
      router.refresh();
    } catch (e) {
      setToast({ type: 'err', text: e instanceof Error ? e.message : 'Error' });
    } finally {
      setGuardando(false);
    }
  }

  const cambiar = (campo: keyof Override, valor: unknown, mensaje: string) => {
    // Volver a tocar la opción activa la quita: así se saca un ajuste suelto
    // sin resetear todo el tema.
    const siguiente = { ...actual };
    if (siguiente[campo] === valor) delete siguiente[campo];
    else (siguiente as Record<string, unknown>)[campo] = valor;
    guardar(siguiente, mensaje);
  };

  const personalizado = Object.keys(actual).length > 0;

  return (
    <div
      className="glass-card"
      style={{ padding: '1.5rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Personalizar {label}
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
            Se aplica encima del preset. Tocá de nuevo una opción activa para quitarla.
          </p>
        </div>
        {guardando && <Loader2 size={16} className="spin" style={{ color: 'var(--text-muted)' }} />}
        {personalizado && !guardando && (
          <button
            type="button"
            onClick={() => guardar({}, `${label} volvió a su diseño original.`)}
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: 40,
              padding: '0 1rem',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            Volver al original
          </button>
        )}
      </div>

      <div style={grupoEstilo}>
        {(['primary', 'secondary'] as const).map((campo) => (
          <div key={campo}>
            <span style={etiquetaEstilo}>
              {campo === 'primary' ? 'Color primario' : 'Color secundario'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {colors.map((c) => {
                const activo = actual[campo] === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={guardando}
                    onClick={() => cambiar(campo, c.id, `Color ${c.label.toLowerCase()} aplicado.`)}
                    aria-pressed={activo}
                    aria-label={c.label}
                    title={c.label}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: c.hex,
                      border: activo
                        ? '3px solid var(--text-primary)'
                        : '1px solid var(--border-subtle)',
                      cursor: guardando ? 'wait' : 'pointer',
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={grupoEstilo}>
        {(['fontHeading', 'fontBody'] as const).map((campo) => (
          <div key={campo}>
            <span style={etiquetaEstilo}>
              {campo === 'fontHeading' ? 'Tipografía de títulos' : 'Tipografía de cuerpo'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {fonts.map((f) => {
                const activo = actual[campo] === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    disabled={guardando}
                    onClick={() => cambiar(campo, f.id, `Tipografía ${f.label} aplicada.`)}
                    aria-pressed={activo}
                    style={{
                      height: 40,
                      padding: '0 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      background: activo ? 'var(--color-primary)' : 'transparent',
                      color: activo ? '#FFFFFF' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: guardando ? 'wait' : 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={grupoEstilo}>
        <div>
          <span style={etiquetaEstilo}>Bordes</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {borders.map((b) => {
              const activo = actual.borderWidth === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  disabled={guardando}
                  onClick={() => cambiar('borderWidth', b.id, `Bordes: ${b.label.toLowerCase()}.`)}
                  aria-pressed={activo}
                  style={{
                    height: 40,
                    padding: '0 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activo ? 'var(--color-primary)' : 'transparent',
                    color: activo ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: guardando ? 'wait' : 'pointer',
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span style={etiquetaEstilo}>Efectos</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={guardando}
              onClick={() =>
                cambiar('surface', actual.surface === 'glow' ? 'flat' : 'glow', 'Halos actualizados.')
              }
              aria-pressed={actual.surface === 'glow'}
              style={{
                height: 40,
                padding: '0 1rem',
                borderRadius: 'var(--radius-sm)',
                background: actual.surface === 'glow' ? 'var(--color-primary)' : 'transparent',
                color: actual.surface === 'glow' ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: guardando ? 'wait' : 'pointer',
              }}
            >
              Halos de fondo
            </button>
            <button
              type="button"
              disabled={guardando}
              onClick={() => cambiar('useGradients', !actual.useGradients, 'Degradés actualizados.')}
              aria-pressed={actual.useGradients === true}
              style={{
                height: 40,
                padding: '0 1rem',
                borderRadius: 'var(--radius-sm)',
                background: actual.useGradients ? 'var(--color-primary)' : 'transparent',
                color: actual.useGradients ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: guardando ? 'wait' : 'pointer',
              }}
            >
              Degradés
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.6rem 0 0', lineHeight: 1.5 }}>
            Estos dos también los leen las plantillas de tus clientes, no solo la landing.
          </p>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
