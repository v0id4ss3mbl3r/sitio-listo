import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { subdomain, template_id, config } = body;

    if (!subdomain || !template_id) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Verificar si el subdominio ya existe
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id, user_id')
      .eq('subdomain', subdomain)
      .single();

    if (existingSite && existingSite.user_id !== user.id) {
      return NextResponse.json({ error: 'El subdominio ya está en uso' }, { status: 409 });
    }

    // Upsert (crear o actualizar) el sitio del usuario
    // Como la regla es 1 sitio por usuario en el plan básico, buscamos su sitio actual
    const { data: userSite } = await supabase
      .from('sites')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (userSite) {
      // Actualizar
      result = await supabase
        .from('sites')
        .update({
          subdomain,
          template_id,
          config,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userSite.id)
        .select()
        .single();
    } else {
      // Crear
      result = await supabase
        .from('sites')
        .insert({
          user_id: user.id,
          subdomain,
          template_id,
          config,
          is_active: true, // Asumimos activo por defecto, o basado en suscripción
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, site: result.data });
  } catch (error) {
    console.error('Sites API Error:', error);
    return NextResponse.json({ error: 'Error al guardar el sitio' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found", which is fine

    return NextResponse.json({ site: data || null });
  } catch (error) {
    console.error('Sites API Error:', error);
    return NextResponse.json({ error: 'Error al obtener el sitio' }, { status: 500 });
  }
}
