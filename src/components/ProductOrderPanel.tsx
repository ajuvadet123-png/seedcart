'use client';

import React, { useState, useMemo } from 'react';
import { MessageCircle, Plus, Minus, Check, ShieldCheck, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';

interface ProductOrderPanelProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductOrderPanel({ product, whatsappNumber = '919744744960' }: ProductOrderPanelProps) {
  // Extract variant groups (e.g. Size, Colour, Option)
  const variantsByType = useMemo(() => {
    const map: Record<string, ProductVariant[]> = {};
    if (product.variants && Array.isArray(product.variants)) {
      for (const v of product.variants) {
        if (!map[v.variant_type]) {
          map[v.variant_type] = [];
        }
        map[v.variant_type].push(v);
      }
    }
    return map;
  }, [product.variants]);

  // Selected options state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(variantsByType).forEach(type => {
      if (variantsByType[type].length > 0) {
        initial[type] = variantsByType[type][0].variant_value;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const currentPrice = product.selling_price;
  const totalPrice = currentPrice * quantity;

  // Build current product page URL safely
  const productUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://seedcart.shop/product/${product.slug}`;

  // Generate WhatsApp Order URL
  const whatsappUrl = generateWhatsAppOrderUrl({
    productName: product.name,
    sku: product.sku,
    price: currentPrice,
    quantity,
    size: selectedVariants['Size'] || null,
    colour: selectedVariants['Colour'] || selectedVariants['Color'] || null,
    variant: Object.keys(selectedVariants)
      .filter(k => k !== 'Size' && k !== 'Colour' && k !== 'Color')
      .map(k => `${k}: ${selectedVariants[k]}`)
      .join(', ') || null,
    productUrl,
    whatsappNumber
  });

  const isOutOfStock = product.availability_status === 'out_of_stock';
  const discountPercent = product.original_price && product.original_price > product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Price Block */}
      <div className="bg-[#f9f9f9] border border-neutral-200/90 rounded-2xl p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.selling_price && (
            <>
              <span className="text-sm sm:text-base text-neutral-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-black text-seed bg-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-2 font-medium">
          Inclusive of all taxes. Direct WhatsApp ordering & live inventory confirmation.
        </p>
      </div>

      {/* Dynamic Variant Options (Size, Colour, etc.) */}
      {Object.keys(variantsByType).map(type => {
        const variants = variantsByType[type];

        return (
          <div key={type} className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                Select {type}
              </span>
              {selectedVariants[type] && (
                <span className="font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full text-[11px]">
                  {selectedVariants[type]}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.map(v => {
                const isSelected = selectedVariants[type] === v.variant_value;
                return (
                  <button
                    key={v.id || v.variant_value}
                    type="button"
                    onClick={() => handleVariantSelect(type, v.variant_value)}
                    className={`min-w-[44px] px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-black'
                    }`}
                  >
                    <span>{v.variant_value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity Selector */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider block">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-neutral-300 bg-white rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2.5 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-xs font-bold text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock}
              className="p-2.5 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {quantity > 1 && (
            <span className="text-xs text-neutral-500 font-medium">
              Subtotal: <strong className="text-neutral-900 font-black">₹{totalPrice.toLocaleString('en-IN')}</strong>
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp Ordering Action Button */}
      <div className="pt-2">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-4 px-6 bg-neutral-200 text-neutral-400 rounded-full font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <AlertCircle className="w-4 h-4 text-neutral-400" />
            <span>Out of Stock</span>
          </button>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-full font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-3 group shadow-md border border-black hover:border-seed"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-seed animate-ping"></span>
            <MessageCircle className="w-4 h-4 text-seed" />
            <span>Order on WhatsApp • ₹{totalPrice.toLocaleString('en-IN')}</span>
          </a>
        )}
        <p className="text-center text-[11px] text-neutral-400 mt-2.5">
          Opens WhatsApp directly with prefilled order details for immediate processing.
        </p>
      </div>

      {/* Trust & Guarantee Info */}
      <div className="border-t border-neutral-200/80 pt-5 space-y-3 text-xs text-neutral-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-black shrink-0" />
          <span>Direct Dispatch & Courier Tracking shared directly via WhatsApp</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-black shrink-0" />
          <span>100% Genuine, verified SEED quality guaranteed</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-black shrink-0" />
          <span>Personal order guidance and fit recommendation from store team</span>
        </div>
      </div>
    </div>
  );
}
