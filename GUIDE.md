# SitioListo — Guía Completa de Desarrollo

> **Última actualización:** Mayo 2026  
> **Stack:** Next.js 16, React 19, Tailwind CSS v4, Supabase, MercadoPago  
> **Dominio:** sitiolisto.com.ar

---

## Índice

1. [Arquitectura General](#1-arquitectura-general)
2. [Estructura de Carpetas](#2-estructura-de-carpetas)
3. [Proxy (ex Middleware)](#3-proxy-ex-middleware)
4. [Supabase — Setup y Clientes](#4-supabase--setup-y-clientes)
5. [Base de Datos — Esquema SQL](#5-base-de-datos--esquema-sql)
6. [Autenticación](#6-autenticación)
7. [MercadoPago — Suscripciones](#7-mercadopago--suscripciones)
8. [Motor de Templates (Tenant)](#8-motor-de-templates-tenant)
9. [Variables de Entorno](#9-variables-de-entorno)
10. [Deploy en VPS](#10-deploy-en-vps)
11. [Convenciones de Código](#11-convenciones-de-código)

---

## 1. Arquitectura General

SitioListo es una plataforma **multi-tenant** basada en subdominios:

| URL | Route Group | Propósito |
|-----|-------------|-----------|
| `sitiolisto.com.ar` | `(landing)` | Landing pública, precios, catálogo |
| `app.sitiolisto.com.ar` | `(panel)` | Dashboard, editor, cuenta del usuario |
| `*.sitiolisto.com.ar` | `(tenant)` | Sitio publicado del cliente |

El archivo `proxy.ts` (antes `middleware.ts`, renombrado en Next.js 16) analiza el hostname de cada request y reescribe la URL internamente al route group correspondiente.

### Flujo del usuario
1. Llega a la landing → ve plantillas y precios
2. Se registra (email o Google via Supabase Auth)
3. Elige plantilla y subdominio → `mitienda.sitiolisto.com.ar`
4. Paga la suscripción mensual vía MercadoPago
5. Configura su sitio (colores, textos, logo) desde el panel
6. Su sitio queda publicado en el subdominio

---

## 2. Estructura de Carpetas

```
src/
├── proxy.ts                          ← NO usar middleware.ts (deprecado en Next.js 16)
├── lib/
│   ├── supabase/
│   │   ├── server.ts                 ← Para Server Components y Route Handlers
│   │   ├── browser.ts                ← Para Client Components ('use client')
│   │   └── proxy.ts                  ← Para proxy.ts (no tiene acceso a cookies())
│   ├── mercadopago.ts                ← Configuración del SDK
│   └── constants.ts                  ← Planes, precios, categorías
├── app/
│   ├── layout.tsx                    ← Root layout global
│   ├── globals.css                   ← Tailwind + CSS custom
│   │
│   ├── (landing)/                    ← Route group (NO genera segmento en la URL)
│   │   ├── layout.tsx                ← Navbar + Footer
│   │   ├── page.tsx                  ← Landing principal
│   │   ├── precios/page.tsx
│   │   ├── plantillas/page.tsx
│   │   └── components/              ← Componentes exclusivos de la landing
│   │
│   ├── (panel)/                      ← Panel del usuario (requiere auth)
│   │   ├── layout.tsx                ← Sidebar + verificación de sesión
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── editor/page.tsx
│   │   ├── cuenta/page.tsx
│   │   └── components/
│   │
│   ├── (tenant)/                     ← Sitios de los clientes
│   │   └── [domain]/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   └── api/
│       ├── webhooks/mercadopago/route.ts
│       ├── subscription/route.ts
│       └── auth/callback/route.ts
```

### Reglas importantes
- Las carpetas entre paréntesis `()` son **route groups**: NO agregan segmento a la URL.
- `(landing)/page.tsx` responde a `/`, NO a `/landing/`.
- `(panel)/dashboard/page.tsx` responde a `/dashboard`, NO a `/panel/dashboard/`.

---

## 3. Proxy (ex Middleware)

> ⚠️ **BREAKING CHANGE en Next.js 16:** `middleware.ts` fue renombrado a `proxy.ts` y la función exportada debe llamarse `proxy` (no `middleware`).

### Archivo: `src/proxy.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createProxyClient } from '@/lib/supabase/proxy';

export const config = {
  matcher: [
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'sitiolisto.com.ar';

  // Extraer subdominio
  const currentHost =
    process.env.NODE_ENV === 'production'
      ? hostname.replace('.sitiolisto.com.ar', '')
      : hostname.replace('.localhost:3000', '');

  // Panel de administración
  if (currentHost === 'app') {
    // Refrescar sesión de Supabase en cada request
    const { response } = await createProxyClient(req);
    const rewriteUrl = new URL(`/panel${url.pathname}`, req.url);
    // Usamos un header interno para mapear al route group
    return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
  }

  // Landing (dominio principal)
  if (currentHost === 'sitiolisto.com.ar' || currentHost === 'localhost:3000' || currentHost === 'localhost') {
    return NextResponse.next();
  }

  // Sitio de un tenant
  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
}
```

### Cómo funciona el multi-tenant en local

Para probar subdominios en desarrollo, agregá estas líneas a `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1  app.localhost
127.0.0.1  demo.localhost
127.0.0.1  mitienda.localhost
```

Y accedé a `http://app.localhost:3000`, `http://demo.localhost:3000`, etc.

---

## 4. Supabase — Setup y Clientes

### Paso 1: Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → "New Project"
2. Elegir región (preferiblemente `South America (São Paulo)`)
3. Copiar `Project URL` y `anon public key` al `.env.local`

### Paso 2: Configurar providers de auth

1. En Supabase Dashboard → Authentication → Providers
2. Habilitar **Email** (ya viene habilitado por default)
3. Habilitar **Google**:
   - Ir a [Google Cloud Console](https://console.cloud.google.com)
   - Crear OAuth 2.0 credentials
   - Redirect URI: `https://<tu-proyecto>.supabase.co/auth/v1/callback`
   - Copiar Client ID y Secret al provider de Google en Supabase

### Los 3 clientes de Supabase

| Cliente | Dónde se usa | Acceso a cookies |
|---------|-------------|------------------|
| `server.ts` | Server Components, Route Handlers | Sí (via `cookies()`) |
| `browser.ts` | Client Components (`'use client'`) | Sí (automático, browser) |
| `proxy.ts` | `proxy.ts` | Sí (via `request.cookies`) |

### Código de cada cliente

**`src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Ignorar en Server Components */ }
        },
      },
    }
  );
}
```

**`src/lib/supabase/browser.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`src/lib/supabase/proxy.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function createProxyClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, response, user };
}
```

---

## 5. Base de Datos — Esquema SQL

Ejecutar este SQL en el **SQL Editor** de Supabase Dashboard:

```sql
-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles (se crea automáticamente al registrarse)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de plantillas disponibles
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'portfolio', 'ecommerce', 'landing', 'services')),
  thumbnail_url TEXT,
  preview_url TEXT,
  plan_required TEXT NOT NULL DEFAULT 'basic' CHECK (plan_required IN ('basic', 'pro', 'agency')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mp_preapproval_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'agency')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'paused', 'cancelled')),
  amount NUMERIC(10, 2) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de sitios de los clientes
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subdomain TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES public.templates(id),
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sites_subdomain ON public.sites(subdomain);
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Políticas: profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas: templates (públicas para lectura)
CREATE POLICY "Anyone can view active templates" ON public.templates
  FOR SELECT USING (is_active = true);

-- Políticas: subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas: sites
CREATE POLICY "Users can view own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active sites" ON public.sites
  FOR SELECT USING (is_active = true);

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 6. Autenticación

### Login con Email
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'password123',
});
```

### Login con Google
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Callback Route Handler (`src/app/api/auth/callback/route.ts`)
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

### Proteger rutas en el proxy
En `proxy.ts`, para las rutas del panel, verificamos que el usuario esté autenticado:

```typescript
if (currentHost === 'app') {
  const { user, response } = await createProxyClient(req);
  
  // Si no está autenticado y no está en login/registro, redirigir
  const isAuthPage = url.pathname === '/login' || url.pathname === '/registro';
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Si está autenticado y está en login, redirigir al dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.rewrite(new URL(`/panel${url.pathname}`, req.url), {
    headers: response.headers,
  });
}
```

---

## 7. MercadoPago — Suscripciones

### Instalación
```bash
npm install mercadopago
```

### Configuración (`src/lib/mercadopago.ts`)
```typescript
import { MercadoPagoConfig } from 'mercadopago';

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
```

### Planes

| Plan | Precio | `plan_type` |
|------|--------|-------------|
| Básico | $29.999/mes | `basic` |
| Pro | $49.999/mes | `pro` |
| Agencia | $89.999/mes | `agency` |

### Crear suscripción (`src/app/api/subscription/route.ts`)
```typescript
import { Preapproval } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const PLANS = {
  basic:  { amount: 29999, reason: 'SitioListo - Plan Básico' },
  pro:    { amount: 49999, reason: 'SitioListo - Plan Pro' },
  agency: { amount: 89999, reason: 'SitioListo - Plan Agencia' },
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { planType } = await request.json();
  const plan = PLANS[planType as keyof typeof PLANS];
  if (!plan) return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });

  const preapproval = new Preapproval(mpClient);
  const result = await preapproval.create({
    body: {
      reason: plan.reason,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: plan.amount,
        currency_id: 'ARS',
      },
      payer_email: user.email!,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      status: 'pending',
    },
  });

  // Guardar en DB
  await supabase.from('subscriptions').insert({
    user_id: user.id,
    mp_preapproval_id: result.id,
    plan_type: planType,
    amount: plan.amount,
    status: 'pending',
  });

  return NextResponse.json({ init_point: result.init_point });
}
```

### Webhook (`src/app/api/webhooks/mercadopago/route.ts`)
```typescript
import { Preapproval } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Usar service role key para webhooks (no hay sesión de usuario)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  if (body.type === 'preapproval') {
    const preapproval = new Preapproval(mpClient);
    const data = await preapproval.get({ preapprovalId: body.data.id });

    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: data.status,
        current_period_start: data.date_created,
        current_period_end: data.next_payment_date,
        updated_at: new Date().toISOString(),
      })
      .eq('mp_preapproval_id', body.data.id);

    // Activar/desactivar sitio según estado
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('mp_preapproval_id', body.data.id)
      .single();

    if (subscription) {
      await supabaseAdmin
        .from('sites')
        .update({ is_active: data.status === 'authorized' })
        .eq('user_id', subscription.user_id);
    }
  }

  return NextResponse.json({ received: true });
}
```

### Obtener credenciales de MercadoPago
1. Ir a [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. "Mis aplicaciones" → "Crear aplicación"
3. Copiar `Access Token` de prueba al `.env.local`
4. En "Webhooks", configurar la URL: `https://app.sitiolisto.com.ar/api/webhooks/mercadopago`
5. Seleccionar eventos: `preapproval`

### Probar webhooks en local
Usar [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/):
```bash
cloudflared tunnel --url http://localhost:3000
```
Esto te da una URL pública temporal que podés usar como webhook URL en MercadoPago.

---

## 8. Motor de Templates (Tenant)

### Cómo funciona
Cuando alguien visita `mitienda.sitiolisto.com.ar`:

1. `proxy.ts` extrae `mitienda` del hostname
2. Reescribe la URL a `/(tenant)/mitienda`
3. `[domain]/page.tsx` busca el sitio en Supabase por subdomain
4. Obtiene la plantilla y configuración
5. Renderiza dinámicamente

### Archivo: `src/app/(tenant)/[domain]/page.tsx`
```typescript
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function TenantPage({ params }: { params: { domain: string } }) {
  const supabase = await createClient();
  
  const { data: site } = await supabase
    .from('sites')
    .select('*, templates(*)')
    .eq('subdomain', params.domain)
    .eq('is_active', true)
    .single();

  if (!site) return notFound();

  // Renderizar según el template
  const config = site.config as SiteConfig;
  const template = site.templates;

  // Acá se renderiza el componente correspondiente al template
  return <TemplateRenderer template={template} config={config} />;
}
```

### Estructura del `config` JSONB
```json
{
  "businessName": "Mi Restaurante",
  "tagline": "La mejor comida de la ciudad",
  "logo": "https://...",
  "colors": {
    "primary": "#FF6B35",
    "secondary": "#004E89",
    "accent": "#F7C59F",
    "background": "#FFFFFF",
    "text": "#1A1A2E"
  },
  "sections": {
    "hero": { "title": "...", "subtitle": "...", "backgroundImage": "..." },
    "about": { "text": "...", "image": "..." },
    "menu": [...],
    "contact": { "phone": "...", "email": "...", "address": "..." }
  },
  "social": {
    "instagram": "...",
    "facebook": "...",
    "whatsapp": "..."
  }
}
```

---

## 9. Variables de Entorno

Archivo `.env.local` (NUNCA subir a git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...

# MercadoPago
MP_ACCESS_TOKEN=APP_USR-xxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://app.sitiolisto.com.ar
NEXT_PUBLIC_SITE_URL=https://sitiolisto.com.ar
NODE_ENV=production
```

---

## 10. Deploy en Vercel (Front) y Supabase (Back)

### Paso 1: Subir código a Github
Si todavía no lo hiciste, conectá tu repositorio local con Github:

```bash
git init
git add .
git commit -m "Fase 1 completada"
git remote add origin https://github.com/v0id4ss3mbl3r/sitio-listo.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear proyecto en Supabase
1. Ingresá a [Supabase](https://supabase.com) y creá un nuevo proyecto.
2. Copiá tu **Project URL** y **anon public key**.
3. Andá al **SQL Editor** en el dashboard de Supabase y pegá todo el contenido del archivo `supabase-schema.sql` que está en la raíz de tu proyecto. Ejecutalo para crear las tablas y las políticas de seguridad (RLS).
4. Andá a **Authentication > Providers** y habilitá Google (si querés login con Google).
5. En **Authentication > URL Configuration**, configurá tu Site URL base como `https://sitiolisto.com.ar` y agregá las Redirect URLs (ej: `https://app.sitiolisto.com.ar/api/auth/callback`).

### Paso 3: Deploy en Vercel
1. Ingresá a [Vercel](https://vercel.com) y hacé clic en **Add New... > Project**.
2. Importá tu repositorio de Github `v0id4ss3mbl3r/sitio-listo`.
3. En la sección **Environment Variables**, agregá todas las claves de tu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (`https://app.sitiolisto.com.ar`)
   - `NEXT_PUBLIC_SITE_URL` (`https://sitiolisto.com.ar`)
   - (y las de MercadoPago cuando las tengas)
4. Hacé clic en **Deploy**.

### Paso 4: Configurar los Dominios en Vercel y nic.ar (Wildcards Gratis)
Para que los subdominios de tus clientes (`cliente1.sitiolisto.com.ar`) funcionen sin necesidad de pagar el plan Pro de Vercel, tenés que delegar el dominio a los Nameservers de Vercel.

1. En tu dashboard de Vercel, andá a **Settings > Domains**.
2. Agregá `sitiolisto.com.ar` y seleccionalo como dominio principal.
3. Agregá `app.sitiolisto.com.ar` (para el panel).
4. Agregá `*.sitiolisto.com.ar` (el wildcard para los tenants).
5. Vercel te dirá que configures los DNS. Tomá nota de los Nameservers que te da (generalmente `ns1.vercel-dns.com` y `ns2.vercel-dns.com`).
6. Ingresá a [Trámites a Distancia (nic.ar)](https://nic.ar), seleccioná tu dominio `sitiolisto.com.ar` y andá a **Delegar**.
7. Creá las delegaciones ingresando los servidores de Vercel.
8. ¡Listo! Vercel ahora gestiona tu DNS y los subdominios comodín (*.sitiolisto.com.ar) te van a funcionar en el plan Hobby (gratuito) sin problemas.

---

## 11. Convenciones de Código

### Generales
- Archivos en **inglés**, UI y mensajes al usuario en **español**
- TypeScript estricto siempre
- Server Components por default, `'use client'` solo cuando sea necesario
- Imports con alias `@/` (configurado en tsconfig)

### Naming
- Componentes: `PascalCase.tsx`
- Utilidades/libs: `camelCase.ts`
- Rutas API: `route.ts`
- Tipos: interfaces con `I` prefix solo si colisionan, sino PascalCase

### CSS
- Tailwind CSS v4 con `@import "tailwindcss"`
- Variables CSS custom en `globals.css` para el design system
- No usar `@apply` salvo para componentes muy repetidos

### Git
```
feat: nueva funcionalidad
fix: corrección de bug
refactor: refactor sin cambio de funcionalidad
style: cambios de estilos/CSS
docs: documentación
chore: tareas de mantenimiento
```
