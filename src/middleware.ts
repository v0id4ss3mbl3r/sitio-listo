import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isProduction } from '@/lib/env';
import { createProxyClient } from '@/lib/supabase/proxy';

export const config = {
  matcher: [
    /*
     * Ignorar rutas de API, estáticos, imágenes y archivos con extensión
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') || 'sitiolisto.com.ar').toLowerCase();

  const prod = isProduction();

  // ── Paso 1: detectar dominio raíz de forma inequívoca ──────────────────────
  // Incluimos variantes con puerto por si Vercel reenvía el header así
  const ROOT_DOMAINS = [
    'sitiolisto.com.ar',
    'www.sitiolisto.com.ar',
  ];
  const isRootDomain = ROOT_DOMAINS.some(
    (d) => hostname === d || hostname.startsWith(d + ':')
  );

  // ── Paso 2: extraer currentHost (subdominio) ───────────────────────────────
  let currentHost: string;
  if (prod) {
    if (hostname.endsWith('.sitiolisto.com.ar')) {
      currentHost = hostname.replace('.sitiolisto.com.ar', '').split(':')[0];
    } else {
      // Dominio raíz u otro (lo manejamos abajo con isRootDomain)
      currentHost = hostname.split(':')[0];
    }
  } else {
    // Desarrollo local
    if (hostname.endsWith('.localhost:3000') || hostname.endsWith('.localhost')) {
      currentHost = hostname.replace(/\.localhost(:\d+)?$/, '');
    } else {
      currentHost = hostname.replace(/:\d+$/, ''); // localhost:3000 → localhost
    }
  }

  // 1. Panel de administración/cliente (app.sitiolisto.com.ar)
  if (currentHost === 'app') {
    const { user, response, supabase } = await createProxyClient(req);
    const isAuthPage =
      url.pathname === '/login' ||
      url.pathname === '/registro' ||
      url.pathname === '/recuperar-clave';

    if (!user && !isAuthPage) {
      // No está logueado y quiere acceder al panel -> login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (user && isAuthPage) {
      // Ya está logueado y quiere acceder a login/registro -> dashboard
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (url.pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protección de /admin/*
    if (url.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Reescribir internamente a la carpeta /panel manteniendo las cookies refrescadas
    return NextResponse.rewrite(
      new URL(`/panel${url.pathname}${url.search}`, req.url),
      { headers: response.headers }
    );
  }

  // 2. Dominio principal, localhost o www → Landing Page
  if (
    isRootDomain ||
    currentHost === 'www' ||
    currentHost === 'localhost'
  ) {
    return NextResponse.next();
  }

  // 3. Cualquier otro subdominio → Sitio del tenant
  return NextResponse.rewrite(
    new URL(`/${currentHost}${url.pathname}${url.search}`, req.url)
  );
}
