import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, getStoreSettings } from '@/lib/data';

// Force dynamic so admin changes to categories and settings reflect immediately
export const dynamic = 'force-dynamic';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getCategories(true),
    getStoreSettings(),
  ]);

  return (
    <>
      <Navbar categories={categories} settings={settings} />
      <main className="flex-1">
        {children}
      </main>
      <Footer categories={categories} settings={settings} />
    </>
  );
}
