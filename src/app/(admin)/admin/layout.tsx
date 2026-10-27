import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getStoreSettings } from '@/lib/data';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();
  const settings = await getStoreSettings();

  // If not authenticated, we let the children render if on `/admin` (login page),
  // but if inside protected admin subroutes, we redirect to `/admin`.
  // Note: /admin/page.tsx handles login form display when not auth.

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {isAuth ? (
        <div className="flex flex-1">
          <AdminSidebar storeName={settings.store_name} />
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            {/* Top Bar */}
            <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-semibold text-slate-300">
                  Store Online • WhatsApp Direct Orders Active
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">Admin: <strong className="text-white">+91 97447 44960</strong></span>
                <a
                  href="/"
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
                >
                  View Storefront ↗
                </a>
              </div>
            </header>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          {children}
        </div>
      )}
    </div>
  );
}
