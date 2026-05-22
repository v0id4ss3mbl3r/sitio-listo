'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  siteId: string;
  subdomain: string;
  customDomain: string | null;
  isActive: boolean;
  isBanned: boolean;
};

export default function SiteActions({
  siteId,
  subdomain,
  customDomain,
  isActive,
  isBanned,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftSubdomain, setDraftSubdomain] = useState(subdomain);
  const [draftCustom, setDraftCustom] = useState(customDomain ?? '');

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch(`/api/admin/sitios/${siteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error en la operación');
      return false;
    }
    router.refresh();
    return true;
  }

  async function toggleActive() {
    await patch({ is_active: !isActive });
  }

  async function toggleBan() {
    if (!isBanned) {
      if (!confirm(`¿Banear ${subdomain}.sitiolisto.com.ar? El sitio dejará de servirse.`)) return;
    }
    await patch({ is_banned: !isBanned });
  }

  async function saveDomains() {
    const ok = await patch({
      subdomain: draftSubdomain,
      custom_domain: draftCustom.trim() || null,
    });
    if (ok) setEditing(false);
  }

  async function deleteSite() {
    if (!confirm(`¿ELIMINAR ${subdomain}.sitiolisto.com.ar y todos sus datos? Esto es irreversible.`)) {
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/sitios/${siteId}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error al eliminar');
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '220px' }}>
        <input
          type="text"
          value={draftSubdomain}
          onChange={(e) => setDraftSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="subdominio"
          style={inputStyle}
        />
        <input
          type="text"
          value={draftCustom}
          onChange={(e) => setDraftCustom(e.target.value)}
          placeholder="dominio.com (opcional)"
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button disabled={busy} onClick={saveDomains} style={btnPrimary}>
            Guardar
          </button>
          <button onClick={() => setEditing(false)} style={btnGhost}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      <button disabled={busy} onClick={toggleActive} style={btnGhost}>
        {isActive ? 'Desactivar' : 'Activar'}
      </button>
      <button onClick={() => setEditing(true)} style={btnGhost}>
        Dominio
      </button>
      <button disabled={busy} onClick={toggleBan} style={isBanned ? btnGhost : btnWarning}>
        {isBanned ? 'Desbanear' : 'Banear'}
      </button>
      <button disabled={busy} onClick={deleteSite} style={btnDanger}>
        Eliminar
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.4rem 0.6rem',
  borderRadius: '6px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  fontSize: '0.8rem',
  outline: 'none',
};
const btnBase: React.CSSProperties = {
  padding: '0.35rem 0.7rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
};
const btnGhost: React.CSSProperties = { ...btnBase };
const btnPrimary: React.CSSProperties = { ...btnBase, background: 'var(--color-primary)', color: '#fff', borderColor: 'transparent' };
const btnWarning: React.CSSProperties = { ...btnBase, color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' };
const btnDanger: React.CSSProperties = { ...btnBase, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' };
