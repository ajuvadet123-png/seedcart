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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
          <SearchIcon className="w-6 h-6 text-neutral-900" />
          <span>Results for &ldquo;{query}&rdquo;</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          {total} {total === 1 ? 'matching product found' : 'matching products found'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#faf8f5] rounded-xl border border-neutral-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-neutral-900">No products matched your search</h2>
          <p className="text-xs text-neutral-500">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our departments.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/products"
              className="px-4 py-2 bg-black text-white rounded-md text-xs font-semibold hover:bg-neutral-800"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
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
