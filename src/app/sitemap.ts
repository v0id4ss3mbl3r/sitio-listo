import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/env';
import { LEGAL_DOCS } from '@/lib/legal';

/**
 * Sitemap de la web pública.
 *
 * Solo lleva páginas que queremos indexadas: la home y los documentos
 * legales. Quedan afuera a propósito:
 *   - /preview/*  → son demos duplicadas entre plantillas, van con noindex.
 *   - el panel    → requiere sesión.
 *   - los sitios de clientes → viven en otros hostnames; un sitemap solo
 *     puede declarar URLs de su propio host, así que listarlas acá no serviría
 *     de nada. Para que se indexen bien, cada tenant necesita su propio
 *     sitemap (pendiente).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: ahora,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...LEGAL_DOCS.map((doc) => ({
      url: `${SITE_URL}/legal/${doc.slug}`,
      // Fecha real del documento, no la de hoy: si no, cada deploy le diría
      // a Google que los términos cambiaron cuando no cambió nada.
      lastModified: new Date(`${doc.updatedAt}T12:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
