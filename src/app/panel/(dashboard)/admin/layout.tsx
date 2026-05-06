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
