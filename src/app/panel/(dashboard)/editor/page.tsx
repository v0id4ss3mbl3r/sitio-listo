'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Save, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { PLAN_PAGE_LIMITS, PlanType, TEMPLATES, TemplateId } from '@/lib/constants';
import { PagesManager } from './_components/PagesManager';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  amount: number;
  trial_end_date: string | null;
  current_period_end: string | null;
  created_at: string;
}

type TabType = 'appearance' | 'content' | 'pages' | 'domain';

export default function EditorPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Editor State
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [customDomainStatus, setCustomDomainStatus] = useState<'pending' | 'verified' | 'failed' | null>(null);
  const [templateId, setTemplateId] = useState('sabor-urbano');
  const [siteName, setSiteName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [logoUrl, setLogoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Content State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutText, setAboutText] = useState('');

  // Template-specific fields
  const [ctaText, setCtaText] = useState('Comenzar Ahora');
  const [tagline, setTagline] = useState('');
  const [skills, setSkills] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Validation State
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Timestamp del mount — usado para evaluar trial/gracia sin llamar
  // Date.now() durante el render (regla react-hooks/purity).
  const [mountedAt] = useState<number>(() => Date.now());

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
        setCustomDomainStatus(data.site.custom_domain_status ?? null);
        setTemplateId(data.site.template_id || 'sabor-urbano');
        setSiteName(data.site.config?.name || '');
        setPrimaryColor(data.site.config?.primaryColor || '#6366f1');
        setSecondaryColor(data.site.config?.secondaryColor || '#f59e0b');
        setLogoUrl(data.site.config?.logoUrl || '');
        setPhone(data.site.config?.phone || '');
        setAddress(data.site.config?.address || '');

        // Content
        setHeroTitle(data.site.config?.content?.heroTitle || '');
        setHeroSubtitle(data.site.config?.content?.heroSubtitle || '');
        setAboutText(data.site.config?.content?.aboutText || '');

        // Template-specific fields
        setCtaText(data.site.config?.content?.ctaText || 'Comenzar Ahora');
        setTagline(data.site.config?.content?.tagline || '');
        setSkills(data.site.config?.content?.skills || '');
        setOpeningHours(data.site.config?.content?.openingHours || '');
        setWhatsapp(data.site.config?.content?.whatsapp || '');

        setSubdomainStatus('available');
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

    if (userPlan === 'free') {
      setNotification({ type: 'error', message: 'Necesitás un plan activo para publicar tu sitio.' });
      return;
    }

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
            secondaryColor,
            logoUrl,
            phone,
            address,
            content: {
              heroTitle,
              heroSubtitle,
              aboutText,
              ctaText,
              tagline,
              skills,
              openingHours,
              whatsapp
            }
          }
        }),
      });

      const data = await res.json();
      if (data.error) {
        setNotification({ type: 'error', message: data.error });
      } else {
        setNotification({ type: 'success', message: '¡Sitio guardado y publicado correctamente!' });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al guardar el sitio' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ height: '48px', width: '250px', background: 'var(--bg-card)', borderRadius: '12px', marginBottom: '1rem', animation: 'pulse 2s infinite' }}></div>
        <div style={{ height: '24px', width: '350px', background: 'var(--bg-card)', borderRadius: '8px', marginBottom: '3rem', animation: 'pulse 2s infinite' }}></div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '45px', width: '120px', background: 'var(--bg-card)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', animation: 'pulse 2s infinite', opacity: 1 - i * 0.2 }}></div>
          ))}
        </div>

        <div style={{ height: '300px', width: '100%', background: 'var(--bg-card)', borderRadius: '16px', animation: 'pulse 2s infinite' }}></div>
      </div>
    );
  }

  // Now: capturado una sola vez al mount para que el render sea puro
  // respecto del input (subscription). Se recalcula si el usuario recarga.
  const isInTrial = !!(
    subscription?.trial_end_date &&
    new Date(subscription.trial_end_date).getTime() > mountedAt
  );
  const isInGracePeriod = !!(
    subscription?.status === 'cancelled' &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end).getTime() > mountedAt
  );
  const hasActivePlan =
    subscription?.status === 'authorized' || isInTrial || isInGracePeriod;
  const userPlan = hasActivePlan && subscription ? subscription.plan_type : 'free';

  const trialDaysLeft = subscription?.trial_end_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.trial_end_date).getTime() - mountedAt) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  if (userPlan === 'free') {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '0 1rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Necesitás un plan activo
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            Para crear y editar tu sitio web necesitás suscribirte a uno de nuestros planes. El plan Básico incluye 14 días de prueba gratis.
          </p>
          <a
            href="/cuenta"
            className="btn-primary"
            style={{ display: 'inline-block', padding: '0.875rem 2rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}
          >
            Ver planes →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
      {/* Notificación */}
      {notification && (
        <div style={{
          position: 'fixed', top: '2rem', right: '2rem', zIndex: 200,
          padding: '1rem 1.5rem', borderRadius: '10px',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white', fontSize: '0.9rem', fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          {notification.type === 'success' ? '✓ ' : '✕ '}{notification.message}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(400px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />

      {isInTrial && (
        <div style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          borderRadius: '10px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#f59e0b',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          Estás en período de prueba. Te {trialDaysLeft === 1 ? 'queda 1 día' : `quedan ${trialDaysLeft} días`} antes del primer cobro.
        </div>
      )}

      {isInGracePeriod && subscription?.current_period_end && (
        <div style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#ef4444',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          Tu plan está cancelado. El sitio seguirá activo hasta el {new Date(subscription.current_period_end).toLocaleDateString('es-AR')}.
        </div>
      )}

      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
          Editor Visual
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Personalizá tu sitio y gestioná tu identidad online.
        </p>
      </header>

      {/* Tabs Estilizadas */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2.5rem', 
        borderBottom: '1px solid var(--border-subtle)',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {(['appearance', 'content', 'pages', 'domain'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 1.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === tab ? 'var(--color-primary)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'appearance' && 'Apariencia'}
            {tab === 'content' && 'Contenido'}
            {tab === 'pages' && 'Páginas'}
            {tab === 'domain' && 'Dominio'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* TAB: APARIENCIA */}
        {activeTab === 'appearance' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Identidad del Sitio</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Nombre del Sitio / Marca</label>
                  <input 
                    type="text" 
                    value={siteName} 
                    onChange={(e) => setSiteName(e.target.value)} 
                    placeholder="Ej: Mi Restaurante Increíble" 
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Colores de la Marca</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border-subtle)' }}>
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            style={{ position: 'absolute', top: '-10px', left: '-10px', width: '70px', height: '70px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
                          />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{primaryColor.slice(1).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secundario</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border-subtle)' }}>
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            style={{ position: 'absolute', top: '-10px', left: '-10px', width: '70px', height: '70px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
                          />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{secondaryColor.slice(1).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>URL del Logo / Imagen de Marca</label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://ejemplo.com/logo.png"
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Teléfono de Contacto</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 2345-6789"
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Dirección Física</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Av. Ejemplo 1234, CABA, Argentina"
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Seleccionar Plantilla</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {TEMPLATES.map(tpl => {
                  const isLocked =
                    userPlan === 'free' ||
                    (tpl.plan === 'pro' && userPlan !== 'pro' && userPlan !== 'extremo');
                  const isSelected = templateId === tpl.id;
                  return (
                    <div 
                      key={tpl.id} 
                      onClick={() => !isLocked && setTemplateId(tpl.id)} 
                      style={{ 
                        padding: '1.5rem', 
                        borderRadius: '16px', 
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`, 
                        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-dark-secondary)', 
                        cursor: isLocked ? 'not-allowed' : 'pointer', 
                        opacity: isLocked ? 0.6 : 1, 
                        position: 'relative', 
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'translateY(-4px)' : 'none',
                        boxShadow: isSelected ? '0 10px 25px -5px rgba(99, 102, 241, 0.2)' : 'none'
                      }}
                    >
                      {isLocked && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '20px', letterSpacing: '0.05em' }}>PRO</div>}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{tpl.name}</h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tpl.type}</span>
                    </div>
                  );
                })}
              </div>
              {userPlan === 'free' && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={18} color="#f59e0b" />
                  <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>Mejorá tu suscripción para desbloquear plantillas premium.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB: CONTENIDO */}
        {activeTab === 'content' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Textos de la Plantilla</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Título Principal (Hero)</label>
                <input 
                  type="text" 
                  value={heroTitle} 
                  onChange={(e) => setHeroTitle(e.target.value)} 
                  placeholder="Ej: Las mejores pizzas de la ciudad" 
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Subtítulo</label>
                <textarea 
                  value={heroSubtitle} 
                  onChange={(e) => setHeroSubtitle(e.target.value)} 
                  placeholder="Ej: Vení a disfrutar con amigos o pedí a domicilio." 
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Texto "Sobre Nosotros"</label>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Ej: Somos un emprendimiento familiar nacido in 2010..."
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', minHeight: '150px', resize: 'vertical' }}
                />
              </div>

              {/* Campos específicos por plantilla */}
              {templateId === 'landing-pro' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Texto del Botón CTA</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="Ej: Comenzar Ahora"
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                </>
              )}

              {(templateId === 'portfolio-01' || templateId === 'portfolio-minimal') && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Tagline Profesional</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Ej: Diseñador especializado en marcas disruptivas"
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Skills (separados por comas)</label>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Ej: Diseño UX/UI, Branding, Web Design, Motion Design"
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>
                </>
              )}

              {(templateId === 'restaurant-01' || templateId === 'sabor-urbano') && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Horario de Apertura</label>
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Ej: Lunes a Viernes 11:00-23:00, Sábados 12:00-00:00"
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>WhatsApp para Reservas</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+54 9 11 2345-6789"
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB: PÁGINAS */}
        {activeTab === 'pages' && (
          <PagesManager
            userPlan={userPlan}
            limit={PLAN_PAGE_LIMITS[userPlan as PlanType] ?? 1}
          />
        )}

        {/* TAB: DOMINIO */}
        {activeTab === 'domain' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Subdominio Gratuito</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Tu dirección en SitioListo
                </label>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-dark-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '60px' }}>
                    <input 
                      type="text" 
                      value={subdomain} 
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                      placeholder="mi-negocio" 
                      style={{ 
                        flex: 1, 
                        padding: '1.25rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--text-primary)', 
                        fontSize: '1.1rem', 
                        fontWeight: 600,
                        outline: 'none' 
                      }}
                      required 
                    />
                    <div style={{ 
                      padding: '0 1.5rem', 
                      height: '60px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderLeft: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      .sitiolisto.com.ar
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem 1.25rem', 
                    background: 'rgba(0,0,0,0.1)', 
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Estado del subdominio:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {subdomainStatus === 'checking' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                           <span className="animate-spin text-sm">⏳</span>
                           <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>VERIFICANDO...</span>
                        </div>
                      )}
                      {subdomainStatus === 'available' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                          <CheckCircle size={14} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>DISPONIBLE</span>
                        </div>
                      )}
                      {subdomainStatus === 'taken' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444' }}>
                          <AlertCircle size={14} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>OCUPADO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dominio Personalizado (PRO)</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Usar un dominio propio (ej: www.miempresa.com):</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.mitienda.com.ar"
                  disabled={userPlan === 'free' || userPlan === 'basic'}
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', opacity: (userPlan === 'free' || userPlan === 'basic') ? 0.6 : 1, fontSize: '1rem' }}
                />
                {customDomain && customDomainStatus && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {customDomainStatus === 'pending' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                        <AlertCircle size={12} /> ESPERANDO DNS
                      </span>
                    )}
                    {customDomainStatus === 'verified' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle size={12} /> VERIFICADO
                      </span>
                    )}
                    {customDomainStatus === 'failed' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                        <AlertCircle size={12} /> NO RESUELVE
                      </span>
                    )}
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Configuración DNS</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Apuntá un Registro <strong>CNAME</strong> de tu dominio a: <code style={{ color: 'var(--color-primary-light)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>cname.vercel-dns.com</code>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '0.75rem' }}>
                    Una vez configurado el DNS, contactanos para verificar el dominio. La propagación puede demorar hasta 48 horas.
                  </p>
                </div>
                {(userPlan === 'free' || userPlan === 'basic') && (
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>El dominio personalizado está disponible en el Plan Pro o Extremo.</p>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      {/* Floating Action Buttons */}
      <div style={{ 
        position: 'fixed', 
        bottom: '2.5rem', 
        right: '2.5rem', 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 100,
      }}>
        {subdomain && subdomainStatus === 'available' && (
          <a
            href={process.env.NODE_ENV === 'production' ? `https://${subdomain}.sitiolisto.com.ar` : `http://${subdomain}.localhost:3000`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s',
              background: 'var(--bg-card)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            <ExternalLink size={14} />
            Ver sitio
          </a>
        )}
        <button 
          onClick={handleSave} 
          disabled={saving || subdomainStatus === 'taken'} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.85rem 1.5rem', 
            borderRadius: '12px', 
            background: 'var(--gradient-primary)', 
            color: 'white', 
            border: 'none', 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            cursor: (saving || subdomainStatus === 'taken') ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: (saving || subdomainStatus === 'taken') ? 0.6 : 1,
            boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar y Publicar'}
        </button>
      </div>
    </div>
  );
}
