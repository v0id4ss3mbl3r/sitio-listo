'use client';

import { Bell, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Notification = {
  id: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

const POLL_INTERVAL_MS = 60_000; // refresh cada 1 min

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function reload() {
    setLoading(true);
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const data = await res.json();
      setItems(data.notifications ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
    const t = setInterval(reload, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function markOne(id: string) {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }

  async function markAll() {
    await fetch('/api/notifications', { method: 'PATCH' });
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
  }

  const unreadCount = items.filter((n) => !n.read_at).length;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          padding: '0.5rem',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '999px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'min(360px, 90vw)',
            maxHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.85rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Notificaciones</strong>
            {unreadCount > 0 && (
              <button
                onClick={markAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary-light, #6366f1)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Marcar todas
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && items.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Cargando…
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No tenés notificaciones todavía.
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read_at && markOne(n.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: n.read_at ? 'default' : 'pointer',
                    background: n.read_at ? 'transparent' : 'rgba(99,102,241,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{n.title}</strong>
                    {n.read_at && <Check size={12} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {n.body}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {new Date(n.created_at).toLocaleString('es-AR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
