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

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'sitiolisto.com.ar';

  // Extraer subdominio según entorno
  const isProduction =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';

  const currentHost = isProduction
    ? hostname.replace('.sitiolisto.com.ar', '')
    : hostname.replace('.localhost:3000', '');

  // 1. Panel de administración/cliente (app.sitiolisto.com.ar)
  if (currentHost === 'app') {
    const { user, response } = await createProxyClient(req);
    const isAuthPage = url.pathname === '/login' || url.pathname === '/registro';

    if (!user && !isAuthPage) {
      // No está logueado y quiere acceder al panel -> login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (user && isAuthPage) {
      // Ya está logueado y quiere acceder a login/registro -> dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Reescribir internamente a la carpeta /panel manteniendo las cookies refrescadas
    return NextResponse.rewrite(
      new URL(`/panel${url.pathname}${url.search}`, req.url),
      { headers: response.headers }
    );
  }

  // 2. Dominio principal, localhost o www → Landing Page
  if (
    currentHost === 'sitiolisto.com.ar' ||
    currentHost === 'www' ||
    currentHost === 'localhost:3000' ||
    currentHost === 'localhost'
  ) {
    return NextResponse.next();
  }

  // 3. Cualquier otro subdominio → Sitio del tenant
  return NextResponse.rewrite(
    new URL(`/${currentHost}${url.pathname}${url.search}`, req.url)
  );
}
