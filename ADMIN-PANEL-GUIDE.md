# SitioListo — Guía de Implementación: Panel de Administración

> **Para el modelo que ejecute esto:** Leé este archivo de principio a fin antes de escribir una sola línea de código. El orden de los pasos importa. No te saltes el Paso 0 (es manual, lo hace el usuario en Supabase).

---

## Contexto

Se necesita un panel de administración en `app.sitiolisto.com.ar/admin` para que el dueño de la plataforma pueda ver métricas, gestionar usuarios, suscripciones, sitios y plantillas.

**Estado actual del proyecto:**
- No existe sistema de roles. La tabla `profiles` no tiene columna `role`.
- El middleware solo verifica si hay sesión (autenticado o no), no roles.
- El panel de usuario vive en `src/app/panel/(dashboard)/` con un layout sidebar+navbar que es un Client Component.
- Ya existe un cliente con `service_role_key` en el webhook de MercadoPago — ese patrón se replica para el admin.
- El design system (CSS variables, `.glass-card`, `.btn-primary`) está en `src/app/globals.css`.
- Íconos disponibles: `lucide-react` (ya instalado).

**URL final:** `app.sitiolisto.com.ar/admin` → middleware reescribe a `/panel/admin` → renderiza `src/app/panel/(dashboard)/admin/page.tsx`

---

## PASO 0 — Migración SQL (el usuario lo ejecuta manualmente)

**Ir a: Supabase Dashboard → SQL Editor → New query → pegar y ejecutar:**

```sql
-- 1. Agregar columna role a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Función helper para RLS (evita recursión en self-referential policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. RLS policies: admins ven y gestionan todo
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

-- 4. Asignar el primer admin
-- Obtener el UUID desde: Supabase Dashboard > Authentication > Users
-- Reemplazar '<UUID_DEL_ADMIN>' con el UUID real
UPDATE public.profiles SET role = 'admin' WHERE id = '<UUID_DEL_ADMIN>';
```

**Verificación:** Ejecutar `SELECT id, email, role FROM public.profiles;` y confirmar que el admin tiene `role = 'admin'`.

---

## PASO 1 — Crear `src/lib/supabase/admin.ts`

Cliente con `service_role_key` que bypasea RLS completamente. **Solo se importa en API Routes (server-side), NUNCA en Client Components.**

```typescript
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

---

## PASO 2 — Crear `src/lib/auth/getAdminUser.ts`

Helper que verifica si el usuario autenticado tiene `role = 'admin'`. Todos los Server Components y API Routes de admin lo usan para double-check de seguridad.

```typescript
import { createClient } from '@/lib/supabase/server';

export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return null;
  return { user, profile };
}
```

---

## PASO 3 — Modificar `src/middleware.ts`

**Cambio 1:** Desestructurar también `supabase` del resultado de `createProxyClient`:

```typescript
// ANTES:
const { user, response } = await createProxyClient(req);

// DESPUÉS:
const { user, response, supabase } = await createProxyClient(req);
```

**Cambio 2:** Agregar bloque de protección para `/admin/*` ANTES del rewrite genérico, dentro del `if (currentHost === 'app')`:

```typescript
// Agregar esto ANTES de la línea que hace el rewrite genérico
if (url.pathname.startsWith('/admin')) {
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
```

**Nota:** `supabase` ya viene del `createProxyClient(req)` que se llama al inicio del bloque `if (currentHost === 'app')`. No se llama dos veces.

---

## PASO 4 — Modificar `src/app/panel/(dashboard)/layout.tsx`

El layout actual es un Client Component. Hay que agregar:

1. Estado `isAdmin` inicializado en `false`.
2. En el `useEffect` donde ya se obtiene la sesión, agregar una query al profile para leer el role.
3. Un link condicional en el sidebar que solo aparece si `isAdmin === true`.

**Agregar en los imports:**
```typescript
import { Shield } from 'lucide-react';
```

**Agregar estado:**
```typescript
const [isAdmin, setIsAdmin] = useState(false);
```

**En el useEffect donde ya se usa supabase (buscar donde se llama `supabase.auth.getUser()` o similar), agregar después de obtener el user:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();
setIsAdmin(profile?.role === 'admin');
```

**En el sidebar, agregar el link de admin (después de los links existentes de navegación):**
```tsx
{isAdmin && (
  <a
    href="/admin"
    style={getLinkStyle('/admin')}  // usar la misma función que usan los otros links
  >
    <Shield size={18} />
    Admin
  </a>
)}
```

---

## PASO 5 — Crear páginas del admin

### `src/app/panel/(dashboard)/admin/layout.tsx`

Layout compartido por todas las páginas de admin. Verifica el rol y agrega sub-navegación.

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import AdminSubNav from './components/AdminSubNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AdminSubNav />
      {children}
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/components/AdminSubNav.tsx`

Sub-navegación horizontal para las secciones del admin. Es un Client Component porque usa `usePathname()`.

```typescript
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/suscripciones', label: 'Suscripciones' },
  { href: '/admin/sitios', label: 'Sitios' },
  { href: '/admin/plantillas', label: 'Plantillas' },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '1rem',
      flexWrap: 'wrap',
    }}>
      {links.map(link => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--color-primary-10, rgba(99,102,241,0.1))' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/page.tsx` — Overview

Server Component. Llama a `/api/admin/stats` para obtener métricas.

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminOverviewPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const adminClient = createAdminClient();

  const [
    { count: totalUsers },
    { count: activeSubs },
    { data: mrrRows },
    { count: activeSites },
    { count: newUsers },
  ] = await Promise.all([
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'authorized'),
    adminClient.from('subscriptions').select('amount').eq('status', 'authorized'),
    adminClient.from('sites').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const mrr = mrrRows?.reduce((sum, s) => sum + Number(s.amount), 0) ?? 0;

  const metrics = [
    { label: 'Usuarios totales', value: totalUsers ?? 0, suffix: '' },
    { label: 'Suscripciones activas', value: activeSubs ?? 0, suffix: '' },
    { label: 'MRR estimado', value: mrr, prefix: '$', isCurrency: true },
    { label: 'Sitios publicados', value: activeSites ?? 0, suffix: '' },
    { label: 'Nuevos (30 días)', value: newUsers ?? 0, suffix: '' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Panel de Administración
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {metrics.map(m => (
          <div key={m.label} className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {m.prefix}{m.isCurrency ? m.value.toLocaleString('es-AR') : m.value}{m.suffix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/usuarios/page.tsx`

Server Component con paginación via searchParams.

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

const PAGE_SIZE = 20;

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const search = searchParams.search ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('profiles')
    .select(`
      id, email, full_name, created_at, role,
      subscriptions!left(status, plan_type, amount),
      sites!left(id, is_active)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) {
    query = query.ilike('email', `%${search}%`);
  }

  const { data: users, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Usuarios ({count ?? 0})
        </h2>
        <form>
          <input
            name="search"
            defaultValue={search}
            placeholder="Buscar por email..."
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          />
        </form>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Email', 'Plan', 'Sitios', 'Rol', 'Registro'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
              const siteCount = Array.isArray(u.sites) ? u.sites.length : 0;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {u.full_name || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: sub?.status === 'authorized' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                      color: sub?.status === 'authorized' ? '#10b981' : 'var(--text-secondary)',
                    }}>
                      {sub?.plan_type ?? 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {siteCount}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    {u.role === 'admin' && (
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: 'rgba(99,102,241,0.15)',
                        color: '#6366f1',
                      }}>
                        admin
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(u.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a
              key={p}
              href={`?page=${p}${search ? `&search=${search}` : ''}`}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                background: p === page ? 'var(--color-primary)' : 'var(--bg-card)',
                color: p === page ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/suscripciones/page.tsx`

Server Component con filtro por estado via searchParams.

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  authorized: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  paused: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  pending: { bg: 'rgba(100,116,139,0.15)', color: '#64748b' },
};

const PAGE_SIZE = 20;

export default async function AdminSuscripcionesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const statusFilter = searchParams.status ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('subscriptions')
    .select(`
      id, plan_type, status, amount, mp_preapproval_id,
      created_at, updated_at,
      profiles!inner(email, full_name)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: subs, count } = await query;

  const statuses = ['', 'authorized', 'paused', 'cancelled', 'pending'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Suscripciones ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {statuses.map(s => (
            <a
              key={s || 'all'}
              href={`?status=${s}`}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: statusFilter === s ? 'var(--color-primary)' : 'var(--bg-card)',
                color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {s || 'Todas'}
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Plan', 'Monto', 'Estado', 'ID MercadoPago', 'Actualizado'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs?.map((s: any) => {
              const statusStyle = STATUS_COLORS[s.status] ?? STATUS_COLORS.pending;
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                    <div style={{ color: 'var(--text-primary)' }}>{s.profiles?.full_name || '—'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.profiles?.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                    {s.plan_type}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    ${Number(s.amount).toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {s.mp_preapproval_id ? s.mp_preapproval_id.substring(0, 16) + '...' : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(s.updated_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/sitios/page.tsx`

Server Component con botón de toggle que usa un Client Component mínimo.

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import SiteToggle from './components/SiteToggle';

const PAGE_SIZE = 20;

export default async function AdminSitiosPage({
  searchParams,
}: {
  searchParams: { page?: string; active?: string };
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const page = Number(searchParams.page ?? 1);
  const activeFilter = searchParams.active;
  const offset = (page - 1) * PAGE_SIZE;

  const adminClient = createAdminClient();
  let query = adminClient
    .from('sites')
    .select(`
      id, subdomain, custom_domain, template_id, is_active,
      created_at, updated_at,
      profiles!inner(email, full_name)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (activeFilter === 'true') query = query.eq('is_active', true);
  if (activeFilter === 'false') query = query.eq('is_active', false);

  const { data: sites, count } = await query;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Sitios ({count ?? 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['', 'Todos'], ['true', 'Activos'], ['false', 'Inactivos']].map(([val, label]) => (
            <a
              key={val}
              href={`?active=${val}`}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: activeFilter === val || (!activeFilter && val === '') ? 'var(--color-primary)' : 'var(--bg-card)',
                color: activeFilter === val || (!activeFilter && val === '') ? '#fff' : 'var(--text-secondary)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Sitio', 'Propietario', 'Dominio personalizado', 'Estado', 'Acción'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sites?.map((site: any) => (
              <tr key={site.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {site.subdomain}.sitiolisto.com.ar
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-primary)' }}>{site.profiles?.full_name || '—'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{site.profiles?.email}</div>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {site.custom_domain || '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: site.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: site.is_active ? '#10b981' : '#ef4444',
                  }}>
                    {site.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <SiteToggle siteId={site.id} isActive={site.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/sitios/components/SiteToggle.tsx`

Client Component mínimo para el botón de toggle:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteToggle({ siteId, isActive }: { siteId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/sitios/${siteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        cursor: loading ? 'wait' : 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : isActive ? 'Desactivar' : 'Activar'}
    </button>
  );
}
```

### `src/app/panel/(dashboard)/admin/plantillas/page.tsx`

```typescript
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import TemplateToggle from './components/TemplateToggle';

export default async function AdminPlantillasPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  const adminClient = createAdminClient();

  const [{ data: templates }, { data: sitesData }] = await Promise.all([
    adminClient.from('templates').select('*').order('sort_order', { ascending: true }),
    adminClient.from('sites').select('template_id'),
  ]);

  // Contar uso por template
  const usageMap: Record<string, number> = {};
  sitesData?.forEach((s: any) => {
    if (s.template_id) usageMap[s.template_id] = (usageMap[s.template_id] ?? 0) + 1;
  });

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Plantillas ({templates?.length ?? 0})
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {templates?.map((t: any) => (
          <div key={t.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  background: 'rgba(99,102,241,0.15)',
                  color: '#6366f1',
                }}>
                  {t.plan_required}
                </span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  background: 'rgba(100,116,139,0.15)',
                  color: 'var(--text-secondary)',
                }}>
                  {t.category}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {usageMap[t.id] ?? 0} sitios activos · sort_order: {t.sort_order}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                background: t.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: t.is_active ? '#10b981' : '#ef4444',
              }}>
                {t.is_active ? 'Activa' : 'Inactiva'}
              </span>
              <TemplateToggle templateId={t.id} isActive={t.is_active} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/app/panel/(dashboard)/admin/plantillas/components/TemplateToggle.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TemplateToggle({ templateId, isActive }: { templateId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/plantillas/${templateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        cursor: loading ? 'wait' : 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : isActive ? 'Desactivar' : 'Activar'}
    </button>
  );
}
```

---

## PASO 6 — Crear API Routes de Admin

**Patrón de seguridad que deben seguir TODAS las API Routes de admin:**

```typescript
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

// Verificación en dos capas:
// 1. Usuario autenticado (anon client con RLS)
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

const { data: profile } = await supabase
  .from('profiles').select('role').eq('id', user.id).single();
if (profile?.role !== 'admin') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

// 2. Operación real con service role (bypasea RLS)
const adminClient = createAdminClient();
```

### `src/app/api/admin/sitios/[id]/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  const { is_active } = await request.json();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('sites')
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

### `src/app/api/admin/plantillas/[id]/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  const body = await request.json();
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.is_active === 'boolean') updateData.is_active = body.is_active;
  if (typeof body.sort_order === 'number') updateData.sort_order = body.sort_order;

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('templates')
    .update(updateData)
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

---

## Orden de implementación recomendado

Ejecutar en este orden para poder probar incrementalmente:

1. Usuario ejecuta el SQL del Paso 0 en Supabase
2. Usuario actualiza su UUID en el SQL (`UPDATE profiles SET role = 'admin' WHERE id = '...'`)
3. Crear `src/lib/supabase/admin.ts`
4. Crear `src/lib/auth/getAdminUser.ts`
5. Modificar `src/middleware.ts` (Paso 3)
6. Crear API Routes: `/api/admin/sitios/[id]/route.ts` y `/api/admin/plantillas/[id]/route.ts`
7. Crear páginas admin en orden: layout → page (overview) → usuarios → suscripciones → sitios → plantillas
8. Modificar `src/app/panel/(dashboard)/layout.tsx` para agregar el link de Admin en el sidebar

---

## Checklist de verificación final

- [ ] Usuario normal NO ve el link "Admin" en el sidebar
- [ ] Ir a `/admin` como usuario normal redirige a `/`
- [ ] Ir a `/admin` como admin muestra el Overview con métricas reales
- [ ] Tabla de Usuarios muestra todos los registrados con sus planes
- [ ] Tabla de Suscripciones filtra correctamente por estado
- [ ] Toggle de sitio activo/inactivo funciona y refresca la tabla
- [ ] Toggle de plantilla activa/inactiva funciona
- [ ] MRR del Overview coincide con la suma de suscripciones `authorized`
- [ ] Las API routes devuelven 403 si se llaman sin ser admin

---

## Variables de entorno requeridas

No se necesitan nuevas. Las siguientes ya deben existir:

```env
NEXT_PUBLIC_SUPABASE_URL=...        # ya existe
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # ya existe
SUPABASE_SERVICE_ROLE_KEY=...       # ya existe (usado en webhook de MercadoPago)
```
