import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../../../lib/auth';
import { getCategories } from '../../../../../lib/data';
import ProductForm from '../../../../../components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const categories = await getCategories(false);

  return (
    <ProductForm categories={categories} />
  );
}
