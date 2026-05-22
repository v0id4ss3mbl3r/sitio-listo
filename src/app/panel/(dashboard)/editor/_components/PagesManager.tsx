'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';

type Page = {
  id: string;
  slug: string;
  title: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  is_home: boolean;
  sort_order: number;
  is_published: boolean;
};

type Props = {
  userPlan: string;
  limit: number;
};

export function PagesManager({ userPlan, limit }: Props) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftPublished, setDraftPublished] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  async function reload() {
    setLoading(true);
    const res = await fetch('/api/pages');
    const data = await res.json();
    setPages(data.pages ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // Patrón estándar de carga inicial: dispara un fetch que escribe state
    // cuando termina. La regla react-hooks/set-state-in-effect no lo
    // distingue del caso problemático (setState síncrono).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, []);

  async function handleCreate() {
    setError(null);
    if (!newSlug || !newTitle) {
      setError('Ingresá un slug y un título.');
      return;
    }
    setCreating(true);
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: newSlug,
        title: newTitle,
        content: { body: '' },
        is_published: true,
      }),
    });
    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No pudimos crear la página.');
      return;
    }

    setNewSlug('');
    setNewTitle('');
    reload();
  }

  function startEditing(p: Page) {
    setEditingId(p.id);
    setDraftTitle(p.title ?? '');
    setDraftBody(typeof p.content?.body === 'string' ? p.content.body : '');
    setDraftPublished(p.is_published);
    setError(null);
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    setSavingEdit(true);
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: draftTitle,
        content: { body: draftBody },
        is_published: draftPublished,
      }),
    });
    setSavingEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No pudimos guardar los cambios.');
      return;
    }
    setEditingId(null);
    reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Borrar esta página? No se puede deshacer.')) return;
    setError(null);
    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No pudimos borrar la página.');
      return;
    }
    if (editingId === id) setEditingId(null);
    reload();
  }

  const used = pages.length;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);
  const canCreate = remaining > 0 && userPlan !== 'basic';

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Páginas del sitio</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Usadas {used} de {limit === Infinity ? '∞' : limit}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando…</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {pages.map((p) => (
              <div
                key={p.id}
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-dark-secondary)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {p.title || p.slug || 'Inicio'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        /{p.slug} {p.is_home && '· home'} {!p.is_published && '· borrador'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!p.is_home && (
                      <>
                        <button
                          onClick={() => startEditing(p)}
                          className="btn-outline"
                          style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn-icon danger"
                          aria-label="Borrar página"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    {p.is_home && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.4rem 0.6rem' }}>
                        Se edita en las pestañas Apariencia y Contenido
                      </span>
                    )}
                  </div>
                </div>

                {editingId === p.id && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Título</label>
                      <input
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        maxLength={120}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Contenido</label>
                      <textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        rows={6}
                        maxLength={5000}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={draftPublished}
                        onChange={(e) => setDraftPublished(e.target.checked)}
                      />
                      Página publicada
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleSaveEdit(p.id)}
                        disabled={savingEdit}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Save size={14} />
                        {savingEdit ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-outline"
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            {userPlan === 'basic' ? (
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>
                El plan Básico incluye solo la página principal. Subí a Pro para sumar más secciones.
              </p>
            ) : !canCreate ? (
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>
                Alcanzaste el límite de páginas de tu plan. Borrá o despublicá alguna, o subí a un plan superior.
              </p>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 160px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Slug</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="contacto"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: '2 1 220px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Título</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contactanos"
                    maxLength={120}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  {creating ? 'Creando…' : 'Crear página'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
