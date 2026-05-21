import { z } from 'zod';

import { PLANS } from '@/lib/constants';

// Schemas de zod para parsear el shape de los bodies de la API.
// La validación de reglas de negocio (subdominios reservados, dominios
// propios, etc) se queda en `validateSubdomain` / `validateCustomDomain` —
// zod solo verifica la estructura y rangos básicos.

export const createSiteSchema = z.object({
  subdomain: z.string().min(1).max(63),
  custom_domain: z.string().max(253).nullable().optional(),
  template_id: z.string().min(1).max(64),
  config: z.record(z.string(), z.unknown()).optional().default({}),
});

export type CreateSiteInput = z.infer<typeof createSiteSchema>;

// Whitelist explícita derivada de PLANS — incluye solo planes que MP cobra.
// 'personalizado' (price null) no entra al checkout, se maneja por contacto.
const CHECKOUT_PLANS = Object.values(PLANS)
  .filter(p => p.price !== null)
  .map(p => p.slug);

export const checkoutSchema = z.object({
  planSlug: z.enum(CHECKOUT_PLANS as [string, ...string[]]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Helper para parsear un body de Request y devolver un error 400 estructurado
// si el shape no matchea. Se usa así:
//   const parsed = await parseJson(req, createSiteSchema);
//   if (!parsed.ok) return parsed.response;
//   const { subdomain, ... } = parsed.data;
export async function parseJson<T>(
  req: Request,
  schema: z.ZodType<T>
): Promise<
  | { ok: true; data: T }
  | { ok: false; response: Response }
> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      ok: false,
      response: Response.json(
        { error: 'Body inválido (no es JSON)' },
        { status: 400 }
      ),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Datos inválidos', details: parsed.error.format() },
        { status: 400 }
      ),
    };
  }

  return { ok: true, data: parsed.data };
}
