'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  MessageCircle, 
  ChevronDown, 
  ShieldCheck, 
  Heart,
  HelpCircle,
  Truck
} from 'lucide-react';
import { Category, StoreSettings } from '@/types';

interface NavbarProps {
  categories: Category[];
  settings: StoreSettings;
}

export default function Navbar({ categories, settings }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <header className="w-full bg-white border-b border-neutral-200/80 sticky top-0 z-50">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="bg-[#f7f5f0] border-b border-neutral-200/60 text-neutral-600 text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-tight">
            <span>Free delivery on qualifying orders</span>
            <span className="text-neutral-300">•</span>
            <span className="hidden sm:inline">Instant direct orders & personal assistance via WhatsApp</span>
          </div>

          <div className="flex items-center gap-4 font-normal text-neutral-500">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to track my order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors hidden md:inline-flex items-center gap-1"
            >
              <Truck className="w-3 h-3" />
              <span>Track Order</span>
            </a>
            <span className="hidden md:inline text-neutral-300">|</span>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I need assistance with SeedCart store.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Help Center</span>
            </a>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <Link href="/admin" className="hover:text-black transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
          {/* Logo / Wordmark */}
          <Link href="/" className="flex flex-col group flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-black tracking-[-0.03em] uppercase text-black font-sans">
              NOVELLA
            </span>
            <span className="text-[9px] font-semibold tracking-[0.25em] text-neutral-400 uppercase -mt-1">
              {settings.store_name || 'COLLECTION'}
            </span>
          </Link>

          {/* Long Central Search Field */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search products across all categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 text-xs bg-white border border-neutral-300 rounded-l-md focus:outline-none focus:border-black transition-all text-neutral-800 placeholder-neutral-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-black hover:bg-neutral-800 text-white px-5 rounded-r-md flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to enquire about products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-md text-xs font-medium transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-black md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-l-md focus:outline-none focus:border-black text-neutral-800"
              />
              <button
                type="submit"
                className="bg-black text-white px-3.5 rounded-r-md flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION ROW (DESKTOP) */}
      <nav className="hidden md:block border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-xs font-medium text-neutral-800 py-2.5">
            {/* Categories Dropdown Button */}
            <div 
              className="relative mr-6"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-2 font-bold text-black hover:text-terracotta transition-colors py-1"
              >
                <Menu className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[11px]">All Categories</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-64 z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-neutral-200 py-2 max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs text-neutral-700 hover:bg-[#faf7f2] hover:text-black transition-colors"
                      >
                        <span>{cat.name}</span>
                        {cat.product_count !== undefined && cat.product_count > 0 && (
                          <span className="text-[10px] text-neutral-400">({cat.product_count})</span>
                        )}
                      </Link>
                    ))}
                    <div className="border-t border-neutral-100 mt-1 pt-1 px-4 py-1.5">
                      <Link
                        href="/products"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-[11px] font-bold text-terracotta hover:underline block"
                      >
                        Browse All Departments →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Links */}
            <div className="flex items-center gap-7 overflow-x-auto whitespace-nowrap text-neutral-600">
              <Link href="/products?new_arrival=true" className="hover:text-black transition-colors">
                New Arrivals
              </Link>
              <Link href="/products?featured=true" className="hover:text-black transition-colors">
                Top Deals
              </Link>
              <Link href="/products?best_seller=true" className="hover:text-black transition-colors">
                Best Sellers
              </Link>
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/products" className="font-semibold text-black hover:text-terracotta transition-colors">
                View All
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-neutral-50"
            >
              All Products
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Top Deals
            </Link>
            <Link
              href="/products?new_arrival=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-neutral-50"
            >
              New Arrivals
            </Link>
            <Link
              href="/products?best_seller=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Best Sellers
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-3">
              Shop Categories
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-700 hover:text-black rounded truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to place an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-md text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Order on WhatsApp</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 bg-neutral-100 text-neutral-700 rounded-md text-xs font-medium hover:bg-neutral-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
