export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export const COOKIE_DOMAIN = '.sitiolisto.com.ar';
