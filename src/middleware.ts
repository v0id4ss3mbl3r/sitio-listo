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

    // Una sola query a profiles trae role + blocked_until para no duplicar
    // requests por request (admin check y block check los necesitan).
    let profileRole: string | null = null;
    let blockedUntil: string | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, blocked_until')
        .eq('id', user.id)
        .maybeSingle();
      profileRole = profile?.role ?? null;
      blockedUntil = profile?.blocked_until ?? null;
    }

    // Bloqueo: si profile.blocked_until > NOW() y NO es admin, cerramos sesión
    // y mandamos a login con el motivo. Admins no se pueden bloquear a sí mismos
    // (lo prevenimos en el endpoint) pero por las dudas, no aplicamos esto a admins.
    if (
      user &&
      blockedUntil &&
      new Date(blockedUntil).getTime() > Date.now() &&
      profileRole !== 'admin'
    ) {
      await supabase.auth.signOut();
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('blocked_until', blockedUntil);
      return NextResponse.redirect(loginUrl, { headers: response.headers });
    }

    // Protección de /admin/*
    if (url.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      if (profileRole !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Reenviar el user id + rol ya validados como headers de request, para que
    // las páginas del server no tengan que re-llamar getUser()/profiles.
    // Borramos cualquier valor entrante del cliente antes de setear el nuestro
    // (anti-spoofing). Estos headers van solo en el request, no en la respuesta.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.delete('x-sl-uid');
    requestHeaders.delete('x-sl-role');
    if (user) {
      requestHeaders.set('x-sl-uid', user.id);
      if (profileRole) requestHeaders.set('x-sl-role', profileRole);
    }

    // Reescribir internamente a la carpeta /panel manteniendo las cookies refrescadas
    return NextResponse.rewrite(
      new URL(`/panel${url.pathname}${url.search}`, req.url),
      { request: { headers: requestHeaders }, headers: response.headers }
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
