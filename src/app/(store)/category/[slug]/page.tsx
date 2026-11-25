import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SlidersHorizontal, ShoppingBag, ArrowRight } from 'lucide-react';
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
      {/* Category Banner - Minimalist SEED Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white p-8 sm:p-14 mb-10 shadow-sm border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-semibold uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-seed">{category.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase font-editorial">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {category.description}
            </p>
          )}

          <div className="pt-2">
            <span className="inline-block text-[11px] font-bold text-seed bg-black/60 px-3 py-1 rounded-full border border-seed/20 uppercase tracking-wider">
              {total} {total === 1 ? 'Product Available' : 'Products Available'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters & Other Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#fafafa] rounded-2xl border border-neutral-200/80 p-5 space-y-5 sticky top-28">
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
                      className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-black text-white font-bold'
                          : 'text-neutral-700 hover:bg-neutral-200/60'
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
                Other Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-none">
                {categories.map((c) => {
                  const isSelected = category.slug === c.slug;
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-200/60'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {c.product_count !== undefined && (
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-seed' : 'text-neutral-400'}`}>
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
            <div className="bg-[#f9f9f9] rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No products in this category yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Stock is currently being updated for {category.name}. Check back soon or browse all collections!
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
