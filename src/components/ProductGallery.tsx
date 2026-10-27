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
    : [{ image_url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80', display_order: 0, is_primary: true }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = defaultImages[selectedIndex] || defaultImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {defaultImages.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[500px] scrollbar-none py-1">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border transition-all ${
                selectedIndex === idx
                  ? 'border-black ring-1 ring-black'
                  : 'border-neutral-200 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="72px"
                className="object-cover object-center"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-square rounded-xl bg-[#f8f8f8] border border-neutral-200/80 overflow-hidden">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
          unoptimized
        />
      </div>
    </div>
  );
}
