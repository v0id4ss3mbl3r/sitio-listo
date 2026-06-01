'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { THEME_LIST } from '@/lib/themes';

type Props = {
  siteId: string;
  subdomain: string;
  customDomain: string | null;
  isActive: boolean;
  isBanned: boolean;
  themeId: string | null;
};

export default function SiteActions({
  siteId,
  subdomain,
  customDomain,
  isActive,
  isBanned,
  themeId,
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

  async function changeTheme(value: string) {
    // '' = volver al default de la plantilla (theme_id null).
    await patch({ theme_id: value || null });
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
          className="input-base"
        />
        <input
          type="text"
          value={draftCustom}
          onChange={(e) => setDraftCustom(e.target.value)}
          placeholder="dominio.com (opcional)"
          className="input-base"
        />
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button disabled={busy} onClick={saveDomains} className="btn-action-primary">
            Guardar
          </button>
          <button onClick={() => setEditing(false)} className="btn-ghost">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <select
        value={themeId ?? ''}
        disabled={busy}
        onChange={(e) => changeTheme(e.target.value)}
        className="input-base"
        title="Tema visual del sitio"
        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto', minWidth: '130px' }}
      >
        <option value="">Tema: default</option>
        {THEME_LIST.map((t) => (
          <option key={t.id} value={t.id}>
            Tema: {t.label}
          </option>
        ))}
      </select>
      <button disabled={busy} onClick={toggleActive} className="btn-ghost">
        {isActive ? 'Desactivar' : 'Activar'}
      </button>
      <button onClick={() => setEditing(true)} className="btn-ghost">
        Dominio
      </button>
      <button disabled={busy} onClick={toggleBan} className={isBanned ? 'btn-ghost' : 'btn-warning'}>
        {isBanned ? 'Desbanear' : 'Banear'}
      </button>
      <button disabled={busy} onClick={deleteSite} className="btn-danger">
        Eliminar
      </button>
    </div>
  );
}
