import React from 'react';
import Link from 'next/link';
import { SlidersHorizontal, ShoppingBag } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-neutral-800 font-medium">All Products</span>
          {categorySlug && (
            <>
              <span>/</span>
              <span className="text-neutral-800 font-medium capitalize">{categorySlug.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {isFeatured ? 'Top Deals' :
               isNewArrival ? 'New Arrivals' :
               isBestSeller ? 'Best Sellers' :
               categorySlug ? `${categories.find(c => c.slug === categorySlug)?.name || 'Category'} Collection` :
               'All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Showing {products.length} of {total} {total === 1 ? 'item' : 'items'} available for WhatsApp ordering.
            </p>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                !isFeatured && !isNewArrival && !isBestSeller && !categorySlug
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              All Items
            </Link>
            <Link
              href="/products?featured=true"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                isFeatured
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              Top Deals
            </Link>
            <Link
              href="/products?new_arrival=true"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                isNewArrival
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              New Arrivals
            </Link>
            <Link
              href="/products?best_seller=true"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                isBestSeller
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
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
          <div className="bg-[#faf8f5] rounded-xl border border-neutral-200/80 p-5 space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort & Filter</span>
              </h3>
              {(categorySlug || minPrice || maxPrice || sort !== 'newest') && (
                <Link
                  href="/products"
                  className="text-[11px] font-semibold text-terracotta hover:underline"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Sort Options */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
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
                      className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-200/50'
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-200">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-none">
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    !categorySlug ? 'bg-black text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-200/50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-[10px] ${!categorySlug ? 'text-neutral-300' : 'text-neutral-400'}`}>{total}</span>
                </Link>
                {categories.map((c) => {
                  const isSelected = categorySlug === c.slug;
                  return (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isSelected ? 'bg-black text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-200/50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {c.product_count !== undefined && (
                        <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                          {c.product_count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-200">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
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
                      className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-200/50'
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
            <div className="bg-[#faf8f5] rounded-xl border border-neutral-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No products found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No items match your filter criteria. Try resetting your search filters.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-4 py-2 bg-black text-white rounded-md text-xs font-semibold hover:bg-neutral-800"
                >
                  Reset All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
