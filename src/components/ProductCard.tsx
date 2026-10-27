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
}

export default function ProductCard({ product, whatsappNumber = '919744744960' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
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

  const isOutOfStock = product.availability_status === 'out_of_stock';

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-xl overflow-hidden hover:border-neutral-400 hover:shadow-sm transition-all duration-200 flex flex-col h-full text-neutral-900">
      {/* Top badges & Wishlist */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-[#b85d43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-all shadow-sm"
        aria-label="Save to Wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square w-full bg-[#f8f8f8] overflow-hidden no-underline">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} preview`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            unoptimized
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          {/* Category Label */}
          <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider truncate">
            {product.category_name || product.brand || 'NOVELLA'}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block no-underline text-neutral-900 group-hover:text-[#b85d43] transition-colors">
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
              ₹{product.selling_price.toLocaleString('en-IN')}
            </span>
            {product.original_price && product.original_price > product.selling_price && (
              <span className="text-[11px] text-neutral-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action: WhatsApp Direct Order */}
          {isOutOfStock ? (
            <span className="text-[10px] text-neutral-400 font-medium">Sold Out</span>
          ) : (
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Order on WhatsApp"
              className="p-1.5 text-neutral-700 hover:text-white bg-neutral-100 hover:bg-black border border-neutral-200 hover:border-black rounded-md transition-colors flex items-center gap-1 no-underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
