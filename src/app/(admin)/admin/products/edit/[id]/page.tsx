import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProductById, getCategories } from '@/lib/data';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories(false)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      categories={categories}
      initialData={product}
    />
  );
}
