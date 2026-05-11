import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  const hostname = req.headers.get('host') || 'sitiolisto.com.ar';

  // Extraer subdominio según entorno
  const isProduction =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';

  // Debug logging para producción
  if (isProduction) {
    console.log('[Middleware] Hostname:', hostname);
  }

  // Detectar dominio base (sin subdominio)
  const isRootDomain = hostname === 'sitiolisto.com.ar' || hostname === 'www.sitiolisto.com.ar';
  
  // Extraer subdominio
  let currentHost: string;
  if (isProduction) {
    if (hostname.endsWith('.sitiolisto.com.ar')) {
      currentHost = hostname.replace('.sitiolisto.com.ar', '');
    } else {
      currentHost = hostname; // Fallback
    }
  } else {
    if (hostname.endsWith('.localhost:3000')) {
      currentHost = hostname.replace('.localhost:3000', '');
    } else {
      currentHost = hostname.replace(':3000', ''); // Para localhost:3000 sin subdominio
    }
  }

  if (isProduction) {
    console.log('[Middleware] CurrentHost:', currentHost, 'isRootDomain:', isRootDomain);
  }

  // 1. Panel de administración/cliente (app.sitiolisto.com.ar)
  if (currentHost === 'app') {
    const { user, response, supabase } = await createProxyClient(req);
    const isAuthPage = url.pathname === '/login' || url.pathname === '/registro';

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
    currentHost === 'localhost' ||
    currentHost === 'localhost:3000'
  ) {
    if (isProduction) {
      console.log('[Middleware] Routing to landing page');
    }
    return NextResponse.next();
  }

  // 3. Cualquier otro subdominio → Sitio del tenant
  return NextResponse.rewrite(
    new URL(`/${currentHost}${url.pathname}${url.search}`, req.url)
  );
}
