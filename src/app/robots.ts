import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/env';

/**
 * robots.txt de la web pública.
 *
 * OJO con el multi-tenant: el matcher del middleware ignora las rutas con
 * punto, así que este archivo se sirve TAL CUAL en todos los hostnames,
 * incluidos los sitios de los clientes. Por eso las reglas son deliberadamente
 * inocuas fuera de sitiolisto.com.ar: /api/ y /panel/ no existen en un sitio
 * de cliente, y la línea Sitemap la ignoran los buscadores cuando apunta a
 * otro host. Los sitios de los clientes quedan indexables, que es lo que el
 * cliente quiere.
 *
 * /preview/ NO se bloquea a propósito: esas páginas ya llevan noindex en su
 * metadata, y si además se prohibiera rastrearlas el buscador nunca vería ese
 * noindex. Para que una página se desindexe hay que dejar que la lean.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/panel/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
