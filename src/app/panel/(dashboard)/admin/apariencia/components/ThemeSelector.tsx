'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

import { Toast, type ToastData } from '@/components/Toast';

interface ThemeCard {
  id: string;
  label: string;
  description: string;
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  bg: string;
  text: string;
}

export default function ThemeSelector({
  current,
  themes,
}: {
  current: string;
  themes: ThemeCard[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData>(null);

  async function apply(id: string) {
    if (id === selected || saving) return;
    setSaving(id);
    setToast(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_id: id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'No se pudo guardar');
      }
      setSelected(id);
      const label = themes.find((x) => x.id === id)?.label ?? id;
      setToast({ type: 'ok', text: `Tema "${label}" aplicado.` });
      // Re-renderiza los Server Components (incluido el layout raíz) → el
      // nuevo tema se aplica en vivo sin recargar la página.
      router.refresh();
    } catch (e) {
      setToast({ type: 'err', text: e instanceof Error ? e.message : 'Error' });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {themes.map((t) => {
          const isActive = t.id === selected;
          return (
            <button
              key={t.id}
              onClick={() => apply(t.id)}
              disabled={!!saving}
              className="glass-card"
              style={{
                padding: 0,
                textAlign: 'left',
                cursor: saving ? 'wait' : 'pointer',
                overflow: 'hidden',
                border: isActive
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--border-subtle)',
                position: 'relative',
              }}
            >
              {/* Mini-preview de la paleta */}
              <div
                style={{
                  height: 96,
                  background: t.bg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 8, background: t.primary }} />
                <span style={{ width: 28, height: 28, borderRadius: 8, background: t.secondary }} />
                <span
                  style={{
                    color: t.text,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginLeft: 'auto',
                  }}
                >
                  Aa
                </span>
              </div>

              <div style={{ padding: '0.9rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{t.label}</strong>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 999,
                      padding: '1px 8px',
                    }}
                  >
                    {t.mode === 'dark' ? 'oscuro' : 'claro'}
                  </span>
                  {isActive && (
                    <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', display: 'inline-flex' }}>
                      {saving === t.id ? (
                        <Loader2 size={16} className="spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </span>
                  )}
                  {!isActive && saving === t.id && (
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', display: 'inline-flex' }}>
                      <Loader2 size={16} className="spin" />
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin 0.8s linear infinite}`}</style>
    </div>
  );
}
