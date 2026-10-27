import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Category, StoreSettings } from '@/types';

interface FooterProps {
  categories: Category[];
  settings: StoreSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <footer className="bg-[#141414] text-neutral-300 border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Store Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-[-0.03em] uppercase text-white font-sans">
                NOVELLA
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.25em] text-neutral-500 uppercase -mt-1">
                {settings.store_name || 'COLLECTION'}
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-normal">
              A curated multi-category retail store offering modern fashion, electronics, cosmetics, home decor, and accessories with effortless direct WhatsApp ordering.
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>+91 97447 44960</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{settings.contact_email || 'support@novella.store'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{settings.contact_address || 'Kerala, India'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to chat with NOVELLA customer support.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold border border-neutral-800 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Customer Support</span>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?new_arrival=true" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white transition-colors">
                  Top Deals
                </Link>
              </li>
              <li>
                <Link href="/products?best_seller=true" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              {categories.slice(0, 3).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors truncate block">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to track my order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I need help with ordering on NOVELLA.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! What are the shipping and delivery options?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              About
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  About NOVELLA
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-neutral-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-neutral-500">Direct WhatsApp Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>
            © {new Date().getFullYear()} NOVELLA. All rights reserved. Direct WhatsApp Ordering Platform.
          </p>
          <div className="flex items-center gap-4">
            <span>WhatsApp Business: +91 97447 44960</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-neutral-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
