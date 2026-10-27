'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { Product, Category } from '@/types';

interface ProductManagementTableProps {
  initialProducts: any[];
  categories: Category[];
}

export default function ProductManagementTable({ initialProducts, categories }: ProductManagementTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Filter products locally for instant response
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.publication_status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      return;
    }

    setLoadingAction(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      setProducts(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    } finally {
      setLoadingAction(null);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (product: any, field: 'publication_status' | 'availability_status' | 'is_featured' | 'is_best_seller' | 'is_new_arrival') => {
    setLoadingAction(product.id);
    let updatedVal: any;

    if (field === 'publication_status') {
      updatedVal = product.publication_status === 'published' ? 'draft' : 'published';
    } else if (field === 'availability_status') {
      updatedVal = product.availability_status === 'in_stock' ? 'out_of_stock' : 'in_stock';
    } else {
      updatedVal = !product[field];
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          [field]: updatedVal
        })
      });

      if (!res.ok) throw new Error('Failed to update status');

      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          return { ...p, [field]: updatedVal };
        }
        return p;
      }));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Products
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, edit prices, update inventory availability, and control storefront publication.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by product name, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const img = p.primary_image || p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=200&q=80';
                  const isBusy = loadingAction === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Product Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
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
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/admin/products/edit/${p.id}`}
                              className="font-bold text-white hover:text-emerald-400 transition-colors truncate block"
                            >
                              {p.name}
                            </Link>
                            <span className="font-mono text-[10px] text-slate-500 block">
                              SKU: {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.category_name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-white">
                          ₹{parseFloat(p.selling_price).toLocaleString('en-IN')}
                        </span>
                        {p.original_price && (
                          <span className="block text-[10px] text-slate-500 line-through">
                            ₹{parseFloat(p.original_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Availability */}
                      <td className="py-3.5 px-4">
                        <button
                          disabled={isBusy}
                          onClick={() => handleToggleStatus(p, 'availability_status')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            p.availability_status === 'in_stock'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {p.availability_status === 'in_stock' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Badges Toggles */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Toggle Featured"
                            onClick={() => handleToggleStatus(p, 'is_featured')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              p.is_featured
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'text-slate-600 border-slate-800 hover:text-slate-400'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Toggle Best Seller"
                            onClick={() => handleToggleStatus(p, 'is_best_seller')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              p.is_best_seller
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                : 'text-slate-600 border-slate-800 hover:text-slate-400'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Toggle New Arrival"
                            onClick={() => handleToggleStatus(p, 'is_new_arrival')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              p.is_new_arrival
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'text-slate-600 border-slate-800 hover:text-slate-400'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          disabled={isBusy}
                          onClick={() => handleToggleStatus(p, 'publication_status')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            p.publication_status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {p.publication_status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="View on Storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/edit/${p.id}`}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isBusy}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
