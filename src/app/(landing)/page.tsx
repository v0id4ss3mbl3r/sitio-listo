import type { Metadata } from 'next';
import Hero from './components/Hero';
import Features from './components/Features';
import PricingTable from './components/PricingTable';
import TemplateGallery from './components/TemplateGallery';

export const metadata: Metadata = {
  title: 'SitioListo — Creá tu sitio web profesional en minutos',
  description: 'Elegí entre plantillas profesionales, personalizá los colores y contenido, y publicá con tu propio subdominio. Planes desde $29.999/mes.',
  openGraph: {
    title: 'SitioListo — Tu sitio web, listo hoy',
    description: 'Plantillas para restaurantes, portfolios, tiendas y más. Publicá en minutos sin saber programar.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SitioListo',
    description: 'Creá tu sitio web profesional en minutos.',
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <TemplateGallery />
      <PricingTable />

      {/* CTA Final */}
      <section
        id="cta-final"
        style={{
          padding: '6rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
        className="bg-grid"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            ¿Listo para tener tu sitio{' '}
            <span className="gradient-text">hoy mismo</span>?
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginTop: '1rem',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            Unite a los negocios que ya eligieron SitioListo para su presencia
            online.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/registro`} className="btn-primary" id="cta-final-empezar">
              Crear mi sitio
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
