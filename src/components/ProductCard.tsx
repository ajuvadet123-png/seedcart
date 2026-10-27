'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Sparkles, Flame, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Product } from '@/types';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product, whatsappNumber = '919744744960' }: ProductCardProps) {
  const primaryImage = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images?.[1]?.image_url;

  // Calculate discount percentage
  const discountPercent = product.original_price && product.original_price > product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : 0;

  const quickWhatsAppUrl = generateWhatsAppOrderUrl({
    productName: product.name,
    sku: product.sku,
    price: product.selling_price,
    quantity: 1,
    productUrl: typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `https://seedcart.shop/product/${product.slug}`,
    whatsappNumber
  });

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}
        {product.is_best_seller && (
          <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Best Seller
          </span>
        )}
        {product.is_new_arrival && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square w-full bg-slate-50 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            unoptimized
          />
        )}
        
        {/* Availability Pill on image */}
        {product.availability_status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-500" />
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-emerald-700 truncate">{product.brand || product.category_name || 'SeedCart'}</span>
          <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Price Row */}
        <div className="mt-auto pt-4 flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-black text-slate-900">
            ₹{product.selling_price.toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.selling_price && (
            <span className="text-xs sm:text-sm text-slate-400 line-through">
              ₹{product.original_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {product.availability_status === 'out_of_stock' ? (
            <button
              disabled
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm shadow-emerald-700/20 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
