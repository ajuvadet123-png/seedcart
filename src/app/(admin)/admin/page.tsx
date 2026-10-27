import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminRootPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) {
    redirect('/admin/dashboard');
  }

  return <AdminLoginForm />;
}
