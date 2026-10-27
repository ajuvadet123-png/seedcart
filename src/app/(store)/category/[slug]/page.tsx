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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white mb-10 shadow-lg">
        {category.image_url && (
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              priority
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:underline">Categories</Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {category.description}
            </p>
          )}

          <div className="pt-2 text-xs text-emerald-400 font-medium">
            {total} {total === 1 ? 'Product Available' : 'Products Available'} in this category
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters & Other Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Sort & Filter</span>
              </h3>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
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

            {/* Other Departments */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Explore Other Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {categories.map((c) => {
                  const isSelected = category.slug === c.slug;
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
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
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products in this category yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Our managers are currently updating stock for {category.name}. Check back soon or explore other departments!
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse All Products
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
