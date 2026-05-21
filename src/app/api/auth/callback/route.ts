import { NextResponse } from 'next/server';

import { isProduction } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_NEXT_PATHS = new Set([
  '/',
  '/restablecer-clave',
  '/cuenta',
  '/editor',
]);

function safeNext(value: string | null): string {
  if (!value) return '/';
  // Solo aceptamos paths internos absolutos (que empiecen con /) y de la
  // whitelist. Evita que un atacante use ?next=https://evil.com para
  // redirigir post-login a un dominio externo.
  if (!value.startsWith('/') || value.startsWith('//')) return '/';
  return ALLOWED_NEXT_PATHS.has(value) ? value : '/';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));

  const panelUrl = isProduction()
    ? process.env.NEXT_PUBLIC_APP_URL
    : 'http://app.localhost:3000';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${panelUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${panelUrl}/login?error=auth_failed`);
}
