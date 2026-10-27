import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Flame, CheckCircle, ShieldCheck, Tag, Info } from 'lucide-react';
import { getProductBySlug, getProducts, getStoreSettings } from '@/lib/data';
import ProductGallery from '@/components/ProductGallery';
import ProductOrderPanel from '@/components/ProductOrderPanel';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const [settings, relatedRes] = await Promise.all([
    getStoreSettings(),
    getProducts({
      categorySlug: product.category_slug,
      limit: 4,
    })
  ]);

  // Exclude current product from related products
  const relatedProducts = relatedRes.products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-700 transition-colors">Products</Link>
        {product.category_slug && (
          <>
            <span>/</span>
            <Link href={`/category/${product.category_slug}`} className="hover:text-emerald-700 transition-colors">
              {product.category_name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            title={product.name}
          />
        </div>

        {/* Right: Product Details & WhatsApp Ordering Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.brand && (
                <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {product.brand}
                </span>
              )}
              {product.is_featured && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              {product.is_best_seller && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span>SKU: <strong className="font-mono text-slate-700">{product.sku}</strong></span>
              <span>•</span>
              <span className={`font-semibold capitalize ${
                product.availability_status === 'in_stock' ? 'text-emerald-700' :
                product.availability_status === 'low_stock' ? 'text-amber-700' :
                'text-rose-600'
              }`}>
                {product.availability_status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* WhatsApp Interactive Ordering Panel */}
          <ProductOrderPanel
            product={product}
            whatsappNumber={settings.contact_whatsapp_number}
          />
        </div>
      </div>

      {/* Description & Specifications Tabs / Details */}
      <div className="border-t border-slate-200 pt-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Full Description */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Product Overview & Description
            </h2>
            <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || product.short_description || 'Detailed specifications and product details are available upon request directly through our WhatsApp team.'}
            </div>
          </div>

          {/* Specifications / Attributes Table */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Specifications
            </h2>
            {product.attributes && product.attributes.length > 0 ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs divide-y divide-slate-100">
                {product.attributes.map((attr) => (
                  <div key={attr.id || attr.attribute_name} className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">{attr.attribute_name}</span>
                    <span className="col-span-2 text-slate-800 font-medium">{attr.attribute_value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-500">
                Standard quality checked specifications. Contact on WhatsApp for specific measurements or material queries.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products from Same Category */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Related Products in {product.category_name || 'Category'}
            </h2>
            {product.category_slug && (
              <Link
                href={`/category/${product.category_slug}`}
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                View More in this Category →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                whatsappNumber={settings.contact_whatsapp_number}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
