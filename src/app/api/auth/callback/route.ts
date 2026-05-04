import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Determinar si debemos ir a app.sitiolisto.com.ar o a localhost
      const isProduction = process.env.NODE_ENV === 'production';
      const panelUrl = isProduction ? process.env.NEXT_PUBLIC_APP_URL : 'http://app.localhost:3000';
      return NextResponse.redirect(`${panelUrl}${next}`);
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const panelUrl = isProduction ? process.env.NEXT_PUBLIC_APP_URL : 'http://app.localhost:3000';
  return NextResponse.redirect(`${panelUrl}/login?error=auth_failed`);
}
