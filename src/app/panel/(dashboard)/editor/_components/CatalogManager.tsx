'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Plus, Save, Trash2 } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  image_urls: string[];
  in_stock: boolean;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
};

type WhatsappNumber = { id: string; label: string; phone: string };

type Settings = {
  theme_color: string;
  whatsapp_numbers: WhatsappNumber[];
  banner_title: string | null;
  banner_subtitle: string | null;
  banner_image_url: string | null;
  store_description: string | null;
};

type Props = {
  userPlan: string;
  productLimit: number;
  categoryLimit: number;
  bannerCustomEnabled: boolean;
  featuredEnabled: boolean;
  multipleImagesEnabled: boolean;
};

type SubTab = 'products' | 'categories' | 'settings';

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  category_id: null,
  name: '',
  slug: '',
  description: '',
  price: 0,
  compare_at_price: null,
  image_url: '',
  image_urls: [],
  in_stock: true,
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

const EMPTY_CATEGORY: Omit<Category, 'id'> = {
  name: '',
  slug: '',
  sort_order: 0,
};

export function CatalogManager({
  userPlan,
  productLimit,
  categoryLimit,
  bannerCustomEnabled,
  featuredEnabled,
  multipleImagesEnabled,
}: Props) {
  const [subTab, setSubTab] = useState<SubTab>('products');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<Omit<Category, 'id'>>(EMPTY_CATEGORY);

  const [settingsDraft, setSettingsDraft] = useState<Settings>({
    theme_color: '#171717',
    whatsapp_numbers: [],
    banner_title: null,
    banner_subtitle: null,
    banner_image_url: null,
    store_description: null,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [pRes, cRes, sRes] = await Promise.all([
        fetch('/api/catalog/products'),
        fetch('/api/catalog/categories'),
        fetch('/api/catalog/settings'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      const sData = await sRes.json();
      if (!pRes.ok) throw new Error(pData.error || 'Error productos');
      setProducts(pData.products ?? []);
      setCategories(cData.categories ?? []);
      setSettingsDraft({
        theme_color: sData.settings?.theme_color ?? '#171717',
        whatsapp_numbers: sData.settings?.whatsapp_numbers ?? [],
        banner_title: sData.settings?.banner_title ?? null,
        banner_subtitle: sData.settings?.banner_subtitle ?? null,
        banner_image_url: sData.settings?.banner_image_url ?? null,
        store_description: sData.settings?.store_description ?? null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  // ────────── PRODUCTS ──────────
  function startNewProduct() {
    setEditingProductId('new');
    setProductDraft(EMPTY_PRODUCT);
  }

  function startEditProduct(p: Product) {
    setEditingProductId(p.id);
    setProductDraft({
      category_id: p.category_id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      price: p.price,
      compare_at_price: p.compare_at_price,
      image_url: p.image_url ?? '',
      image_urls: p.image_urls ?? [],
      in_stock: p.in_stock,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      is_active: p.is_active,
    });
  }

  async function saveProduct() {
    setError(null);
    const payload = {
      ...productDraft,
      description: productDraft.description || null,
      image_url: productDraft.image_url || null,
      compare_at_price: productDraft.compare_at_price ?? null,
      // Solo mandamos image_urls si está habilitado y tiene contenido.
      image_urls: multipleImagesEnabled ? productDraft.image_urls : [],
      // Solo mandamos is_featured si está habilitado.
      is_featured: featuredEnabled ? productDraft.is_featured : false,
    };
    const url =
      editingProductId === 'new'
        ? '/api/catalog/products'
        : `/api/catalog/products/${editingProductId}`;
    const method = editingProductId === 'new' ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error al guardar');
      return;
    }
    setEditingProductId(null);
    loadAll();
  }

  async function deleteProduct(id: string) {
    if (!confirm('¿Borrar este producto?')) return;
    const res = await fetch(`/api/catalog/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Error al borrar');
      return;
    }
    loadAll();
  }

  // ────────── CATEGORIES ──────────
  async function saveCategory() {
    setError(null);
    const url =
      editingCategoryId === 'new'
        ? '/api/catalog/categories'
        : `/api/catalog/categories/${editingCategoryId}`;
    const method = editingCategoryId === 'new' ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryDraft),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error al guardar');
      return;
    }
    setEditingCategoryId(null);
    setCategoryDraft(EMPTY_CATEGORY);
    loadAll();
  }

  async function deleteCategory(id: string) {
    if (!confirm('¿Borrar esta categoría? Los productos quedan sin categoría asignada.')) return;
    const res = await fetch(`/api/catalog/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Error al borrar');
      return;
    }
    loadAll();
  }

  // ────────── SETTINGS ──────────
  async function saveSettings() {
    setError(null);
    setSavingSettings(true);
    const payload: Partial<Settings> = {
      theme_color: settingsDraft.theme_color,
      whatsapp_numbers: settingsDraft.whatsapp_numbers,
      store_description: settingsDraft.store_description || null,
    };
    if (bannerCustomEnabled) {
      payload.banner_title = settingsDraft.banner_title || null;
      payload.banner_subtitle = settingsDraft.banner_subtitle || null;
      payload.banner_image_url = settingsDraft.banner_image_url || null;
    }
    const res = await fetch('/api/catalog/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSavingSettings(false);
    if (!res.ok) {
      setError(data.error || 'Error al guardar configuración');
      return;
    }
    // Refrescamos el draft con la respuesta autoritativa del servidor.
    if (data.settings) {
      setSettingsDraft({
        theme_color: data.settings.theme_color,
        whatsapp_numbers: data.settings.whatsapp_numbers ?? [],
        banner_title: data.settings.banner_title ?? null,
        banner_subtitle: data.settings.banner_subtitle ?? null,
        banner_image_url: data.settings.banner_image_url ?? null,
        store_description: data.settings.store_description ?? null,
      });
    }
  }

  function addWhatsapp() {
    if (settingsDraft.whatsapp_numbers.length >= 3) return;
    setSettingsDraft((prev) => ({
      ...prev,
      whatsapp_numbers: [
        ...prev.whatsapp_numbers,
        {
          id: `w${Date.now()}`,
          label: 'Ventas',
          phone: '',
        },
      ],
    }));
  }

  function updateWhatsapp(idx: number, patch: Partial<WhatsappNumber>) {
    setSettingsDraft((prev) => ({
      ...prev,
      whatsapp_numbers: prev.whatsapp_numbers.map((w, i) => (i === idx ? { ...w, ...patch } : w)),
    }));
  }

  function removeWhatsapp(idx: number) {
    setSettingsDraft((prev) => ({
      ...prev,
      whatsapp_numbers: prev.whatsapp_numbers.filter((_, i) => i !== idx),
    }));
  }

  const productsUsed = products.length;
  const categoriesUsed = categories.length;
  const canCreateProduct = productLimit === Infinity || productsUsed < productLimit;
  const canCreateCategory = categoryLimit === Infinity || categoriesUsed < categoryLimit;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando catálogo…
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {(['products', 'categories', 'settings'] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${subTab === t ? 'var(--color-primary)' : 'transparent'}`,
              color: subTab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            {t === 'products' && 'Productos'}
            {t === 'categories' && 'Categorías'}
            {t === 'settings' && 'Configuración'}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* ─── PRODUCTS ─── */}
      {subTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {productsUsed} de {productLimit === Infinity ? '∞' : productLimit} productos
            </div>
            {canCreateProduct && editingProductId === null && (
              <button onClick={startNewProduct} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Plus size={14} /> Nuevo producto
              </button>
            )}
          </div>

          {editingProductId !== null && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-dark-secondary)' }}>
              <ProductForm
                draft={productDraft}
                setDraft={setProductDraft}
                categories={categories}
                featuredEnabled={featuredEnabled}
                multipleImagesEnabled={multipleImagesEnabled}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={saveProduct} className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={14} /> Guardar
                </button>
                <button onClick={() => setEditingProductId(null)} className="btn-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {products.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Todavía no cargaste productos.
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-dark-secondary)', borderRadius: '10px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.name}</strong>
                      {!p.in_stock && <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>SIN STOCK</span>}
                      {p.is_featured && <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>DESTACADO</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      ${p.price.toLocaleString('es-AR')}
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span style={{ textDecoration: 'line-through', marginLeft: '0.5rem', opacity: 0.6 }}>
                          ${p.compare_at_price.toLocaleString('es-AR')}
                        </span>
                      )}
                      {' · '}/{p.slug}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => startEditProduct(p)} className="btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
                      Editar
                    </button>
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: '0.35rem 0.55rem', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }} aria-label="Borrar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── CATEGORIES ─── */}
      {subTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {categoriesUsed} de {categoryLimit === Infinity ? '∞' : categoryLimit} categorías
            </div>
            {canCreateCategory && editingCategoryId === null && (
              <button onClick={() => { setEditingCategoryId('new'); setCategoryDraft(EMPTY_CATEGORY); }} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Plus size={14} /> Nueva categoría
              </button>
            )}
          </div>

          {editingCategoryId !== null && (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-dark-secondary)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Field label="Nombre">
                <input
                  type="text"
                  value={categoryDraft.name}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })}
                  maxLength={60}
                  style={inputStyle}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  type="text"
                  value={categoryDraft.slug}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="indumentaria"
                  style={inputStyle}
                />
              </Field>
              <Field label="Orden">
                <input
                  type="number"
                  min={0}
                  value={categoryDraft.sort_order}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, sort_order: parseInt(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </Field>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={saveCategory} className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={14} /> Guardar
                </button>
                <button onClick={() => { setEditingCategoryId(null); setCategoryDraft(EMPTY_CATEGORY); }} className="btn-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No hay categorías todavía.
              </div>
            ) : (
              categories.map((c) => (
                <div key={c.id} style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-dark-secondary)', borderRadius: '10px', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{c.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/{c.slug}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => { setEditingCategoryId(c.id); setCategoryDraft({ name: c.name, slug: c.slug, sort_order: c.sort_order }); }} className="btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                      Editar
                    </button>
                    <button onClick={() => deleteCategory(c.id)} style={{ padding: '0.3rem 0.55rem', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── SETTINGS ─── */}
      {subTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Field label="Color de marca (theme)">
            <input
              type="color"
              value={settingsDraft.theme_color}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, theme_color: e.target.value })}
              style={{ width: '60px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>{settingsDraft.theme_color}</span>
          </Field>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Números de WhatsApp para recibir pedidos
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {settingsDraft.whatsapp_numbers.map((w, i) => (
                <div key={w.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={w.label}
                    onChange={(e) => updateWhatsapp(i, { label: e.target.value })}
                    placeholder="Etiqueta (Ventas)"
                    maxLength={40}
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                  />
                  <input
                    type="text"
                    value={w.phone}
                    onChange={(e) => updateWhatsapp(i, { phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="5492235922077"
                    style={{ ...inputStyle, flex: '2 1 200px' }}
                  />
                  <button onClick={() => removeWhatsapp(i)} style={{ padding: '0.5rem 0.6rem', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {settingsDraft.whatsapp_numbers.length < 3 && (
                <button onClick={addWhatsapp} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={14} /> Agregar número
                </button>
              )}
            </div>
          </div>

          <Field label="Descripción de la tienda (footer)">
            <textarea
              value={settingsDraft.store_description ?? ''}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, store_description: e.target.value })}
              maxLength={500}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          {bannerCustomEnabled ? (
            <>
              <Field label="Banner – Título principal">
                <input
                  type="text"
                  value={settingsDraft.banner_title ?? ''}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, banner_title: e.target.value })}
                  maxLength={120}
                  style={inputStyle}
                />
              </Field>
              <Field label="Banner – Subtítulo">
                <input
                  type="text"
                  value={settingsDraft.banner_subtitle ?? ''}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, banner_subtitle: e.target.value })}
                  maxLength={200}
                  style={inputStyle}
                />
              </Field>
              <Field label="Banner – Imagen de fondo (URL)">
                <input
                  type="url"
                  value={settingsDraft.banner_image_url ?? ''}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, banner_image_url: e.target.value })}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </Field>
            </>
          ) : (
            <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>
              El banner personalizado (título, subtítulo, imagen) es exclusivo del plan Extremo.
            </div>
          )}

          <div>
            <button
              onClick={saveSettings}
              disabled={savingSettings}
              className="btn-primary"
              style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={15} />
              {savingSettings ? 'Guardando…' : 'Guardar configuración'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Plan actual: <strong style={{ color: 'var(--text-primary)' }}>{userPlan}</strong>. Pro = 50 productos / 10 categorías. Extremo = ilimitado + banner custom + destacados + galería de imágenes.
      </div>
    </div>
  );
}

// ──────────── Subcomponentes ────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  background: 'var(--bg-dark)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ProductForm({
  draft,
  setDraft,
  categories,
  featuredEnabled,
  multipleImagesEnabled,
}: {
  draft: Omit<Product, 'id'>;
  setDraft: (next: Omit<Product, 'id'>) => void;
  categories: Category[];
  featuredEnabled: boolean;
  multipleImagesEnabled: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
        <Field label="Nombre">
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            type="text"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="Descripción">
        <textarea
          value={draft.description ?? ''}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          maxLength={5000}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
        <Field label="Precio">
          <input
            type="number"
            min={0}
            step={0.01}
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })}
            style={inputStyle}
          />
        </Field>
        <Field label="Precio anterior (opcional)">
          <input
            type="number"
            min={0}
            step={0.01}
            value={draft.compare_at_price ?? ''}
            onChange={(e) => setDraft({ ...draft, compare_at_price: e.target.value ? parseFloat(e.target.value) : null })}
            style={inputStyle}
          />
        </Field>
        <Field label="Categoría">
          <select
            value={draft.category_id ?? ''}
            onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })}
            style={inputStyle}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Imagen principal (URL https://…)">
        <input
          type="url"
          value={draft.image_url ?? ''}
          onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
          placeholder="https://..."
          style={inputStyle}
        />
      </Field>

      {multipleImagesEnabled && (
        <Field label="Imágenes adicionales (una URL por línea, hasta 8)">
          <textarea
            value={(draft.image_urls ?? []).join('\n')}
            onChange={(e) => setDraft({ ...draft, image_urls: e.target.value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8) })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={draft.in_stock}
            onChange={(e) => setDraft({ ...draft, in_stock: e.target.checked })}
          />
          En stock
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Publicado
        </label>
        {featuredEnabled && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={draft.is_featured}
              onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
            />
            Destacado
          </label>
        )}
      </div>
    </div>
  );
}
