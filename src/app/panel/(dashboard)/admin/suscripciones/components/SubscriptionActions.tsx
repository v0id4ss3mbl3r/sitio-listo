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
        <button disabled={busy} onClick={() => setStatus('paused')} className="btn-warning">
          Pausar
        </button>
      )}
      {status === 'paused' && (
        <button disabled={busy} onClick={() => setStatus('authorized')} className="btn-action-primary">
          Reanudar
        </button>
      )}
      {status !== 'cancelled' && (
        <button disabled={busy} onClick={() => setStatus('cancelled')} className="btn-danger">
          Cancelar
        </button>
      )}
    </div>
  );
}
