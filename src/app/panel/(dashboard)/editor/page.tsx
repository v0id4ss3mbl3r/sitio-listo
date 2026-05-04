'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';

const TEMPLATES = [
  { id: 'restaurant-01', name: 'Restaurante Clásico', type: 'restaurant', plan: 'basic' },
  { id: 'portfolio-01', name: 'Portfolio Minimalista', type: 'portfolio', plan: 'basic' },
  { id: 'ecommerce-01', name: 'Tienda Avanzada', type: 'ecommerce', plan: 'pro' },
];

export default function EditorPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Editor State
  const [subdomain, setSubdomain] = useState('');
  const [templateId, setTemplateId] = useState('restaurant-01');
  const [siteName, setSiteName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar suscripción
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      setSubscription(subData);

      // Cargar sitio actual
      const res = await fetch('/api/sites');
      const data = await res.json();
      
      if (data.site) {
        setSubdomain(data.site.subdomain);
        setTemplateId(data.site.template_id);
        setSiteName(data.site.config?.name || '');
        setPrimaryColor(data.site.config?.primaryColor || '#6366f1');
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          template_id: templateId,
          config: {
            name: siteName,
            primaryColor,
          }
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert('Sitio guardado y publicado correctamente!');
      }
    } catch (error) {
      alert('Error al guardar el sitio');
    } finally {
      setSaving(false);
    }
  };

  const userPlan = subscription?.status === 'authorized' ? subscription.plan_type : 'free';

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando editor...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Editor Visual
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configurá la apariencia y el dominio de tu sitio.</p>
      </header>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Identidad del Sitio */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Identidad del Sitio</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Nombre del Sitio
              </label>
              <input 
                type="text" 
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Ej: Mi Restaurante Increíble"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Color Principal
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{ width: '50px', height: '50px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>{primaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subdominio */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Dominio web</h2>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Elegí tu subdominio (solo letras, números y guiones)
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="mitienda"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px 0 0 8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
                required
              />
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderLeft: 'none', borderRadius: '0 8px 8px 0', color: 'var(--text-muted)' }}>
                .sitiolisto.com.ar
              </div>
            </div>
          </div>
        </div>

        {/* Plantilla */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Seleccionar Plantilla</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {TEMPLATES.map(tpl => {
              const isLocked = tpl.plan === 'pro' && userPlan !== 'pro' && userPlan !== 'agency';
              const isSelected = templateId === tpl.id;

              return (
                <div 
                  key={tpl.id}
                  onClick={() => !isLocked && setTemplateId(tpl.id)}
                  style={{
                    padding: '1.5rem 1rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-dark-secondary)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.6 : 1,
                    position: 'relative',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLocked && (
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#f59e0b', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '10px' }}>
                      PRO
                    </div>
                  )}
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{tpl.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tpl.type.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
          {userPlan !== 'pro' && userPlan !== 'agency' && (
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#f59e0b' }}>
              Para desbloquear las plantillas PRO necesitás mejorar tu suscripción.
            </p>
          )}
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          {subdomain && (
            <a 
              href={`http://${subdomain}.localhost:3000`} 
              target="_blank" 
              rel="noreferrer"
              className="btn-outline"
            >
              Ver sitio local
            </a>
          )}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : 'Guardar y Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
