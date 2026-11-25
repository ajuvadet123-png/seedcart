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
  ArrowRight
} from 'lucide-react';
import { Category, StoreSettings } from '@/types';
import SeedLogo from '@/components/SeedLogo';

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
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <header className="w-full bg-white border-b border-neutral-200/80 sticky top-0 z-50 transition-all">
      {/* 1. Thin, full-width black announcement bar */}
      <div className="bg-black text-white text-[11px] py-2 px-4 sm:px-8 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-seed animate-pulse"></span>
            <span className="font-bold text-seed uppercase tracking-wider text-[10px]">SEED OFFICIAL</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300 hidden sm:inline">Rooted in quality — direct WhatsApp ordering available</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I have a question about SEED products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-seed transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3 h-3 text-seed" />
              <span>Direct Support</span>
            </a>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <Link 
              href="/admin" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Premium white navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6">
          {/* SEED Logo on the left */}
          <div className="flex items-center flex-shrink-0">
            <SeedLogo variant="light" size="md" />
          </div>

          {/* Clean Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-[12px] 2xl:text-[13px] font-medium text-neutral-800">
            {/* Categories dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 py-2 text-neutral-900 hover:text-black font-bold uppercase tracking-wider text-[11px] transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-72 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 divide-y divide-neutral-100 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="py-1">
                      {categories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.product_count !== undefined && cat.product_count > 0 && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {cat.product_count}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 pb-1 px-3.5">
                      <Link
                        href="/products"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-[11px] font-bold text-black hover:text-seed transition-colors flex items-center justify-between"
                      >
                        <span>View All Departments</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/products?new_arrival=true" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              New Arrivals
            </Link>

            <Link 
              href="/products?best_seller=true" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Best Sellers
            </Link>

            <Link 
              href="/products?featured=true" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Top Deals
            </Link>

            <Link 
              href="/category/fashion-clothing" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Fashion &amp; Clothing
            </Link>

            <Link 
              href="/category/footwear" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Footwear
            </Link>

            <Link 
              href="/category/fashion-accessories" 
              className="text-neutral-700 hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Fashion Accessories
            </Link>

            <Link 
              href="/products" 
              className="text-neutral-900 font-bold hover:text-black hover:underline underline-offset-8 decoration-2 decoration-seed transition-all whitespace-nowrap"
            >
              Shop All
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Rounded Search input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 pl-4 pr-9 py-2 text-xs bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-transparent focus:border-neutral-300 rounded-full focus:outline-none transition-all placeholder:text-neutral-400 text-neutral-900"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 text-neutral-400 hover:text-black transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Mobile search toggle button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-700 hover:text-black md:hidden"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Prominent black WhatsApp Order button with small neon-green icon */}
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to inquire about products from SEED.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-black hover:bg-neutral-900 active:scale-95 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-sm border border-black hover:border-seed whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-seed fill-seed/20" />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-black xl:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-neutral-100 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Search products across SEED..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-4 pr-10 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-full focus:outline-none focus:border-black text-neutral-900"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-3 text-neutral-500 hover:text-black"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-neutral-200 px-6 py-6 space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-neutral-900 hover:bg-neutral-50"
            >
              Home
            </Link>
            <Link
              href="/products?new_arrival=true"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              <span>New Arrivals</span>
              <span className="text-[10px] font-bold text-black bg-seed px-2 py-0.5 rounded-full uppercase">New</span>
            </Link>
            <Link
              href="/products?best_seller=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Best Sellers
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Top Deals
            </Link>
            <Link
              href="/category/fashion-clothing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Fashion &amp; Clothing
            </Link>
            <Link
              href="/category/footwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Footwear
            </Link>
            <Link
              href="/category/fashion-accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Fashion Accessories
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-neutral-900 hover:bg-neutral-50"
            >
              Shop All
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3 px-3">
              All Categories
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to order from SEED.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-full text-xs font-bold tracking-wide border border-black hover:border-seed"
            >
              <MessageCircle className="w-4 h-4 text-seed" />
              <span>Order via WhatsApp</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium hover:bg-neutral-200"
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
