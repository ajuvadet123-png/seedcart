import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Category, StoreSettings } from '@/types';
import SeedLogo from '@/components/SeedLogo';

interface FooterProps {
  categories: Category[];
  settings: StoreSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  const cleanWhatsAppNumber = (settings.contact_whatsapp_number || '919744744960').replace(/\D/g, '');

  return (
    <footer className="bg-[#0e0e0e] text-neutral-300 border-t border-neutral-900 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Column 1: SEED Identity */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <SeedLogo variant="dark" size="md" />
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed max-w-sm font-normal">
              Rooted in quality. A curated fashion, technical apparel, and lifestyle brand engineered for performance, durability, and daily comfort.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-seed" />
                <span>+91 97447 44960</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{settings.contact_email || 'support@seedcart.shop'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{settings.contact_address || 'Kerala, India'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to contact SEED customer support.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold border border-neutral-800 hover:border-seed transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-seed" />
                <span>WhatsApp Customer Support</span>
              </a>
            </div>
          </div>

          {/* Column 2: Categories (Dynamic from real data) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="hover:text-seed transition-colors truncate block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/products" 
                  className="text-white hover:text-seed font-medium transition-colors flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Ordering */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! I would like to track my SEED order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! How does WhatsApp ordering work on SEED?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Ordering Guide
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello! What are the shipping and delivery policies?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Dispatch
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-seed transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Access</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand & Quality */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              SEED Brand
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <span className="text-neutral-300 font-semibold">Rooted in quality</span>
              </li>
              <li>
                <span className="text-neutral-500">Everyday Streetwear</span>
              </li>
              <li>
                <span className="text-neutral-500">Technical Performance</span>
              </li>
              <li>
                <span className="text-neutral-500">Authentic Materials</span>
              </li>
              <li>
                <span className="text-neutral-500">Direct WhatsApp Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>
            © {new Date().getFullYear()} SEED. Rooted in quality. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Direct WhatsApp Orders: +91 97447 44960</span>
            <span className="text-neutral-800">•</span>
            <Link href="/admin" className="hover:text-neutral-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
