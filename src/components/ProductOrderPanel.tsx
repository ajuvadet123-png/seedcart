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
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.selling_price && (
            <>
              <span className="text-base text-slate-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                {Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Inclusive of all applicable taxes. Order confirmed directly via WhatsApp.
        </p>
      </div>

      {/* Dynamic Variant Options (Size, Colour, etc.) */}
      {Object.keys(variantsByType).map(type => {
        const variants = variantsByType[type];
        const isColour = type.toLowerCase() === 'colour' || type.toLowerCase() === 'color';
        const isSize = type.toLowerCase() === 'size';

        return (
          <div key={type} className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Select {type}</span>
              {selectedVariants[type] && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
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
                    className={`min-w-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
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
        <label className="text-sm font-bold text-slate-900 block">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock}
              className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {quantity > 1 && (
            <span className="text-xs text-slate-500">
              Total: <strong className="text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</strong>
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp Ordering Action Button */}
      <div className="pt-2">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-4 px-6 bg-slate-200 text-slate-500 rounded-2xl font-bold text-base cursor-not-allowed flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <span>Currently Out of Stock</span>
          </button>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2.5 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Order on WhatsApp (₹{totalPrice.toLocaleString('en-IN')})</span>
          </a>
        )}
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Clicking opens WhatsApp chat with business number +91 97447 44960 with pre-filled order details.
        </p>
      </div>

      {/* Trust & Guarantee Info */}
      <div className="border-t border-slate-200/80 pt-5 space-y-3">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Direct Dispatch & Delivery Tracking provided on WhatsApp</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Genuine product guaranteed by SeedCart</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Easy returns & prompt customer assistance via direct chat</span>
        </div>
      </div>
    </div>
  );
}
