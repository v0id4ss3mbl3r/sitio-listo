'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SubscriptionActions({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(newStatus: string) {
    if (newStatus === 'cancelled') {
      if (!confirm('¿Cancelar esta suscripción? El sitio queda activo hasta el fin de período.')) return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/suscripciones/${subscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      {status !== 'paused' && status !== 'cancelled' && (
        <button disabled={busy} onClick={() => setStatus('paused')} style={btn('warning')}>
          Pausar
        </button>
      )}
      {status === 'paused' && (
        <button disabled={busy} onClick={() => setStatus('authorized')} style={btn('primary')}>
          Reanudar
        </button>
      )}
      {status !== 'cancelled' && (
        <button disabled={busy} onClick={() => setStatus('cancelled')} style={btn('danger')}>
          Cancelar
        </button>
      )}
    </div>
  );
}

function btn(variant: 'primary' | 'warning' | 'danger'): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '0.35rem 0.7rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
  };
  if (variant === 'primary') return { ...base, background: 'var(--color-primary)', color: '#fff', borderColor: 'transparent' };
  if (variant === 'warning') return { ...base, color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' };
  return { ...base, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' };
}
