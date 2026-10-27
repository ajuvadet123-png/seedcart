import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { 
  Package, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  FolderTree, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  ExternalLink,
  MessageCircle,
  Eye,
  Edit
} from 'lucide-react';
import { isAdminAuthenticated } from '../../../../lib/auth';
import { getDashboardMetrics, getProducts, getCategories } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const [metrics, recentProductsRes, categories] = await Promise.all([
    getDashboardMetrics(),
    getProducts({ limit: 6, sort: 'newest', includeInactive: true }),
    getCategories(false),
  ]);

  const cards = [
    {
      title: 'Total Products',
      val: metrics.totalProducts,
      desc: 'Catalog items in database',
      icon: Package,
      color: 'emerald',
      href: '/admin/products'
    },
    {
      title: 'Active Products',
      val: metrics.activeProducts,
      desc: 'Visible on customer storefront',
      icon: CheckCircle,
      color: 'teal',
      href: '/admin/products?status=published'
    },
    {
      title: 'Draft Products',
      val: metrics.draftProducts,
      desc: 'Unpublished catalog drafts',
      icon: FileText,
      color: 'amber',
      href: '/admin/products?status=draft'
    },
    {
      title: 'Out of Stock',
      val: metrics.outOfStockProducts,
      desc: 'Need inventory restock',
      icon: AlertTriangle,
      color: 'rose',
      href: '/admin/products?availability=out_of_stock'
    },
    {
      title: 'Total Categories',
      val: metrics.totalCategories,
      desc: 'Active departments',
      icon: FolderTree,
      color: 'indigo',
      href: '/admin/categories'
    },
    {
      title: 'Featured Items',
      val: metrics.featuredProducts,
      desc: 'Highlighted on homepage',
      icon: Sparkles,
      color: 'violet',
      href: '/admin/products?featured=true'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time catalog metrics and store management for WhatsApp ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FolderTree className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                  {c.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{c.val}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recently Added Products (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Recently Added Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-850">
            {recentProductsRes.products.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No products found. Click &ldquo;Add New Product&rdquo; to create your first item.
              </div>
            ) : (
              recentProductsRes.products.map((p) => {
                const img = p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=200&q=80';
                return (
                  <div key={p.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{p.category_name || 'Category'}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{p.sku}</span>
                          <span>•</span>
                          <span className="font-bold text-white">₹{p.selling_price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.publication_status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.publication_status}
                      </span>
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                        title="View Live"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Category Distribution & Quick Links (1 col) */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">
              Top Categories
            </h2>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-850 space-y-1">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.id} className="pt-2 pb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate">{cat.name}</span>
                  <span className="font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full text-[10px]">
                    {cat.product_count || 0} items
                  </span>
                </div>
              ))}
              <div className="pt-3">
                <Link
                  href="/admin/categories"
                  className="block text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Manage All {categories.length} Categories →
                </Link>
              </div>
            </div>
          </div>

          {/* Business Rules Reminder Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct Ordering System</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Customers order directly without payment processing or checkout forms. Ensure all product prices and WhatsApp numbers in Store Settings are accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
