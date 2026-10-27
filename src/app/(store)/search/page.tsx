import React from 'react';
import Link from 'next/link';
import { Search as SearchIcon, ShoppingBag } from 'lucide-react';
import { getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const [settings, productsRes] = await Promise.all([
    getStoreSettings(),
    query.trim() ? getProducts({ search: query.trim() }) : Promise.resolve({ products: [], total: 0 }),
  ]);

  const { products, total } = productsRes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-emerald-600" />
          <span>Search Results for &ldquo;{query}&rdquo;</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {total} {total === 1 ? 'matching product found' : 'matching products found'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No products matched your search</h2>
          <p className="text-sm text-slate-500">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our departments.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/products"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.contact_whatsapp_number}
            />
          ))}
        </div>
      )}
    </div>
  );
}
