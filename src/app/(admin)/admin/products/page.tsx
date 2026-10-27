import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../../lib/auth';
import { getCategories } from '../../../../lib/data';
import { query } from '../../../../lib/db';
import ProductManagementTable from '../../../../components/admin/ProductManagementTable';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: {
    category?: string;
    status?: string;
    featured?: string;
    new_arrival?: string;
    best_seller?: string;
    availability?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const whereClauses: string[] = [];
  const params: any[] = [];
  let pIdx = 1;

  if (searchParams.category && searchParams.category !== 'all') {
    whereClauses.push(`p.category_id = $${pIdx++}`);
    params.push(searchParams.category);
  }

  if (searchParams.status && searchParams.status !== 'all') {
    whereClauses.push(`p.publication_status = $${pIdx++}`);
    params.push(searchParams.status);
  }

  if (searchParams.featured === 'true') {
    whereClauses.push(`p.is_featured = true`);
  }

  if (searchParams.new_arrival === 'true') {
    whereClauses.push(`p.is_new_arrival = true`);
  }

  if (searchParams.best_seller === 'true') {
    whereClauses.push(`p.is_best_seller = true`);
  }

  if (searchParams.availability && searchParams.availability !== 'all') {
    whereClauses.push(`p.availability_status = $${pIdx++}`);
    params.push(searchParams.availability);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT 
      p.*,
      c.name as category_name,
      COALESCE(
        (SELECT img.image_url FROM product_images img WHERE img.product_id = p.id AND img.is_primary = true LIMIT 1),
        (SELECT img.image_url FROM product_images img WHERE img.product_id = p.id LIMIT 1),
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=200&q=80'
      ) as primary_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSql}
    ORDER BY p.created_at DESC
  `;

  const [prodsRes, categories] = await Promise.all([
    query(sql, params),
    getCategories(false),
  ]);

  return (
    <ProductManagementTable
      initialProducts={prodsRes.rows}
      categories={categories}
    />
  );
}
