'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TemplateToggle({ templateId, isActive }: { templateId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/plantillas/${templateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        cursor: loading ? 'wait' : 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : isActive ? 'Desactivar' : 'Activar'}
    </button>
  );
}
