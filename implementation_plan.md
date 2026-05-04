# SitioListo — Plan de Implementación (Fase 2)

## Resumen de los requerimientos
1. **Hostear en Vercel + Supabase**: Te daré los pasos exactos para conectar tu repositorio actual (`v0id4ss3mbl3r/sitio-listo`) con Vercel y Supabase.
2. **Página Home (sitiolisto.com.ar)**: ¡Ya está creada! La construimos en la Fase 1. Podés verla entrando a `http://localhost:3000` mientras está corriendo el `npm run dev`. Muestra el Hero, Características (servicios), Plantillas y Precios.
3. **Fase 2 (Auth + Dashboard)**: Construir las páginas de Login, Registro, Dashboard y proteger las rutas del panel.

---

## Propuesta de Implementación

### 1. Actualización de Proxy (Auth Guard)
Actualizaremos el `proxy.ts` para que utilice el cliente de Supabase y bloquee el acceso al panel si el usuario no está logueado.
- Si el usuario va a `app.sitiolisto.com.ar/dashboard` y no está logueado, lo manda a `/login`.
- Si el usuario va a `app.sitiolisto.com.ar/login` y ya está logueado, lo manda a `/dashboard`.

### 2. Páginas de Autenticación (Panel)
Crearemos las pantallas con el mismo diseño *premium glassmorphism* que la landing.
- `[NUEVO] src/app/panel/login/page.tsx`: Formulario de login por email/password y botón de continuar con Google.
- `[NUEVO] src/app/panel/registro/page.tsx`: Formulario de registro por email/password y botón de Google.
- `[NUEVO] src/app/api/auth/callback/route.ts`: Handler para completar el inicio de sesión con Google (OAuth).

### 3. Dashboard del Usuario (Panel)
- `[MODIFICADO] src/app/panel/layout.tsx`: Mejorar el layout del panel, agregando el botón de "Cerrar sesión" y mostrando el nombre/avatar del usuario autenticado.
- `[MODIFICADO] src/app/panel/page.tsx`: El Dashboard que mostrará un mensaje de bienvenida personalizado y un resumen rápido (estado de suscripción, sitio activo, etc.).

---

## Instrucciones para Vercel, Supabase y GitHub

Voy a agregar un archivo o una sección a la documentación actual con un tutorial paso a paso para que conectes tu Github con Vercel y tu base de datos Supabase, configurando los Dominios Custom para que todo el enrutamiento que hicimos funcione en producción (los wildcard domains `*.sitiolisto.com.ar`).

---

## User Review Required

> [!IMPORTANT]
> **Vercel Pro**: Para usar "Wildcard domains" (subdominios dinámicos como `cliente1.sitiolisto.com.ar`, `cliente2.sitiolisto.com.ar`), Vercel requiere que el dominio se configure en una cuenta de **Vercel Pro**. En la capa gratuita (Hobby), Vercel no soporta Wildcard Domains por defecto. 
> ¿Tenés cuenta Vercel Pro o preferís que busquemos una alternativa para el hosting en el futuro? (Por ahora para el frontend y las pruebas, la capa gratuita servirá perfecto, solo afectará la publicación de múltiples subdominios).

> [!NOTE]
> Sobre el "Home", por favor confirmame si pudiste ver la Landing Page abriendo `http://localhost:3000`. Si querés hacerle algún cambio a los textos o servicios, avisame.

Si estás de acuerdo con el plan, confirmá y arranco con la Fase 2 y te preparo la guía de despliegue.
