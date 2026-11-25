'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SeedLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLink?: boolean;
}

export default function SeedLogo({
  variant = 'light',
  className = '',
  size = 'md',
  showLink = true,
}: SeedLogoProps) {
  // Height definitions for crisp scaling
  const heightClass = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }[size];

  // The cropped transparent logo image has aspect ratio ~879/484 (~1.816)
  const imageSrc = variant === 'dark' 
    ? '/images/seed-logo-dark.png' 
    : '/images/seed-logo-transparent.png';

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <div className={`relative ${heightClass} aspect-[879/484] flex items-center`}>
        <Image
          src={imageSrc}
          alt="SEED - Rooted in quality"
          fill
          sizes="(max-width: 640px) 160px, 220px"
          className="object-contain object-left"
          priority={size === 'md' || size === 'lg'}
          unoptimized
        />
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link href="/" className="inline-block group focus:outline-none" aria-label="SEED Home">
        {content}
      </Link>
    );
  }

  return content;
}
