# SitioListo — Admin Panel: Guía de Referencia

## Qué es

El panel de administración en `/admin` permite al dueño de la plataforma visualizar métricas, gestionar usuarios, suscripciones, sitios y plantillas. Requiere autenticación + rol `admin` en dos capas: middleware + cada API route.

---

## Paso 0 — SQL inicial (ejecutar una sola vez)

```sql
-- Agregar columna role a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Función helper para RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS policies: admins ven todo
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all sites" ON public.sites
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all sites" ON public.sites
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (public.is_admin());

-- Asignar admin (reemplazar con tu UUID real)
UPDATE public.profiles SET role = 'admin' 
WHERE id = 'tu-uuid-aqui';
```

---

## Rutas del admin

| URL | Archivo | Qué muestra |
|-----|---------|------------|
| `/admin` | `src/app/panel/(dashboard)/admin/page.tsx` | Overview con métricas (usuarios totales, suscripciones activas, MRR, sitios, nuevos usuarios) |
| `/admin/usuarios` | `src/app/panel/(dashboard)/admin/usuarios/page.tsx` | Lista de usuarios con plan, sitios, rol, fecha de registro |
| `/admin/suscripciones` | `src/app/panel/(dashboard)/admin/suscripciones/page.tsx` | Lista de suscripciones activas, filtrable por estado |
| `/admin/sitios` | `src/app/panel/(dashboard)/admin/sitios/page.tsx` | Lista de sitios, toggle activo/inactivo |
| `/admin/plantillas` | `src/app/panel/(dashboard)/admin/plantillas/page.tsx` | Lista de plantillas, toggle activo/inactivo, uso, sort_order |

---

## Seguridad

Cada API route y Server Component del admin verifica:
1. Usuario está autenticado (`supabase.auth.getUser()`)
2. Tiene rol `admin` en la tabla `profiles`

Si no cumple, redirige a `/` o devuelve 403. No hay acceso cruzado entre usuarios normales.

---

## Variables de entorno

Las 3 siguientes ya deben existir (se usan en otros lados también):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Checklist de verificación

- [ ] Usuario normal NO ve el link "Admin" en el sidebar
- [ ] Ir a `/admin` como usuario normal redirige a `/`
- [ ] Ir a `/admin` como admin muestra Overview con métricas
- [ ] Tabla Usuarios muestra todos con planes correctos
- [ ] Tabla Suscripciones filtra por estado
- [ ] Toggle sitio activo/inactivo funciona
- [ ] Toggle plantilla activa/inactiva funciona
- [ ] MRR en Overview coincide con suma de suscripciones authorized
