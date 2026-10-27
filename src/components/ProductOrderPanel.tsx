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

  return (
    <div className="space-y-6">
      {/* Price Block */}
      <div className="bg-[#fbf9f6] border border-neutral-200/80 rounded-xl p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-neutral-900 tracking-tight">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.selling_price && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-terracotta bg-[#fbf3f0] px-2 py-0.5 rounded border border-[#f6e4de]">
                {Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Price includes applicable taxes. Direct WhatsApp ordering & live stock confirmation.
        </p>
      </div>

      {/* Dynamic Variant Options (Size, Colour, etc.) */}
      {Object.keys(variantsByType).map(type => {
        const variants = variantsByType[type];

        return (
          <div key={type} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900 uppercase tracking-wider">Select {type}</span>
              {selectedVariants[type] && (
                <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
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
                    className={`min-w-[40px] px-3.5 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-black bg-black text-white font-semibold'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
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
      <div className="space-y-2">
        <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-neutral-300 bg-white rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-xs font-bold text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock}
              className="p-2.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {quantity > 1 && (
            <span className="text-xs text-neutral-500">
              Total: <strong className="text-neutral-900">₹{totalPrice.toLocaleString('en-IN')}</strong>
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp Ordering Action Button */}
      <div className="pt-2">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-3.5 px-6 bg-neutral-200 text-neutral-500 rounded-md font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-neutral-400" />
            <span>Currently Out of Stock</span>
          </button>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2.5 group shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Order on WhatsApp • ₹{totalPrice.toLocaleString('en-IN')}</span>
          </a>
        )}
        <p className="text-center text-[11px] text-neutral-400 mt-2">
          Clicking opens WhatsApp with business number +91 97447 44960 with prefilled order details.
        </p>
      </div>

      {/* Trust & Guarantee Info */}
      <div className="border-t border-neutral-200 pt-5 space-y-2.5 text-xs text-neutral-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
          <span>Direct Dispatch & Courier Tracking shared via WhatsApp</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
          <span>100% Genuine, verified products guaranteed</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
          <span>Personal customer assistance from store curators</span>
        </div>
      </div>
    </div>
  );
}
