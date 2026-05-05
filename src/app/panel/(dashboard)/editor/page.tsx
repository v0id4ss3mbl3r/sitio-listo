'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';

const TEMPLATES = [
  { id: 'restaurant-01', name: 'Restaurante Clásico', type: 'restaurant', plan: 'basic' },
  { id: 'portfolio-01', name: 'Portfolio Minimalista', type: 'portfolio', plan: 'basic' },
  { id: 'ecommerce-01', name: 'Tienda Avanzada', type: 'ecommerce', plan: 'pro' },
];

type TabType = 'appearance' | 'content' | 'domain';

export default function EditorPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  
  // Editor State
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [templateId, setTemplateId] = useState('restaurant-01');
  const [siteName, setSiteName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  
  // Content State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutText, setAboutText] = useState('');

  // Validation State
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      setSubscription(subData);

      const res = await fetch('/api/sites');
      const data = await res.json();
      
      if (data.site) {
        setSubdomain(data.site.subdomain || '');
        setCustomDomain(data.site.custom_domain || '');
        setTemplateId(data.site.template_id || 'restaurant-01');
        setSiteName(data.site.config?.name || '');
        setPrimaryColor(data.site.config?.primaryColor || '#6366f1');
        
        // Content
        setHeroTitle(data.site.config?.content?.heroTitle || '');
        setHeroSubtitle(data.site.config?.content?.heroSubtitle || '');
        setAboutText(data.site.config?.content?.aboutText || '');

        setSubdomainStatus('available'); // Si ya tiene su sitio, asumimos disponible
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  // Debounce para checkear subdominio
  useEffect(() => {
    if (!subdomain) {
      setSubdomainStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setSubdomainStatus('checking');
      try {
        const res = await fetch(`/api/sites/check?subdomain=${subdomain}`);
        const data = await res.json();
        setSubdomainStatus(data.available ? 'available' : 'taken');
      } catch (err) {
        setSubdomainStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          custom_domain: customDomain.toLowerCase().trim() || null,
          template_id: templateId,
          config: {
            name: siteName,
            primaryColor,
            content: {
              heroTitle,
              heroSubtitle,
              aboutText
            }
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
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', opacity: 0.7, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        <div style={{ height: '40px', width: '30%', background: 'var(--bg-card)', borderRadius: '8px', marginBottom: '2rem' }}></div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ height: '40px', width: '120px', background: 'var(--bg-card)', borderRadius: '8px' }}></div>
          <div style={{ height: '40px', width: '120px', background: 'var(--bg-card)', borderRadius: '8px' }}></div>
          <div style={{ height: '40px', width: '120px', background: 'var(--bg-card)', borderRadius: '8px' }}></div>
        </div>
        <div style={{ height: '200px', width: '100%', background: 'var(--bg-card)', borderRadius: '12px', marginBottom: '2rem' }}></div>
        <div style={{ height: '300px', width: '100%', background: 'var(--bg-card)', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Editor Visual
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Configurá la apariencia y el dominio de tu sitio.</p>
        </div>
        <div className="flex gap-3">
          {subdomain && subdomainStatus === 'available' && (
            <a 
              href={process.env.NODE_ENV === 'production' ? `https://${subdomain}.sitiolisto.com.ar` : `http://${subdomain}.localhost:3000`} 
              target="_blank" 
              rel="noreferrer"
              className="btn-outline flex-1 sm:flex-none text-center py-2.5 px-6"
            >
              Ver sitio
            </a>
          )}
          <button 
            onClick={handleSave} 
            disabled={saving || subdomainStatus === 'taken'} 
            className="btn-primary flex-1 sm:flex-none py-2.5 px-6"
          >
            {saving ? 'Guardando...' : 'Guardar y Publicar'}
          </button>
        </div>
      </header>

      {/* Tabs con scroll horizontal en móvil */}
      <div className="flex gap-2 border-b border-[var(--border-subtle)] mb-10 overflow-x-auto no-scrollbar scroll-smooth">
        {(['appearance', 'content', 'domain'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap px-6 py-4 border-b-2 font-bold transition-all text-sm uppercase tracking-widest
              ${activeTab === tab 
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                : 'border-transparent text-[var(--text-secondary)] opacity-60 hover:opacity-100'}
            `}
          >
            {tab === 'appearance' && 'Apariencia'}
            {tab === 'content' && 'Contenido'}
            {tab === 'domain' && 'Dominio'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* TAB: APARIENCIA */}
        {activeTab === 'appearance' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Identidad del Sitio</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nombre del Sitio / Marca</label>
                  <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Ej: Mi Restaurante Increíble" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Color Principal</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '50px', height: '50px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }} />
                    <span style={{ color: 'var(--text-muted)' }}>{primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Seleccionar Plantilla</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {TEMPLATES.map(tpl => {
                  const isLocked = tpl.plan === 'pro' && userPlan !== 'pro' && userPlan !== 'agency';
                  const isSelected = templateId === tpl.id;
                  return (
                    <div key={tpl.id} onClick={() => !isLocked && setTemplateId(tpl.id)} style={{ padding: '1.5rem 1rem', borderRadius: '12px', border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`, background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-dark-secondary)', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.6 : 1, position: 'relative', transition: 'all 0.2s' }}>
                      {isLocked && <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#f59e0b', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '10px' }}>PRO</div>}
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{tpl.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tpl.type.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
              {userPlan !== 'pro' && userPlan !== 'agency' && (
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#f59e0b' }}>Para desbloquear las plantillas PRO necesitás mejorar tu suscripción.</p>
              )}
            </div>
          </>
        )}

        {/* TAB: CONTENIDO */}
        {activeTab === 'content' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Textos de la Plantilla</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Título Principal (Hero)</label>
                <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Ej: Las mejores pizzas de la ciudad" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subtítulo</label>
                <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Ej: Vení a disfrutar con amigos o pedí a domicilio." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Texto "Sobre Nosotros" / "Acerca de"</label>
                <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="Ej: Somos un emprendimiento familiar nacido en 2010..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', minHeight: '120px', resize: 'vertical' }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB: DOMINIO */}
        {activeTab === 'domain' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Subdominio Gratuito</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">Elegí tu subdominio (solo letras, números y guiones)</label>
                <div className="flex flex-col sm:flex-row sm:items-stretch overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-dark-secondary)]">
                  <input 
                    type="text" 
                    value={subdomain} 
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                    placeholder="mitienda" 
                    className="flex-1 p-4 bg-transparent outline-none text-[var(--text-primary)] min-w-0" 
                    required 
                  />
                  <div className="bg-[var(--bg-dark)] px-4 py-3 flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)] shrink-0">
                    <span className="text-sm font-medium text-[var(--text-muted)]">.sitiolisto.com.ar</span>
                    {subdomainStatus === 'checking' && <span className="animate-spin">⏳</span>}
                    {subdomainStatus === 'available' && <span className="text-emerald-500 font-bold text-xs">DISPONIBLE</span>}
                    {subdomainStatus === 'taken' && <span className="text-rose-500 font-bold text-xs">OCUPADO</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Dominio Personalizado (PRO)</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Si compraste un dominio propio (ej: www.miempresa.com), ingresalo aquí:</label>
                <input 
                  type="text" 
                  value={customDomain} 
                  onChange={(e) => setCustomDomain(e.target.value)} 
                  placeholder="www.mitienda.com.ar" 
                  disabled={userPlan !== 'pro' && userPlan !== 'agency'}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', opacity: userPlan !== 'pro' && userPlan !== 'agency' ? 0.6 : 1 }} 
                />
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong>Instrucciones DNS:</strong> Para que funcione, debés configurar en el panel de tu dominio (ej: Nic.ar o GoDaddy) un Registro CNAME apuntando a <code>cname.vercel-dns.com</code>.
                </p>
                {userPlan !== 'pro' && userPlan !== 'agency' && (
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#f59e0b' }}>Esta función es exclusiva para planes PRO.</p>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
