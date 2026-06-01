'use client';

import { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export type ToastData = { type: 'ok' | 'err'; text: string } | null;

/**
 * Toast simple y controlado: el padre maneja el estado (`toast`) y lo limpia
 * en `onClose`. Se posiciona fijo abajo a la derecha y se autodescarta.
 * Usa las CSS vars del tema para integrarse con la app.
 */
export function Toast({
  toast,
  onClose,
  duration = 3000,
}: {
  toast: ToastData;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const isOk = toast.type === 'ok';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        maxWidth: 'min(90vw, 380px)',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md, 0.75rem)',
        background: 'var(--bg-card)',
        border: `1px solid ${isOk ? 'var(--border-hover)' : 'rgba(192, 57, 43, 0.4)'}`,
        boxShadow: 'var(--shadow-elevated)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
        animation: 'toast-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          flexShrink: 0,
          width: 22,
          height: 22,
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          background: isOk ? 'var(--color-primary)' : '#c0392b',
          color: '#fff',
        }}
      >
        {isOk ? <Check size={14} /> : <AlertCircle size={14} />}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.text}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        style={{
          display: 'inline-flex',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: 2,
        }}
      >
        <X size={15} />
      </button>
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
