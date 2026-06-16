'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Plus, Save, Trash2, X } from 'lucide-react';

import { SITE_ITEM_KIND_LABELS, type SiteItemKind } from '@/lib/constants';

type Item = {
  id: string;
  kind: SiteItemKind;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number | null;
  image_url: string | null;
  meta: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
};

type Draft = {
  id?: string;
  kind: SiteItemKind;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image_url: string;
  meta: Record<string, unknown>;
};

type FieldType = 'text' | 'number' | 'url' | 'textarea' | 'features';
type FieldDef = { key: string; label: string; type: FieldType; meta?: boolean; placeholder?: string };

// Qué campos mostrar por kind. Los `meta:true` van a item.meta (jsonb).
const KIND_FIELDS: Record<SiteItemKind, FieldDef[]> = {
  gallery: [
    { key: 'image_url', label: 'URL de la foto', type: 'url', placeholder: 'https://…' },
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'subtitle', label: 'Epígrafe (opcional)', type: 'text' },
  ],
  service: [
    { key: 'title', label: 'Servicio', type: 'text' },
    { key: 'price', label: 'Precio', type: 'number' },
    { key: 'duration', label: 'Duración (ej: 45 min)', type: 'text', meta: true },
    { key: 'description', label: 'Descripción', type: 'textarea' },
    { key: 'image_url', label: 'Imagen (opcional)', type: 'url', placeholder: 'https://…' },
  ],
  plan: [
    { key: 'title', label: 'Plan', type: 'text' },
    { key: 'price', label: 'Precio', type: 'number' },
    { key: 'period', label: 'Período (ej: /mes)', type: 'text', meta: true },
    { key: 'features', label: 'Beneficios (uno por línea)', type: 'features', meta: true },
    { key: 'description', label: 'Descripción (opcional)', type: 'textarea' },
  ],
  schedule: [
    { key: 'title', label: 'Clase / actividad', type: 'text' },
    { key: 'day', label: 'Día', type: 'text', meta: true },
    { key: 'time', label: 'Horario (ej: 18:00–19:00)', type: 'text', meta: true },
    { key: 'instructor', label: 'Profe (opcional)', type: 'text', meta: true },
  ],
  feature: [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'description', label: 'Descripción', type: 'textarea' },
    { key: 'image_url', label: 'Imagen (opcional)', type: 'url', placeholder: 'https://…' },
    { key: 'price', label: 'Precio (opcional)', type: 'number' },
  ],
};

function emptyDraft(kind: SiteItemKind): Draft {
  return { kind, title: '', subtitle: '', description: '', price: '', image_url: '', meta: {} };
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  background: 'var(--bg-dark-secondary)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '0.9rem',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  marginBottom: '0.35rem',
  color: 'var(--text-secondary)',
};

export function CollectionManager({
  kinds,
  itemLimit,
}: {
  kinds: SiteItemKind[];
  itemLimit: number;
}) {
  const [activeKind, setActiveKind] = useState<SiteItemKind>(kinds[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content/items');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar');
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Carga inicial desde la API; el setState está encapsulado en load().
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const kindItems = items.filter((i) => i.kind === activeKind);
  const totalCount = items.length;
  const atLimit = totalCount >= itemLimit;

  function startEdit(item: Item) {
    setDraft({
      id: item.id,
      kind: item.kind,
      title: item.title,
      subtitle: item.subtitle ?? '',
      description: item.description ?? '',
      price: item.price != null ? String(item.price) : '',
      image_url: item.image_url ?? '',
      meta: { ...(item.meta ?? {}) },
    });
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = {
        kind: draft.kind,
        title: draft.title.trim(),
        subtitle: draft.subtitle.trim() || null,
        description: draft.description.trim() || null,
        price: draft.price.trim() === '' ? null : Number(draft.price),
        image_url: draft.image_url.trim() || null,
        meta: draft.meta,
      };
      const url = draft.id ? `/api/content/items/${draft.id}` : '/api/content/items';
      const method = draft.id ? 'PUT' : 'POST';
      // En PUT no se manda kind (no cambia).
      const payload = draft.id ? { ...body, kind: undefined } : body;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar');
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('¿Borrar este elemento?')) return;
    setError(null);
    const res = await fetch(`/api/content/items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No se pudo borrar');
      return;
    }
    await load();
  }

  function setField(f: FieldDef, value: unknown) {
    if (!draft) return;
    if (f.type === 'features') {
      setDraft({ ...draft, meta: { ...draft.meta, [f.key]: value } });
    } else if (f.meta) {
      setDraft({ ...draft, meta: { ...draft.meta, [f.key]: value } });
    } else {
      setDraft({ ...draft, [f.key]: value } as Draft);
    }
  }

  function getField(f: FieldDef): string {
    if (!draft) return '';
    if (f.meta) {
      const v = draft.meta[f.key];
      if (f.type === 'features') return Array.isArray(v) ? (v as string[]).join('\n') : '';
      return typeof v === 'string' ? v : '';
    }
    return (draft as unknown as Record<string, string>)[f.key] ?? '';
  }

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Contenido
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Cargá y ordená el contenido que se muestra en tu sitio. Límite del plan:{' '}
        {itemLimit === Infinity ? 'ilimitado' : `${totalCount}/${itemLimit}`} ítems.
      </p>

      {/* Sub-tabs por kind */}
      {kinds.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => { setActiveKind(k); setDraft(null); }}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${activeKind === k ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                background: activeKind === k ? 'rgba(139,111,63,0.08)' : 'transparent',
                color: activeKind === k ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {SITE_ITEM_KIND_LABELS[k]}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando…</p>
      ) : (
        <>
          {/* Lista de items del kind activo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {kindItems.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Todavía no cargaste {SITE_ITEM_KIND_LABELS[activeKind].toLowerCase()}.
              </p>
            )}
            {kindItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </div>
                  {item.price != null && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price.toLocaleString('es-AR')}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button onClick={() => startEdit(item)} className="btn-ghost" style={{ fontSize: '0.8rem' }}>Editar</button>
                  <button onClick={() => remove(item.id)} className="btn-ghost" style={{ color: '#ef4444' }} title="Borrar">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form de alta/edición */}
          {draft && draft.kind === activeKind ? (
            <div style={{ padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {draft.id ? 'Editar' : 'Nuevo'} — {SITE_ITEM_KIND_LABELS[activeKind]}
                </strong>
                <button onClick={() => setDraft(null)} className="btn-ghost" title="Cerrar"><X size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {KIND_FIELDS[activeKind].map((f) => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    {f.type === 'textarea' || f.type === 'features' ? (
                      <textarea
                        value={getField(f)}
                        onChange={(e) =>
                          setField(f, f.type === 'features' ? e.target.value.split('\n').filter(Boolean) : e.target.value)
                        }
                        placeholder={f.placeholder}
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'}
                        value={getField(f)}
                        onChange={(e) => setField(f, e.target.value)}
                        placeholder={f.placeholder}
                        style={inputStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary"
                style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: saving ? 0.6 : 1 }}
              >
                <Save size={15} /> {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => !atLimit && setDraft(emptyDraft(activeKind))}
              disabled={atLimit}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: atLimit ? 0.5 : 1, cursor: atLimit ? 'not-allowed' : 'pointer' }}
              title={atLimit ? 'Alcanzaste el límite de tu plan' : ''}
            >
              <Plus size={15} /> Agregar {SITE_ITEM_KIND_LABELS[activeKind].toLowerCase()}
            </button>
          )}
        </>
      )}
    </div>
  );
}
