import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../../lib/auth';
import { getCategories } from '../../../../lib/data';
import CategoryManagement from '../../../../components/admin/CategoryManagement';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const categories = await getCategories(false);

  return (
    <CategoryManagement initialCategories={categories} />
  );
}
