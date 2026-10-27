import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Clock, 
  MessageCircle, 
  Layers, 
  CheckCircle, 
  ShoppingBag,
  Zap,
  Tag
} from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, settings, featuredRes, newArrivalsRes, bestSellersRes] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
    getProducts({ isFeatured: true, limit: 8 }),
    getProducts({ isNewArrival: true, limit: 8 }),
    getProducts({ isBestSeller: true, limit: 8 }),
  ]);

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={settings.hero_image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Zap className="w-4 h-4" />
              <span>Multi-Category E-Commerce • WhatsApp Direct</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {settings.hero_title || 'Discover Premium Multi-Category Shopping'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {settings.hero_subtitle || 'Explore trending fashion, latest electronics, luxury beauty, and home essentials. Zero checkout forms — order directly on WhatsApp.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 text-base active:scale-95"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to enquire about products available on SeedCart.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all backdrop-blur-md border border-white/15 flex items-center gap-2.5 text-base"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Chat with Support</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="text-2xl font-black text-white">{categories.length}+</p>
                <p className="text-xs text-slate-400">Categories</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Verified Stock</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">Direct</p>
                <p className="text-xs text-slate-400">WhatsApp Orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={cat.image_url || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    fill
                    sizes="100px"
                    className="object-cover object-center"
                    unoptimized
                  />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                {cat.product_count !== undefined && (
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {cat.product_count} {cat.product_count === 1 ? 'Product' : 'Products'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED PRODUCTS */}
      {featuredRes.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Handpicked Collections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>Explore All Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredRes.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.contact_whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. PROMOTIONAL HERO BANNER / HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-300 backdrop-blur-sm border border-white/10">
              Personalized Shopping Assistance
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Looking for something specific or customized?
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Our direct WhatsApp assistance connects you directly with our catalog curators. Request size recommendations, alternative colors, bulk inquiries, or availability.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello SeedCart! I am looking for custom recommendations.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-md text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      {newArrivalsRes.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Just Landed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products?new_arrival=true"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>View All New</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivalsRes.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.contact_whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. BEST SELLERS */}
      {bestSellersRes.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/products?best_seller=true"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>Explore Best Sellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellersRes.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.contact_whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE SEEDCART */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Effortless WhatsApp Shopping Flow
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Browse any item, tap order, and our team immediately checks live stock and arranges direct courier dispatch to your location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select Your Product</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pick your preferred size, colour, or model from our wide selection of categories.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Tap Order on WhatsApp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A pre-filled message with the exact product link, SKU, and options opens right in WhatsApp.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Confirm & Relax</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our support team confirms availability and handles safe dispatch directly to you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
