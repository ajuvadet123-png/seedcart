import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { getCategoryBySlug, getCategories, getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'featured';
    availability?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const sort = searchParams.sort || 'newest';
  const availability = searchParams.availability;

  const [categories, settings, productsRes] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
    getProducts({
      categorySlug: category.slug,
      sort,
      availability,
    })
  ]);

  const { products, total } = productsRes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      {/* Category Banner - Soft warm beige */}
      <div className="relative rounded-2xl overflow-hidden bg-[#f4efe8] border border-neutral-200/80 mb-10">
        <div className="p-8 sm:p-12 max-w-xl space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">Categories</Link>
            <span>/</span>
            <span className="text-neutral-900">{category.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {category.description}
            </p>
          )}

          <div className="pt-2 text-xs font-semibold text-terracotta">
            {total} {total === 1 ? 'Product Available' : 'Products Available'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters & Other Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#faf8f5] rounded-xl border border-neutral-200/80 p-5 space-y-5 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort & Filter</span>
              </h3>
            </div>

            {/* Sort Options */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Sort Products
              </label>
              <div className="space-y-1">
                {[
                  { label: 'Newest Arrivals', val: 'newest' },
                  { label: 'Price: Low to High', val: 'price_asc' },
                  { label: 'Price: High to Low', val: 'price_desc' },
                  { label: 'Alphabetical (A-Z)', val: 'name_asc' },
                  { label: 'Featured First', val: 'featured' },
                ].map((s) => {
                  const isCurrent = sort === s.val;
                  return (
                    <Link
                      key={s.val}
                      href={`/category/${category.slug}?sort=${s.val}`}
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

            {/* Other Departments */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-200">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Other Departments
              </label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-none">
                {categories.map((c) => {
                  const isSelected = category.slug === c.slug;
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
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
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-[#faf8f5] rounded-xl border border-neutral-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No products in this category yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Stock is currently being updated for {category.name}. Check back soon!
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-4 py-2 bg-black text-white rounded-md text-xs font-semibold hover:bg-neutral-800"
                >
                  Browse All Products
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
