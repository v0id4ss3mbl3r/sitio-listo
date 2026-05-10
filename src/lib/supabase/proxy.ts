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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          const isProduction = process.env.VERCEL === '1';
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = isProduction
              ? { ...options, domain: '.sitiolisto.com.ar' }
              : options;
            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  // Refrescar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, response, user };
}
