import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/env';
import { LEGAL_DOCS, getLegalDoc } from '@/lib/legal';

// Los documentos viven en el código, así que las tres rutas se prerenderizan.
export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `${SITE_URL}/legal/${doc.slug}` },
  };
}

const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <main
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: 'var(--space-24) var(--space-6) var(--space-16)',
      }}
    >
      <Link
        href="/"
        className="nav-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-primary)',
          textDecoration: 'none',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          margin: 'var(--space-6) 0 var(--space-3)',
        }}
      >
        {doc.title}
      </h1>

      <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
        {doc.summary}
      </p>

      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-3)',
        }}
      >
        Última actualización: <time dateTime={doc.updatedAt}>{fechaLarga(doc.updatedAt)}</time>
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
          marginTop: 'var(--space-12)',
        }}
      >
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.015em',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {s.heading}
            </h2>

            {s.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 40)}
                style={{
                  fontSize: '0.975rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  margin: '0 0 var(--space-3)',
                }}
              >
                {p}
              </p>
            ))}

            {s.list && (
              <ul
                style={{
                  margin: 'var(--space-2) 0 0',
                  paddingLeft: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                {s.list.map((item) => (
                  <li
                    key={item}
                    style={{ fontSize: '0.975rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <nav
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
          marginTop: 'var(--space-16)',
          paddingTop: 'var(--space-6)',
          borderTop: 'var(--border-width, 1px) solid var(--border-subtle)',
        }}
      >
        {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
          <Link
            key={d.slug}
            href={`/legal/${d.slug}`}
            className="nav-link"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            {d.title}
          </Link>
        ))}
      </nav>
    </main>
  );
}
