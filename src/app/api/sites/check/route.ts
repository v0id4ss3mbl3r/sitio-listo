import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json({ available: false, error: 'Subdominio no provisto' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verificamos si alguien más está usando este subdominio
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id, user_id')
      .eq('subdomain', subdomain)
      .single();

    if (!existingSite) {
      return NextResponse.json({ available: true });
    }

    // Si existe, verificamos si es del propio usuario (en ese caso, "está disponible" para él)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && existingSite.user_id === user.id) {
      return NextResponse.json({ available: true, isOwn: true });
    }

    return NextResponse.json({ available: false });
  } catch (error) {
    return NextResponse.json({ available: false, error: 'Error al verificar' }, { status: 500 });
  }
}
