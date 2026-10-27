'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  MessageCircle, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Layers
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white border-b border-slate-100'}`}>
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero payment gateway hassle • Instant direct orders via WhatsApp</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello SeedCart! I have a general enquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Support: +91 97447 44960</span>
            </a>
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                {settings.store_name || 'SeedCart'}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest -mt-1">
                Storefront
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products across fashion, electronics, cosmetics, home..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to enquire about products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/80 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Sub-bar (Desktop) */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 py-2">
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-emerald-600 transition-colors py-1">
                Home
              </Link>

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors py-1 font-semibold"
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>All Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-72 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 max-h-96 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Shop By Department
                      </div>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <span className="truncate">{cat.name}</span>
                          {cat.product_count !== undefined && cat.product_count > 0 && (
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                              {cat.product_count}
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="pt-2 mt-2 border-t border-slate-100 px-2">
                        <Link
                          href="/products"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="block text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1.5"
                        >
                          Browse All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/products" className="hover:text-emerald-600 transition-colors py-1">
                All Products
              </Link>
              <Link href="/products?featured=true" className="hover:text-emerald-600 transition-colors py-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured</span>
              </Link>
              <Link href="/products?new_arrival=true" className="hover:text-emerald-600 transition-colors py-1">
                New Arrivals
              </Link>
              <Link href="/products?best_seller=true" className="hover:text-emerald-600 transition-colors py-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Best Sellers</span>
              </Link>
            </div>

            {/* Quick Categories Bar */}
            <div className="flex items-center gap-3 overflow-x-auto text-xs text-slate-500">
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="whitespace-nowrap hover:text-emerald-600 transition-colors bg-white px-2.5 py-1 rounded-full border border-slate-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-100"
            >
              All Products
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-100"
            >
              Featured Products
            </Link>
            <Link
              href="/products?new_arrival=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-100"
            >
              New Arrivals
            </Link>
            <Link
              href="/products?best_seller=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-slate-100"
            >
              Best Sellers
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Categories
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to enquire about products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200"
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
