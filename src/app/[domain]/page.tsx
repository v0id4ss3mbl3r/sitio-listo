import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitio en construcción | SitioListo',
};

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  // TODO Fase 4: Buscar sitio en Supabase y renderizar template
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white',
            margin: '0 auto 1.5rem',
          }}
        >
          S
        </div>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {domain}.sitiolisto.com.ar
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginTop: '0.5rem',
            lineHeight: 1.6,
          }}
        >
          Este sitio está siendo configurado por su dueño y estará disponible
          pronto.
        </p>
        <a
          href="https://sitiolisto.com.ar"
          className="btn-primary"
          style={{ marginTop: '2rem', display: 'inline-flex' }}
        >
          Creá tu propio sitio
        </a>
      </div>
    </div>
  );
}
