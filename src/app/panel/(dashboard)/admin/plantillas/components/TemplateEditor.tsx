'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Template = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  plan_required: string;
  min_plan: string | null;
  is_active: boolean;
  sort_order: number;
  tags: string[];
};

const CATEGORIES = ['restaurant', 'portfolio', 'ecommerce', 'landing', 'services'];
const PLANS = ['basic', 'pro', 'extremo'];

export default function TemplateEditor({
  template,
  usageCount,
}: {
  template: Template;
  usageCount: number;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Template>(template);
  const [tagsText, setTagsText] = useState(template.tags?.join(', ') ?? '');

  async function save() {
    setBusy(true);
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const res = await fetch(`/api/admin/plantillas/${template.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: draft.name,
        description: draft.description || null,
        category: draft.category,
        plan_required: draft.plan_required,
        min_plan: draft.min_plan || null,
        thumbnail_url: draft.thumbnail_url || null,
        preview_url: draft.preview_url || null,
        sort_order: draft.sort_order,
        is_active: draft.is_active,
        tags,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error al guardar');
      return;
    }
    setExpanded(false);
    router.refresh();
  }

  async function toggleActive() {
    setBusy(true);
    const res = await fetch(`/api/admin/plantillas/${template.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !template.is_active }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    router.refresh();
  }

  async function deleteTemplate() {
    if (!confirm(`¿Eliminar la plantilla "${template.name}"? Solo posible si no la usa ningún sitio.`)) {
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/plantillas/${template.id}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Error');
      return;
    }
    router.refresh();
  }

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{template.name}</span>
            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
              {template.plan_required}
            </span>
            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(100,116,139,0.15)', color: 'var(--text-secondary)' }}>
              {template.category}
            </span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: template.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: template.is_active ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {template.is_active ? 'ACTIVA' : 'INACTIVA'}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {usageCount} sitios la usan · slug: {template.slug} · orden: {template.sort_order}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button disabled={busy} onClick={toggleActive} className="btn-ghost">
            {template.is_active ? 'Desactivar' : 'Activar'}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost">
            {expanded ? 'Cerrar' : 'Editar'}
          </button>
          <button disabled={busy} onClick={deleteTemplate} className="btn-danger">
            Eliminar
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Field label="Nombre">
            <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input-base" maxLength={120} />
          </Field>
          <Field label="Categoría">
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input-base">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Plan requerido (gallery)">
            <select value={draft.plan_required} onChange={(e) => setDraft({ ...draft, plan_required: e.target.value })} className="input-base">
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Plan mínimo extra (opcional)">
            <select value={draft.min_plan ?? ''} onChange={(e) => setDraft({ ...draft, min_plan: e.target.value || null })} className="input-base">
              <option value="">— ninguno —</option>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Orden">
            <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })} className="input-base" min={0} max={9999} />
          </Field>
          <Field label="Thumbnail URL">
            <input type="url" value={draft.thumbnail_url ?? ''} onChange={(e) => setDraft({ ...draft, thumbnail_url: e.target.value })} className="input-base" placeholder="https://..." />
          </Field>
          <Field label="Preview URL">
            <input type="url" value={draft.preview_url ?? ''} onChange={(e) => setDraft({ ...draft, preview_url: e.target.value })} className="input-base" placeholder="https://..." />
          </Field>
          <Field label="Tags (separadas por coma)">
            <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="input-base" placeholder="gastronomia, premium, dark" />
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Descripción">
              <textarea value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-base" style={{ resize: 'vertical', minHeight: '70px' }} maxLength={1000} />
            </Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button disabled={busy} onClick={save} className="btn-action-primary">
              {busy ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
