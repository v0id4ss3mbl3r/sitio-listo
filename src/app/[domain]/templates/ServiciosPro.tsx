'use client';

import React from 'react';

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  heroTitle?: string;
  aboutText?: string;
  phone?: string;
  address?: string;
  services?: Array<{ title: string; description: string }>;
}

const DEFAULT_SERVICES = [
  { title: 'Consultoría Estratégica', description: 'Asesoramiento personalizado para tu negocio' },
  { title: 'Auditoría Profesional', description: 'Análisis completo de tus procesos' },
  { title: 'Gestión de Proyectos', description: 'Implementación de soluciones comprobadas' },
  { title: 'Capacitación', description: 'Entrenamiento especializado para tu equipo' },
  { title: 'Soporte Continuo', description: 'Acompañamiento permanente en tu crecimiento' },
  { title: 'Documentación', description: 'Asesoramiento en normativas y compliance' },
];

export default function ServiciosPro({
  siteName = 'Mi Estudio',
  primaryColor = '#6366f1',
  secondaryColor = '#f59e0b',
  heroTitle,
  aboutText,
  phone = '',
  address = '',
  services = DEFAULT_SERVICES,
}: TemplateProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', color: '#1f2937', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,900;1,700&display=swap');

        .sp-nav-link {
          font-size: 0.9rem; font-weight: 600; color: #6b7280; text-decoration: none;
          transition: color 0.3s ease;
        }
        .sp-nav-link:hover { color: ${primaryColor}; }

        @keyframes sp-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sp-fade { animation: sp-fade-in 0.6s ease-out both; }

        .sp-service-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
        }
        .sp-service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.15);
        }

        .sp-btn-primary {
          padding: 12px 28px;
          border-radius: 8px;
          background: ${primaryColor};
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sp-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
      `}} />

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: primaryColor, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18
          }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <a href="#servicios" className="sp-nav-link">Servicios</a>
          <a href="#sobre" className="sp-nav-link">Sobre nosotros</a>
          <a href="#contacto" className="sp-nav-link">Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        paddingTop: 'calc(70px + 4rem)',
        paddingBottom: '4rem',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        maxWidth: 1100,
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 className="sp-fade" style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.04em', lineHeight: 1.1,
          color: '#111',
          marginBottom: '1.5rem',
          wordBreak: 'break-word'
        }}>
          {heroTitle || `Soluciones Profesionales para tu Éxito`}
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#6b7280', lineHeight: 1.6, fontWeight: 500,
          maxWidth: 700, margin: '0 auto',
          marginBottom: '2rem'
        }}>
          Experiencia, dedicación y resultados comprobados en cada proyecto
        </p>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{
        padding: '5rem 3rem',
        background: 'white',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.04em',
              color: '#111',
              marginBottom: '1rem'
            }}>
              Nuestros Servicios
            </h2>
            <div style={{
              width: '60px', height: '4px',
              background: primaryColor, margin: '0 auto'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, idx) => (
              <div
                key={idx}
                className="sp-service-card"
                style={{
                  padding: '2rem',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  background: `${primaryColor}20`,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem'
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontSize: '1.15rem', fontWeight: 700,
                  marginBottom: '0.75rem', color: '#111'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#6b7280', lineHeight: 1.6
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre" style={{
        padding: '5rem 3rem',
        maxWidth: 1100,
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-0.04em',
          color: '#111',
          marginBottom: '2rem'
        }}>
          Sobre Nosotros
        </h2>
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '16px',
          background: primaryColor,
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: 900, fontStyle: 'italic',
          margin: '0 auto 2rem'
        }}>
          {siteName.charAt(0).toUpperCase()}
        </div>
        <p style={{
          fontSize: '1.15rem',
          color: '#4b5563', lineHeight: 1.8, fontWeight: 500,
          maxWidth: 700, margin: '0 auto',
          marginBottom: '2rem'
        }}>
          {aboutText || 'Somos un equipo de profesionales dedicados a brindar soluciones personalizadas que impulsen el crecimiento de nuestros clientes. Con años de experiencia, entendemos los desafíos únicos de cada industria.'}
        </p>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{
        padding: '5rem 3rem',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: '#111',
            marginBottom: '2rem'
          }}>
            Contactanos
          </h2>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {phone && (
              <div style={{
                padding: '1.5rem',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Teléfono</p>
                <a href={`tel:${phone}`} style={{ fontSize: '1.2rem', fontWeight: 700, color: primaryColor, textDecoration: 'none' }}>
                  {phone}
                </a>
              </div>
            )}
            {address && (
              <div style={{
                padding: '1.5rem',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Dirección</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111' }}>
                  {address}
                </p>
              </div>
            )}
          </div>

          <button className="sp-btn-primary">
            Solicitar Consulta
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '3rem',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.85rem'
      }}>
        <p>© {new Date().getFullYear()} {siteName} — Creado con SitioListo</p>
      </footer>
    </div>
  );
}
