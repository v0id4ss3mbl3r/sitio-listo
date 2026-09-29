export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export const COOKIE_DOMAIN = '.sitiolisto.com.ar';

/** Dominio oficial. Último recurso si la variable de entorno falla. */
export const CANONICAL_SITE_URL = 'https://sitiolisto.com.ar';

/**
 * Resuelve la URL pública del sitio.
 *
 * En producción rechaza una URL local: si NEXT_PUBLIC_SITE_URL quedara sin
 * setear o con el valor de desarrollo, el sitemap y el robots.txt saldrían
 * publicando direcciones de localhost y Google no indexaría nada. Es una falla
 * silenciosa —el deploy funciona igual— y por eso conviene la red.
 */
export function resolveSiteUrl(raw: string | undefined, prod: boolean): string {
  const limpia = (raw || '').trim().replace(/\/$/, '');
  if (!limpia) return CANONICAL_SITE_URL;

  const esLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(limpia);
  if (prod && esLocal) return CANONICAL_SITE_URL;

  return limpia;
}

/**
 * URL canónica de la web pública. Se usa en robots.txt, en el sitemap y en
 * las URLs canónicas de las páginas legales — es decir, en lugares que le
 * declaran a Google cuál es la dirección oficial del sitio, así que tiene que
 * salir de UN solo lado.
 *
 * No aplica a los sitios de los clientes: cada uno vive en su propio dominio.
 */
export const SITE_URL = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  isProduction()
);
