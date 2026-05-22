import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin/api';
import { captureError } from '@/lib/logger';
import { adminUpdateTemplateSchema, parseJson } from '@/lib/schemas';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;
    const parsed = await parseJson(req, adminUpdateTemplateSchema);
    if (!parsed.ok) return parsed.response;

    const { data, error } = await supabase
      .from('templates')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una plantilla con ese slug' },
          { status: 409 }
        );
      }
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ template: data });
  } catch (error) {
    captureError(error, { source: 'admin-templates-patch' });
    return NextResponse.json({ error: 'Error al actualizar la plantilla' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { supabase } = guard;

    const { id } = await params;

    // Si hay sitios usando esta plantilla, rechazamos.
    const { count } = await supabase
      .from('sites')
      .select('id', { count: 'exact', head: true })
      .eq('template_id', id);

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error: `No se puede borrar: ${count} sitio(s) la están usando. Desactivala primero.`,
        },
        { status: 409 }
      );
    }

    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { source: 'admin-templates-delete' });
    return NextResponse.json({ error: 'Error al eliminar plantilla' }, { status: 500 });
  }
}
