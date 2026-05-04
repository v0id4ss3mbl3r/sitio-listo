import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from('sites')
    .select('config, is_active')
    .eq('subdomain', domain)
    .single();

  if (!site || !site.is_active) {
    return { title: 'Sitio no encontrado | SitioListo' };
  }

  return {
    title: `${site.config?.name || domain} | Creado con SitioListo`,
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const supabase = await createClient();

  // Buscar configuración del sitio en Supabase
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('subdomain', domain)
    .single();

  // Si no existe o no está activo (suscripción vencida), mostrar página por defecto
  if (!site || !site.is_active) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 auto 1.5rem' }}>
            S
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {domain}.sitiolisto.com.ar
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Este sitio no se encuentra disponible actualmente o está siendo configurado.
          </p>
          <a href={process.env.NEXT_PUBLIC_SITE_URL} className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Creá tu propio sitio
          </a>
        </div>
      </div>
    );
  }

  // Desestructurar configuración
  const { template_id, config } = site;
  const siteName = config?.name || 'Mi Nuevo Sitio';
  const primaryColor = config?.primaryColor || '#6366f1';

  // Renderizado dinámico según la plantilla elegida
  // En una app real esto sería un switch gigante o importación dinámica de componentes
  
  if (template_id === 'restaurant-01') {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        {/* Header Restaurant */}
        <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: primaryColor, fontWeight: 800 }}>{siteName}</h1>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>Menú</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>Reservas</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>Ubicación</a>
          </nav>
        </header>

        {/* Hero Restaurant */}
        <div style={{ height: '70vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '3.5rem', color: 'white', fontWeight: 800, marginBottom: '1rem' }}>
              Una experiencia culinaria inolvidable
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '2.5rem' }}>
              Descubrí los mejores sabores preparados por chefs internacionales en un ambiente exclusivo.
            </p>
            <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: primaryColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Hacer una reserva
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: '2rem', textAlign: 'center', background: '#f9fafb', color: '#6b7280' }}>
          © {new Date().getFullYear()} {siteName}. Creado con SitioListo.
        </footer>
      </div>
    );
  }

  if (template_id === 'portfolio-01') {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fafafa', minHeight: '100vh', color: '#171717' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '1rem', color: primaryColor }}>
            Hola, soy el dueño de {siteName}.
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#525252', marginBottom: '3rem', lineHeight: 1.5 }}>
            Soy un profesional independiente creando soluciones digitales. Bienvenido a mi rincón en internet.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e5e5' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: primaryColor, opacity: 0.2, marginBottom: '1rem' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Proyecto {i}</h3>
                <p style={{ color: '#737373' }}>Una breve descripción de este increíble proyecto y las tecnologías que utilicé para construirlo.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Plantilla por defecto si el ID no matchea
  return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: primaryColor, fontSize: '3rem' }}>{siteName}</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#4b5563' }}>Plantilla genérica ({template_id}).</p>
    </div>
  );
}
