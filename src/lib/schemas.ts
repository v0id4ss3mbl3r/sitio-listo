import { z } from 'zod';

import { PLANS } from '@/lib/constants';
import { THEME_LIST } from '@/lib/themes';

// Ids de tema válidos, derivados del registro de presets (single source).
const THEME_IDS = THEME_LIST.map((t) => t.id);

// Schemas de zod para parsear el shape de los bodies de la API.
// La validación de reglas de negocio (subdominios reservados, dominios
// propios, etc) se queda en `validateSubdomain` / `validateCustomDomain` —
// zod solo verifica la estructura y rangos básicos.

export const createSiteSchema = z.object({
  subdomain: z.string().min(1).max(63),
  custom_domain: z.string().max(253).nullable().optional(),
  template_id: z.string().min(1).max(64),
  // El contenido del sitio (nombre, colores, hero, etc) vive en pages.
  // Solo recibimos el name para inicializar la home en la primera creación.
  name: z.string().min(1).max(120).optional(),
  // Tema visual elegido por el dueño. Solo se persiste si tiene permiso
  // (gateado en el endpoint). null = volver al default de la plantilla.
  theme_id: z.enum(THEME_IDS as [string, ...string[]]).nullable().optional(),
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

// ─── pages ────────────────────────────────────────────────────
// Slug de página: vacío para home, o lowercase alfanumérico con guiones.
const pageSlugSchema = z
  .string()
  .max(63)
  .refine(
    (v) => v === '' || /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(v),
    'Slug inválido (usá letras, números y guiones)'
  );

export const createPageSchema = z.object({
  slug: pageSlugSchema,
  title: z.string().min(1).max(120),
  content: z.record(z.string(), z.unknown()).optional().default({}),
  is_home: z.boolean().optional().default(false),
  sort_order: z.number().int().min(0).max(9999).optional().default(0),
  is_published: z.boolean().optional().default(true),
});

export const updatePageSchema = z.object({
  slug: pageSlugSchema.optional(),
  title: z.string().min(1).max(120).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_published: z.boolean().optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;

// ─── catálogo: categories ─────────────────────────────────────
const categorySlugSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
    'Slug inválido (letras minúsculas, números y guiones)'
  );

export const createCategorySchema = z.object({
  name: z.string().min(1).max(60),
  slug: categorySlugSchema,
  sort_order: z.number().int().min(0).max(9999).optional().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(60).optional(),
  slug: categorySlugSchema.optional(),
  sort_order: z.number().int().min(0).max(9999).optional(),
});

// ─── catálogo: products ───────────────────────────────────────
const productSlugSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
    'Slug inválido (letras minúsculas, números y guiones)'
  );

const httpsUrlSchema = z
  .string()
  .url()
  .refine((v) => v.startsWith('http://') || v.startsWith('https://'), 'URL inválida');

export const createProductSchema = z.object({
  name: z.string().min(1).max(120),
  slug: productSlugSchema,
  description: z.string().max(5000).nullable().optional(),
  price: z.number().nonnegative().max(1_000_000_000),
  compare_at_price: z.number().nonnegative().max(1_000_000_000).nullable().optional(),
  image_url: httpsUrlSchema.nullable().optional(),
  image_urls: z.array(httpsUrlSchema).max(8).optional().default([]),
  category_id: z.string().uuid().nullable().optional(),
  in_stock: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  sort_order: z.number().int().min(0).max(9999).optional().default(0),
  is_active: z.boolean().optional().default(true),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  slug: productSlugSchema.optional(),
  description: z.string().max(5000).nullable().optional(),
  price: z.number().nonnegative().max(1_000_000_000).optional(),
  compare_at_price: z.number().nonnegative().max(1_000_000_000).nullable().optional(),
  image_url: httpsUrlSchema.nullable().optional(),
  image_urls: z.array(httpsUrlSchema).max(8).optional(),
  category_id: z.string().uuid().nullable().optional(),
  in_stock: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().optional(),
});

// ─── catálogo: store_settings ─────────────────────────────────
const whatsappNumberSchema = z.object({
  id: z.string().min(1).max(20),
  label: z.string().min(1).max(40),
  // Solo dígitos, con código de país. Ej: 5492235922077
  phone: z.string().regex(/^[0-9]{8,15}$/, 'Teléfono inválido (solo dígitos, con código de país)'),
});

export const updateStoreSettingsSchema = z.object({
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color hex inválido').optional(),
  whatsapp_numbers: z.array(whatsappNumberSchema).max(3).optional(),
  banner_title: z.string().max(120).nullable().optional(),
  banner_subtitle: z.string().max(200).nullable().optional(),
  banner_image_url: httpsUrlSchema.nullable().optional(),
  store_description: z.string().max(500).nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;

// ─── admin: usuarios ──────────────────────────────────────────
export const blockUserSchema = z.object({
  // ISO timestamp futuro. Para "permanente" usar una fecha lejana (ej. 9999-01-01).
  until: z.string().datetime(),
  reason: z.string().max(500).optional(),
});

export const notifyUserSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(2000),
});

export const setPasswordSchema = z.object({
  password: z.string().min(8).max(72),
});

// ─── admin: sitios ────────────────────────────────────────────
export const adminUpdateSiteSchema = z.object({
  subdomain: z.string().min(3).max(63).optional(),
  custom_domain: z.string().max(253).nullable().optional(),
  is_active: z.boolean().optional(),
  is_banned: z.boolean().optional(),
  template_id: z.string().min(1).max(64).optional(),
  // null = volver al default de la plantilla.
  theme_id: z.enum(THEME_IDS as [string, ...string[]]).nullable().optional(),
});

// ─── admin: suscripciones ─────────────────────────────────────
export const adminUpdateSubscriptionSchema = z.object({
  status: z.enum(['authorized', 'paused', 'cancelled', 'pending']).optional(),
  current_period_end: z.string().datetime().nullable().optional(),
});

// ─── admin: plantillas ────────────────────────────────────────
export const adminUpdateTemplateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).nullable().optional(),
  category: z.enum(['restaurant', 'portfolio', 'ecommerce', 'landing', 'services']).optional(),
  plan_required: z.enum(['basic', 'pro', 'extremo']).optional(),
  min_plan: z.enum(['basic', 'pro', 'extremo']).nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  preview_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

// ─── admin: apariencia (app_settings global) ──────────────────
export const adminUpdateSettingsSchema = z.object({
  theme_id: z.enum(THEME_IDS as [string, ...string[]]),
});

// ─── admin: usuarios ──────────────────────────────────────────
export const adminUpdateUserSchema = z.object({
  can_customize_theme: z.boolean().optional(),
});

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
