import { NextResponse } from 'next/server';
import { checkLimit } from '@/lib/api/limit';

import { createClient } from '@/lib/supabase/server';
import { validateSubdomain } from '@/lib/validation';

export async function GET(req: Request) {
  // Va por IP y antes de cualquier consulta: es pública y se puede usar para
  // sondear qué subdominios están tomados.
  const frenado = checkLimit(req, 'subdomainCheck');
  if (frenado) return frenado;

  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('subdomain');

    if (!raw) {
      return NextResponse.json(
        { available: false, error: 'Subdominio no provisto' },
        { status: 400 }
      );
    }

    const result = validateSubdomain(raw);
    if (!result.ok) {
      return NextResponse.json({ available: false, error: result.error });
    }
    const subdomain = result.value;

    const supabase = await createClient();

    const { data: existingSite } = await supabase
      .from('sites')
      .select('id, user_id')
      .eq('subdomain', subdomain)
      .maybeSingle();

    if (!existingSite) {
      return NextResponse.json({ available: true });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user && existingSite.user_id === user.id) {
      return NextResponse.json({ available: true, isOwn: true });
    }

    return NextResponse.json({ available: false, error: 'Subdominio en uso' });
  } catch {
    return NextResponse.json(
      { available: false, error: 'Error al verificar' },
      { status: 500 }
    );
  }
}
