import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Shield, Truck, RefreshCw, Phone, Mail, MapPin } from 'lucide-react';
import { Category, StoreSettings } from '@/types';

interface FooterProps {
  categories: Category[];
  settings: StoreSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      {/* Features Bar */}
      <div className="border-b border-slate-800 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant WhatsApp Orders</h4>
                <p className="text-xs text-slate-400">Zero payment forms or checkouts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Quality Assurance</h4>
                <p className="text-xs text-slate-400">Verified products & genuine stock</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Fast Direct Dispatch</h4>
                <p className="text-xs text-slate-400">Express delivery across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Friendly Support</h4>
                <p className="text-xs text-slate-400">Chat directly with store managers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {settings.store_name || 'SeedCart'}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.store_description || 'Your premier multi-category online shopping platform. Explore fashion, electronics, cosmetics, home decor, and lifestyle with instant WhatsApp ordering.'}
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 97447 44960</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>{settings.contact_email || 'support@seedcart.shop'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{settings.contact_address || 'Kerala, India'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to enquire about placing an order on SeedCart.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore Store
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-emerald-400 transition-colors">
                  Featured Collection
                </Link>
              </li>
              <li>
                <Link href="/products?new_arrival=true" className="hover:text-emerald-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?best_seller=true" className="hover:text-emerald-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column 1 */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="hover:text-emerald-400 transition-colors truncate block">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column 2 */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              More Departments
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {categories.slice(6, 12).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="hover:text-emerald-400 transition-colors truncate block">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs block pt-1">
                  View All Departments →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.store_name || 'SeedCart'}. All rights reserved. Direct WhatsApp Ordering Platform.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Direct WhatsApp Checkout (+91 97447 44960)</span>
            <Link href="/admin" className="hover:text-slate-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
