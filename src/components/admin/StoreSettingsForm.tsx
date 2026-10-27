'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Check, AlertCircle, MessageCircle, Store, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { StoreSettings } from '@/types';

interface StoreSettingsFormProps {
  initialSettings: StoreSettings;
}

export default function StoreSettingsForm({ initialSettings }: StoreSettingsFormProps) {
  const router = useRouter();
  const [storeName, setStoreName] = useState(initialSettings.store_name || 'SeedCart');
  const [storeTagline, setStoreTagline] = useState(initialSettings.store_tagline || '');
  const [storeDescription, setStoreDescription] = useState(initialSettings.store_description || '');
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.contact_whatsapp_number || '919744744960');
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || 'support@seedcart.shop');
  const [contactPhone, setContactPhone] = useState(initialSettings.contact_phone || '+91 97447 44960');
  const [contactAddress, setContactAddress] = useState(initialSettings.contact_address || 'Kerala, India');
  const [currency, setCurrency] = useState(initialSettings.currency || 'INR');
  const [currencySymbol, setCurrencySymbol] = useState(initialSettings.currency_symbol || '₹');
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings.hero_subtitle || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings.hero_image_url || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_name: storeName,
          store_tagline: storeTagline,
          store_description: storeDescription,
          contact_whatsapp_number: whatsappNumber,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_address: contactAddress,
          currency,
          currency_symbol: currencySymbol,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_image_url: heroImageUrl,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure business information, WhatsApp dispatch number, and storefront promotional text.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5 shrink-0" />
          <span>Settings saved successfully! WhatsApp checkout buttons and store content have been updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp & Orders Configuration */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Ordering Channel</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Business WhatsApp Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 919744744960"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              Include country code without &ldquo;+&rdquo; or spaces (e.g. <strong>919744744960</strong> for India). All storefront &ldquo;Order on WhatsApp&rdquo; buttons link directly to this number.
            </p>
          </div>
        </div>

        {/* Brand & Store Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Store Brand & Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Store Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Tagline
              </label>
              <input
                type="text"
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Store Description (Footer & Meta)
            </label>
            <textarea
              rows={2}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Support Phone Display
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Currency & Symbol
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-1/2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Homepage Hero Configuration */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Homepage Hero Banner</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Hero Headline
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Hero Background Image URL
            </label>
            <input
              type="url"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Store Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
