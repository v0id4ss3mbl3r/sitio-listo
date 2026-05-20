import {
  CUSTOM_DOMAIN_REGEX,
  RESERVED_DOMAIN_SUFFIXES,
  RESERVED_SUBDOMAINS,
  SUBDOMAIN_REGEX,
} from '@/lib/constants';

export type ValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function validateSubdomain(input: unknown): ValidationResult {
  if (typeof input !== 'string') {
    return { ok: false, error: 'Subdominio inválido' };
  }
  const value = input.trim().toLowerCase();

  if (value.length < 3) {
    return { ok: false, error: 'El subdominio debe tener al menos 3 caracteres' };
  }
  if (value.length > 63) {
    return { ok: false, error: 'El subdominio no puede superar los 63 caracteres' };
  }
  if (!SUBDOMAIN_REGEX.test(value)) {
    return {
      ok: false,
      error:
        'Solo se permiten letras minúsculas, números y guiones (sin guiones al principio o al final)',
    };
  }
  if (RESERVED_SUBDOMAINS.has(value)) {
    return { ok: false, error: 'Ese subdominio está reservado' };
  }

  return { ok: true, value };
}

export function validateCustomDomain(input: unknown): ValidationResult {
  if (input === null || input === undefined || input === '') {
    // custom_domain es opcional → null limpio
    return { ok: true, value: '' };
  }
  if (typeof input !== 'string') {
    return { ok: false, error: 'Dominio inválido' };
  }
  const value = input.trim().toLowerCase().replace(/\.$/, '');

  if (!CUSTOM_DOMAIN_REGEX.test(value)) {
    return { ok: false, error: 'Formato de dominio inválido (ej: tudominio.com)' };
  }

  for (const suffix of RESERVED_DOMAIN_SUFFIXES) {
    if (value === suffix || value.endsWith('.' + suffix)) {
      return {
        ok: false,
        error: 'No podés reclamar un dominio de la marca SitioListo',
      };
    }
  }

  return { ok: true, value };
}

// Valida que un valor venga de un URL param y tenga forma de subdominio o
// FQDN antes de usarlo en una query. Devuelve null si no es seguro consumirlo.
export function sanitizeTenantParam(input: string): string | null {
  const value = input.trim().toLowerCase();
  if (SUBDOMAIN_REGEX.test(value)) return value;
  if (CUSTOM_DOMAIN_REGEX.test(value)) return value;
  return null;
}
