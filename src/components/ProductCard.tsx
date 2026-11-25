'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Heart } from 'lucide-react';
import { Product } from '@/types';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
  priority?: boolean;
}

export default function ProductCard({ 
  product, 
  whatsappNumber = '919744744960',
  priority = false 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const primaryImage = product.images?.[0]?.image_url || '/images/products/tee-black.jpg';
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

  const isOutOfStock = product.availability_status === 'out_of_stock';

  return (
    <div className="group relative bg-white flex flex-col h-full text-neutral-900 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#f6f6f6] rounded-xl overflow-hidden mb-3 border border-neutral-100 group-hover:border-neutral-300 transition-colors">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-black text-seed text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm border border-black/10">
              -{discountPercent}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase border border-neutral-200 shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 hover:text-black transition-all shadow-xs"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Images with Hover Transition */}
        <Link 
          href={`/product/${product.slug}`} 
          className="relative block w-full h-full no-underline"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
            unoptimized
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} preview`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out absolute inset-0"
              unoptimized
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Card Info */}
      <div className="flex flex-col flex-1 justify-between gap-2 px-0.5">
        <div className="space-y-1">
          {/* Category / Brand */}
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            <span className="truncate">{product.category_name || product.brand || 'SEED'}</span>
            {product.brand && (
              <span className="text-[10px] text-neutral-500 lowercase font-mono">
                {product.brand}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link 
            href={`/product/${product.slug}`} 
            className="block no-underline text-neutral-900 group-hover:text-neutral-700 transition-colors"
          >
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing and Direct WhatsApp Action */}
        <div className="pt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">
              ₹{product.selling_price.toLocaleString('en-IN')}
            </span>
            {product.original_price && product.original_price > product.selling_price && (
              <span className="text-[11px] text-neutral-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Quick WhatsApp order action */}
          {!isOutOfStock && (
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Order on WhatsApp"
              aria-label={`Order ${product.name} on WhatsApp`}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-black text-neutral-700 hover:text-seed border border-neutral-200/80 hover:border-black transition-all flex items-center justify-center active:scale-95 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
