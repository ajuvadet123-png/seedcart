import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle, 
  ShoppingBag, 
  PackageCheck, 
  Sparkles, 
  Clock, 
  Headphones,
  ShieldCheck,
  Send
} from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, settings, featuredRes, trendingRes, recommendedRes] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
    getProducts({ isFeatured: true, limit: 10 }),
    getProducts({ isBestSeller: true, limit: 10 }),
    getProducts({ limit: 10, sort: 'newest' }),
  ]);

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-white">
      {/* 1. HERO BANNER - Soft warm beige, living room lifestyle, terracotta accent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-2xl overflow-hidden bg-[#f4efe8] border border-neutral-200/60 grid grid-cols-1 lg:grid-cols-12 min-h-[420px] sm:min-h-[460px]">
          {/* Left Text Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 z-10">
            <span className="text-[11px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              QUALITY. STYLE. EVERYDAY.
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-[1.15]">
              Everything You Love,<br />
              <span className="text-terracotta">All in One Place.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed font-normal">
              Shop top-quality products across all categories with unbeatable prices and a seamless experience.
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-md transition-all shadow-sm active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Three Icon Features */}
            <div className="pt-6 border-t border-neutral-300/60 grid grid-cols-3 gap-4 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs leading-tight">Product Variety</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs leading-tight">Easy WhatsApp Order</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs leading-tight">Personal Assistance</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
              alt="Contemporary warm living room interior"
              fill
              priority
              className="object-cover object-center"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY - Circular Tiles Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Circular Category Tiles */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center flex-shrink-0 group text-center w-20 sm:w-24"
            >
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full overflow-hidden bg-neutral-100 border border-neutral-200/80 mb-2 group-hover:border-terracotta group-hover:scale-105 transition-all duration-300">
                <Image
                  src={cat.image_url || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  fill
                  sizes="84px"
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-neutral-800 group-hover:text-terracotta transition-colors line-clamp-1 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. THREE PROMOTIONAL BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Deal of the Day (Warm beige) */}
          <div className="bg-[#f4ede4] rounded-xl border border-neutral-200/60 p-6 flex justify-between items-center relative overflow-hidden group">
            <div className="space-y-1 z-10 max-w-[60%]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Deal of the Day
              </span>
              <h3 className="text-xl font-black text-neutral-900 leading-tight">
                Up to 60% Off
              </h3>
              <p className="text-[11px] text-neutral-600 line-clamp-1">
                Top electronics & accessories
              </p>
              <div className="pt-2">
                <Link
                  href="/products?featured=true"
                  className="text-xs font-bold text-neutral-900 hover:text-terracotta inline-flex items-center gap-1"
                >
                  <span>Shop Deals</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                alt="Headphones deal"
                fill
                sizes="128px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Card 2: New Arrivals (Light grey/ivory) */}
          <div className="bg-[#e8e4dc] rounded-xl border border-neutral-200/60 p-6 flex justify-between items-center relative overflow-hidden group">
            <div className="space-y-1 z-10 max-w-[60%]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                New Season
              </span>
              <h3 className="text-xl font-black text-neutral-900 leading-tight">
                Fresh Finds
              </h3>
              <p className="text-[11px] text-neutral-600 line-clamp-1">
                Trendy apparel & daily essentials
              </p>
              <div className="pt-2">
                <Link
                  href="/products?new_arrival=true"
                  className="text-xs font-bold text-neutral-900 hover:text-terracotta inline-flex items-center gap-1"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                alt="Fresh sneakers"
                fill
                sizes="128px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Card 3: Exclusive Offers (Black / Charcoal) */}
          <div className="bg-[#181818] text-white rounded-xl border border-neutral-800 p-6 flex justify-between items-center relative overflow-hidden group">
            <div className="space-y-1 z-10 max-w-[60%]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-light">
                Exclusive Curation
              </span>
              <h3 className="text-xl font-black text-white leading-tight">
                Curated Picks
              </h3>
              <p className="text-[11px] text-neutral-400 line-clamp-1">
                Handpicked premium collections
              </p>
              <div className="pt-2">
                <Link
                  href="/products?best_seller=true"
                  className="text-xs font-bold text-terracotta-light hover:text-white inline-flex items-center gap-1"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80"
                alt="Curated accessories"
                fill
                sizes="128px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRENDING NOW PRODUCT SECTION (5 per row on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Trending Now
          </h2>
          <Link
            href="/products?best_seller=true"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {trendingRes.products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.contact_whatsapp_number}
            />
          ))}
        </div>
      </section>

      {/* 5. SERVICE BENEFITS STRIP - Pale Ivory Background */}
      <section className="w-full bg-[#f8f6f0] border-y border-neutral-200/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-neutral-900 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Easy WhatsApp Ordering</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Direct checkout via prefilled chat</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-900 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Quality Assured</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Genuine multi-category inventory</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Headphones className="w-5 h-5 text-neutral-900 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Personal Assistance</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Direct support from store curators</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-neutral-900 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Wide Selection</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Fashion, gadgets, beauty & home</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED FOR YOU (5 per row on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Recommended for You
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {recommendedRes.products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.contact_whatsapp_number}
            />
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER / WHATSAPP CONNECT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f2ece3] rounded-2xl border border-neutral-200/70 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Lifestyle Photo */}
          <div className="md:col-span-4 relative h-48 sm:h-56 rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
              alt="Lifestyle decor"
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Right Text & WhatsApp Connect Form */}
          <div className="md:col-span-8 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              VIP UPDATES & INQUIRIES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Stay in the Loop
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg">
              Connect on WhatsApp to receive alerts on fresh arrivals, custom recommendations, and exclusive promotions.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to subscribe for WhatsApp updates and deals from NOVELLA.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-md text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
