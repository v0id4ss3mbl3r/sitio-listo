import { Resolver } from 'node:dns/promises';

import { DOMAIN_APEX_IP, DOMAIN_CNAME_TARGET } from '@/lib/constants';

export type DomainCheckStatus = 'verified' | 'pending' | 'failed';

export type DomainCheck = {
  status: DomainCheckStatus;
  // Lo que el DNS devolvió realmente. Se lo mostramos al cliente para que vea
  // su propio error sin tener que escribirnos.
  records: string[];
};

// Node devuelve los CNAME sin punto final, pero algunos resolvers lo agregan.
function normalize(record: string): string {
  return record.trim().toLowerCase().replace(/\.$/, '');
}

/**
 * Pregunta al DNS a dónde apunta el dominio del cliente y decide si ya nos
 * está delegando el tráfico.
 *
 * Chequea las dos formas válidas sin intentar adivinar si es un dominio raíz
 * o un subdominio (distinguirlos requeriría la Public Suffix List: `com.ar`
 * es un sufijo, `tienda.com.ar` no):
 *   - CNAME a DOMAIN_CNAME_TARGET → lo normal para www.tienda.com.ar
 *   - registro A a DOMAIN_APEX_IP → para el dominio raíz, que por
 *     especificación no puede llevar un CNAME
 *
 * Los tres estados posibles:
 *   - verified: alguna de las dos coincide, el dominio ya nos apunta.
 *   - failed:   el dominio resuelve, pero a otro lado (típicamente el CNAME
 *               quedó mal cargado, o sigue apuntando al hosting anterior).
 *   - pending:  todavía no resuelve nada. Es lo esperable en las primeras
 *               horas: un cambio de DNS puede tardar hasta 48hs en propagarse.
 */
export async function checkDomainDns(domain: string): Promise<DomainCheck> {
  // Resolver propio con timeout: sin esto una consulta a un DNS que no
  // responde puede colgar el request hasta el límite de la plataforma.
  const resolver = new Resolver({ timeout: 5000, tries: 2 });

  const cnames = await resolver.resolveCname(domain).catch(() => [] as string[]);
  if (cnames.some((record) => normalize(record) === DOMAIN_CNAME_TARGET)) {
    return { status: 'verified', records: cnames.map(normalize) };
  }

  const ips = await resolver.resolve4(domain).catch(() => [] as string[]);
  if (ips.includes(DOMAIN_APEX_IP)) {
    return { status: 'verified', records: ips };
  }

  const records = [...cnames.map(normalize), ...ips];
  if (records.length > 0) {
    return { status: 'failed', records };
  }

  return { status: 'pending', records: [] };
}
