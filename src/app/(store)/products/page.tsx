import React from 'react';
import Link from 'next/link';
import { Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    featured?: string;
    new_arrival?: string;
    best_seller?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'featured';
    min_price?: string;
    max_price?: string;
    availability?: string;
    q?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const isFeatured = searchParams.featured === 'true';
  const isNewArrival = searchParams.new_arrival === 'true';
  const isBestSeller = searchParams.best_seller === 'true';
  const sort = searchParams.sort || 'newest';
  const categorySlug = searchParams.category;
  const minPrice = searchParams.min_price ? parseFloat(searchParams.min_price) : undefined;
  const maxPrice = searchParams.max_price ? parseFloat(searchParams.max_price) : undefined;
  const availability = searchParams.availability;
  const search = searchParams.q;

  const [categories, settings, productsRes] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
    getProducts({
      categorySlug,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sort,
      minPrice,
      maxPrice,
      availability,
      search,
    })
  ]);

  const { products, total } = productsRes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">All Products</span>
          {categorySlug && (
            <>
              <span>/</span>
              <span className="text-emerald-700 font-semibold capitalize">{categorySlug.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isFeatured ? 'Featured Collection' :
               isNewArrival ? 'New Arrivals' :
               isBestSeller ? 'Best Sellers' :
               categorySlug ? `${categories.find(c => c.slug === categorySlug)?.name || 'Category'} Collection` :
               'All Products'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing {products.length} of {total} {total === 1 ? 'item' : 'items'} available for instant WhatsApp ordering.
            </p>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                !isFeatured && !isNewArrival && !isBestSeller && !categorySlug
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Items
            </Link>
            <Link
              href="/products?featured=true"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                isFeatured
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Featured
            </Link>
            <Link
              href="/products?new_arrival=true"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                isNewArrival
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              New Arrivals
            </Link>
            <Link
              href="/products?best_seller=true"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                isBestSeller
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Best Sellers
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filters & Sorting</span>
              </h3>
              {(categorySlug || minPrice || maxPrice || sort !== 'newest') && (
                <Link
                  href="/products"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Reset All
                </Link>
              )}
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Sort By
              </label>
              <div className="space-y-1">
                {[
                  { label: 'Newest Arrivals', val: 'newest' },
                  { label: 'Price: Low to High', val: 'price_asc' },
                  { label: 'Price: High to Low', val: 'price_desc' },
                  { label: 'Alphabetical (A-Z)', val: 'name_asc' },
                  { label: 'Featured First', val: 'featured' },
                ].map((s) => {
                  const params = new URLSearchParams(searchParams as any);
                  params.set('sort', s.val);
                  const isCurrent = sort === s.val;
                  return (
                    <Link
                      key={s.val}
                      href={`/products?${params.toString()}`}
                      className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !categorySlug ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-slate-400 text-[10px]">{total}</span>
                </Link>
                {categories.map((c) => {
                  const isSelected = categorySlug === c.slug;
                  return (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSelected ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {c.product_count !== undefined && (
                        <span className="text-slate-400 text-[10px]">{c.product_count}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Availability
              </label>
              <div className="space-y-1">
                {[
                  { label: 'All Items', val: 'all' },
                  { label: 'In Stock Only', val: 'in_stock' },
                  { label: 'Out of Stock', val: 'out_of_stock' },
                ].map((av) => {
                  const params = new URLSearchParams(searchParams as any);
                  if (av.val === 'all') params.delete('availability');
                  else params.set('availability', av.val);
                  const isCurrent = (availability || 'all') === av.val;
                  return (
                    <Link
                      key={av.val}
                      href={`/products?${params.toString()}`}
                      className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {av.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any products matching your selected filters. Try broadening your criteria or reset filters.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Reset All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
