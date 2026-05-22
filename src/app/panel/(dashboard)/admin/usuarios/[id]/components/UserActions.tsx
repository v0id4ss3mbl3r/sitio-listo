'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  userId: string;
  email: string;
  isBlocked: boolean;
  isAdmin: boolean;
};

type Modal = null | 'block' | 'notify' | 'setPassword';

export default function UserActions({ userId, email, isBlocked, isAdmin }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<Modal>(null);

  async function call(url: string, init: RequestInit) {
    setBusy(true);
    const res = await fetch(url, init);
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return false;
    }
    return true;
  }

  async function unblock() {
    const ok = await call(`/api/admin/usuarios/${userId}/block`, { method: 'DELETE' });
    if (ok) router.refresh();
  }

  async function resetPassword() {
    if (!confirm(`Mandar email de recuperación a ${email}?`)) return;
    const ok = await call(`/api/admin/usuarios/${userId}/reset-password`, { method: 'POST' });
    if (ok) alert('Email enviado (si SMTP está configurado en Supabase).');
  }

  async function deleteUser() {
    const confirmation = prompt(`Para eliminar la cuenta de ${email} y todos sus datos, escribí "ELIMINAR":`);
    if (confirmation !== 'ELIMINAR') return;
    const ok = await call(`/api/admin/usuarios/${userId}`, { method: 'DELETE' });
    if (ok) router.push('/admin/usuarios');
  }

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      <button disabled={busy} onClick={() => setModal('notify')} className="btn-action-primary">
        Notificar
      </button>
      {isBlocked ? (
        <button disabled={busy} onClick={unblock} className="btn-ghost">
          Desbloquear
        </button>
      ) : (
        <button disabled={busy || isAdmin} onClick={() => setModal('block')} className="btn-warning" title={isAdmin ? 'No podés bloquear a un admin' : ''}>
          Bloquear
        </button>
      )}
      <button disabled={busy} onClick={resetPassword} className="btn-ghost">
        Reset pass (email)
      </button>
      <button disabled={busy || isAdmin} onClick={() => setModal('setPassword')} className="btn-warning" title={isAdmin ? 'No podés setear pass de un admin' : ''}>
        Setear pass
      </button>
      <button disabled={busy || isAdmin} onClick={deleteUser} className="btn-danger" title={isAdmin ? 'No podés eliminar un admin' : ''}>
        Eliminar
      </button>

      {modal === 'block' && (
        <BlockModal
          userId={userId}
          email={email}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal === 'notify' && (
        <NotifyModal
          userId={userId}
          email={email}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal === 'setPassword' && (
        <SetPasswordModal
          userId={userId}
          email={email}
          onClose={() => setModal(null)}
          onSuccess={() => setModal(null)}
        />
      )}
    </div>
  );
}

function BlockModal({
  userId,
  email,
  onClose,
  onSuccess,
}: {
  userId: string;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(`/api/admin/usuarios/${userId}/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ until }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    onSuccess();
  }

  const presets = [
    { label: '1 día', value: 1 },
    { label: '7 días', value: 7 },
    { label: '30 días', value: 30 },
    { label: '1 año', value: 365 },
    { label: 'Permanente', value: 365 * 100 },
  ];

  return (
    <Modal title={`Bloquear ${email}`} onClose={onClose}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        El usuario no podrá acceder al panel hasta que termine el período.
      </p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => setDays(p.value)}
            className={days === p.value ? 'btn-action-primary' : 'btn-ghost'}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Días personalizados:</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value) || 1)}
          min={1}
          max={36500}
          className="input-base"
          style={{ width: '100px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-ghost">
          Cancelar
        </button>
        <button disabled={busy} onClick={submit} className="btn-warning">
          Bloquear {days} día{days === 1 ? '' : 's'}
        </button>
      </div>
    </Modal>
  );
}

function NotifyModal({
  userId,
  email,
  onClose,
  onSuccess,
}: {
  userId: string;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!title || !body) {
      alert('Título y mensaje son obligatorios');
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/usuarios/${userId}/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    onSuccess();
  }

  return (
    <Modal title={`Notificar a ${email}`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-base" maxLength={120} />
        </div>
        <div>
          <label style={labelStyle}>Mensaje</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="input-base" style={{ minHeight: '120px', resize: 'vertical' }} maxLength={2000} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-ghost">
          Cancelar
        </button>
        <button disabled={busy} onClick={submit} className="btn-action-primary">
          Enviar notificación
        </button>
      </div>
    </Modal>
  );
}

function SetPasswordModal({
  userId,
  email,
  onClose,
  onSuccess,
}: {
  userId: string;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirm2, setConfirm2] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (password.length < 8) {
      alert('Mínimo 8 caracteres');
      return;
    }
    if (password !== confirm2) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!confirm(`¿Cambiar la contraseña de ${email}? Tenés acceso a la cuenta del usuario.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/usuarios/${userId}/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    alert('Contraseña actualizada.');
    onSuccess();
  }

  return (
    <Modal title={`Setear contraseña de ${email}`} onClose={onClose}>
      <div style={{ padding: '0.85rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
        Operación sensible. Vas a quedar con conocimiento de la nueva pass del usuario.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Nueva contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-base" minLength={8} maxLength={72} />
        </div>
        <div>
          <label style={labelStyle}>Repetir contraseña</label>
          <input type="password" value={confirm2} onChange={(e) => setConfirm2(e.target.value)} className="input-base" minLength={8} maxLength={72} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-ghost">
          Cancelar
        </button>
        <button disabled={busy} onClick={submit} className="btn-warning">
          Setear contraseña
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ padding: '1.5rem', width: '100%', maxWidth: '480px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.35rem',
};
