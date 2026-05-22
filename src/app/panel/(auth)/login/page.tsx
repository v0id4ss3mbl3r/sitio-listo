import LoginForm from './LoginForm';

// Página dinámica — depende del query param `blocked_until`. Marcarlo
// explícito evita el "prerender error" de Vercel cuando Next.js intenta
// build-time-renderizar y se encuentra con searchParams.
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ blocked_until?: string }>;
}) {
  const { blocked_until } = await searchParams;
  return <LoginForm blockedUntil={blocked_until ?? null} />;
}
