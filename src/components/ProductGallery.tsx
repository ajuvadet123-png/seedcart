'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const defaultImages = images && images.length > 0 
    ? images 
    : [{ image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', display_order: 0, is_primary: true }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = defaultImages[selectedIndex] || defaultImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {defaultImages.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[520px] scrollbar-none py-1">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all ${
                selectedIndex === idx
                  ? 'border-black ring-2 ring-black'
                  : 'border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image */}
      <div className="relative flex-1 aspect-[4/5] sm:aspect-square rounded-2xl bg-[#f6f6f6] border border-neutral-200/90 overflow-hidden shadow-xs">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover object-center transition-all duration-300"
          unoptimized
        />
      </div>
    </div>
  );
}
