const features = [
  {
    icon: '📐',
    title: 'Plantillas profesionales',
    description: 'Elegí entre diseños modernos y optimizados para cada tipo de negocio.',
    color: '#6366f1',
  },
  {
    icon: '🎨',
    title: 'Editor visual',
    description: 'Cambiá colores, textos, logos e imágenes sin tocar una línea de código.',
    color: '#8b5cf6',
  },
  {
    icon: '⚡',
    title: 'Online al instante',
    description: 'Tu sitio queda publicado en tu subdominio apenas termines de configurarlo.',
    color: '#06b6d4',
  },
  {
    icon: '🔒',
    title: 'SSL incluido',
    description: 'Certificado de seguridad gratuito. Tus visitantes navegarán de forma segura.',
    color: '#10b981',
  },
  {
    icon: '📱',
    title: 'Responsive',
    description: 'Todos los diseños se adaptan a celulares, tablets y computadoras.',
    color: '#f59e0b',
  },
  {
    icon: '💬',
    title: 'Soporte humano',
    description: 'Nuestro equipo te acompaña en cada paso con soporte por email y chat.',
    color: '#ec4899',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Características
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.75rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          Todo lo que necesitás para <span className="gradient-text">brillar online</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Herramientas poderosas, diseño premium y la simplicidad que tu negocio merece.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {features.map((f) => (
          <div key={f.title} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${f.color}15, ${f.color}30)`,
              border: `1px solid ${f.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
