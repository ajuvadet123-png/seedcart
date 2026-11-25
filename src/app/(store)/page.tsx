import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MessageCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2
} from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import NewsletterForm from '@/components/NewsletterForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, settings, newArrivalsRes, bestSellersRes] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
    getProducts({ isNewArrival: true, limit: 8 }),
    getProducts({ isBestSeller: true, limit: 4 }),
  ]);

  // Ensure 8 items for the 4-column New Arrivals grid
  const newArrivals = newArrivalsRes.products.length >= 4 
    ? newArrivalsRes.products 
    : (await getProducts({ limit: 8, sort: 'newest' })).products;

  // Best sellers (4 items for clean 4-column row)
  const bestSellers = bestSellersRes.products.length > 0 
    ? bestSellersRes.products 
    : (await getProducts({ limit: 4, sort: 'featured' })).products;

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  // 6 Curated Featured Collections in 3x2 grid
  const featuredCollectionTiles = [
    {
      title: "Footwear",
      slug: "footwear",
      image: "/images/collections/footwear.jpg",
      count: "Runners & Retro Sneakers",
    },
    {
      title: "Jackets",
      slug: "fashion-clothing",
      image: "/images/collections/jackets.jpg",
      count: "Technical Shells & Outerwear",
    },
    {
      title: "Accessories",
      slug: "fashion-accessories",
      image: "/images/collections/accessories.jpg",
      count: "Timepieces & Leather Goods",
    },
    {
      title: "Headwear",
      slug: "fashion-accessories",
      image: "/images/collections/headwear.jpg",
      count: "Technical Caps & Beanies",
    },
    {
      title: "Bags",
      slug: "fashion-accessories",
      image: "/images/collections/bags.jpg",
      count: "Modular Slings & Packs",
    },
    {
      title: "Bottoms",
      slug: "fashion-clothing",
      image: "/images/collections/bottoms.jpg",
      count: "Utility Cargo & Trousers",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-white">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-center justify-center text-center text-white p-6 sm:p-12 shadow-xl bg-neutral-900 border border-neutral-800">
          {/* Winter Sport Lifestyle Photograph */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-sport.jpg"
              alt="SEED Sport Project - Winter Outdoor Mountaineering and Streetwear"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/45 to-black/35 backdrop-brightness-[0.88]" />

          {/* Centered Editorial Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-7">
            {/* Small pill-shaped badge reading "ROOTED IN QUALITY" */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white tracking-[0.2em] uppercase shadow-md">
              <span className="w-2 h-2 rounded-full bg-seed animate-pulse"></span>
              <span>Rooted in Quality</span>
            </div>

            {/* Large two-line headline with editorial styling */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05] font-editorial sm:tracking-[-0.01em]">
              SEED SPORT <br />
              <span className="text-seed drop-shadow-[0_0_25px_rgba(57,255,0,0.4)]">
                PROJECT
              </span>
            </h1>

            {/* Short supporting description */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-200 max-w-xl mx-auto font-normal leading-relaxed">
              Engineered for movement, tailored for life. Discover premium apparel, contemporary streetwear, and everyday essentials built to endure.
            </p>

            {/* Two rounded CTA buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto px-9 py-3.5 bg-white hover:bg-neutral-100 text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg active:scale-95 border border-white"
              >
                SHOP NOW
              </Link>
              <Link
                href="/products?featured=true"
                className="w-full sm:w-auto px-9 py-3.5 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all border border-white/30 hover:border-seed active:scale-95"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS (4-column product grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight uppercase font-editorial">
            NEW ARRIVALS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Our latest drops designed to elevate your everyday wardrobe and active lifestyle.
          </p>
        </div>

        {/* 4-column responsive product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newArrivals.slice(0, 8).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.contact_whatsapp_number}
              priority={idx < 4}
            />
          ))}
        </div>

        {/* Centered View All pill button */}
        <div className="mt-12 text-center">
          <Link
            href="/products?new_arrival=true"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 border border-black hover:border-seed"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5 text-seed" />
          </Link>
        </div>
      </section>

      {/* 3. PROMOTIONAL EDITORIAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f6f6f6] rounded-3xl overflow-hidden border border-neutral-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left: Tokyo-Style Flagship Store Image */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-full">
            <Image
              src="/images/promo-store.jpg"
              alt="SEED Tokyo Concept Store"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute top-6 left-6 z-10 bg-black text-seed font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-seed/20 shadow-md">
              Special Edition
            </div>
          </div>

          {/* Right: Editorial Typography & Offer Callout */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6 bg-white">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                FLAGSHIP SPOTLIGHT
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-tight font-editorial">
                Find Your Perfect <br />
                Look at SEED
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Inspired by modern functional minimalism, SEED delivers contemporary street silhouettes, technical outerwear, and premium accessories rooted in authentic craftsmanship.
              </p>
            </div>

            {/* Offer highlight block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f9f9f9] border border-neutral-200/80 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Exclusive WhatsApp Privilege
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  Enjoy Up to 50% Off
                </span>
                <span className="text-xs font-bold text-seed bg-black px-2 py-0.5 rounded-full">
                  SALE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Explore hand-selected promotional styles available for instant direct WhatsApp orders.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm border border-black hover:border-seed"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5 text-seed" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS (6 Collection Tiles in 3x2 Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight uppercase font-editorial">
            FEATURED COLLECTIONS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Curate your wardrobe with our signature department edits and lifestyle categories.
          </p>
        </div>

        {/* 6 collection tiles in 3x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredCollectionTiles.map((tile) => (
            <Link
              key={tile.title}
              href={`/category/${tile.slug}`}
              className="group relative h-52 sm:h-64 lg:h-76 rounded-2xl overflow-hidden block border border-neutral-200/80 shadow-xs focus:outline-none"
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-300" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                <span className="text-white font-black text-base sm:text-xl lg:text-2xl tracking-tight uppercase group-hover:text-seed transition-colors font-editorial">
                  {tile.title}
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-300 font-medium mt-1">
                  {tile.count}
                </span>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black bg-white px-3.5 py-1 rounded-full">
                    <span>Explore</span>
                    <ArrowUpRight className="w-3 h-3 text-black" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                SIGNATURE STAPLES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase font-editorial">
                BEST SELLERS
              </h2>
            </div>
            <Link
              href="/products?best_seller=true"
              className="text-xs font-bold text-black hover:text-seed uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5 text-seed" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.contact_whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. BRAND VALUE PROPOSITION STRIP */}
      <section className="border-y border-neutral-200/80 bg-[#fbfbfb] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-seed fill-seed/20" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Instant WhatsApp Order
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Direct checkout via prefilled chat with zero registration barrier.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-seed" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Rooted in Quality
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Every piece tested for durability, premium comfort, and longevity.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-seed" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Direct Dispatch
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Fast courier fulfillment with tracking details delivered to your WhatsApp.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-seed" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Curator Assistance
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Live consultation on sizing, styling, and custom requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER / WHATSAPP VIP UPDATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-xl border border-neutral-800">
          <div className="space-y-2">
            <span className="text-seed text-[10px] font-bold uppercase tracking-widest">
              COMMUNITY &amp; DROPS
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-editorial">
              Sign Up To Our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Get exclusive secret discounts, new collection previews, and seasonal drops sent directly to you.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <NewsletterForm />

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to subscribe for WhatsApp updates and deals from SEED.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-seed hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-seed" />
                <span>Or connect directly on WhatsApp VIP Club →</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
