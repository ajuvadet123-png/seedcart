'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  AlertCircle,
  Star
} from 'lucide-react';
import { Category, Product } from '@/types';

interface ProductFormProps {
  categories: Category[];
  initialData?: Product | null;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ''));
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Pricing
  const [sellingPrice, setSellingPrice] = useState(initialData?.selling_price ? String(initialData.selling_price) : '');
  const [originalPrice, setOriginalPrice] = useState(initialData?.original_price ? String(initialData.original_price) : '');
  
  // Status & Visibility
  const [availabilityStatus, setAvailabilityStatus] = useState(initialData?.availability_status || 'in_stock');
  const [stockQuantity, setStockQuantity] = useState(initialData?.stock_quantity !== undefined ? String(initialData.stock_quantity) : '20');
  const [publicationStatus, setPublicationStatus] = useState(initialData?.publication_status || 'published');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isNewArrival, setIsNewArrival] = useState(initialData?.is_new_arrival || false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.is_best_seller || false);

  // Images state
  const [images, setImages] = useState<Array<{ image_url: string; is_primary: boolean }>>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map(img => ({
        image_url: img.image_url,
        is_primary: !!img.is_primary
      }));
    }
    return [];
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Variants state (Sizes, Colours, Custom)
  const [variants, setVariants] = useState<Array<{ variant_type: string; variant_value: string }>>(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      return initialData.variants.map(v => ({
        variant_type: v.variant_type,
        variant_value: v.variant_value
      }));
    }
    return [];
  });
  const [newVariantType, setNewVariantType] = useState('Size');
  const [newVariantValue, setNewVariantValue] = useState('');

  // Attributes state (Specifications)
  const [attributes, setAttributes] = useState<Array<{ attribute_name: string; attribute_value: string }>>(() => {
    if (initialData?.attributes && initialData.attributes.length > 0) {
      return initialData.attributes.map(a => ({
        attribute_name: a.attribute_name,
        attribute_value: a.attribute_value
      }));
    }
    return [];
  });
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when name changes (if creating or slug not manually locked)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!slug || slug === name.toLowerCase().replace(/\s+/g, '-'))) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      setSlug(generated);
    }
  };

  // Image helpers
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [
        ...prev,
        { image_url: newImageUrl.trim(), is_primary: prev.length === 0 }
      ]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setImages(prev => [
        ...prev,
        { image_url: data.url, is_primary: prev.length === 0 }
      ]);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, idx) => ({
      ...img,
      is_primary: idx === index
    })));
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length > 0 && !next.some(img => img.is_primary)) {
        next[0].is_primary = true;
      }
      return next;
    });
  };

  // Variant helpers
  const handleAddVariant = () => {
    if (newVariantValue.trim()) {
      setVariants(prev => [
        ...prev,
        { variant_type: newVariantType, variant_value: newVariantValue.trim() }
      ]);
      setNewVariantValue('');
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, idx) => idx !== index));
  };

  // Attribute helpers
  const handleAddAttribute = () => {
    if (newAttrName.trim() && newAttrValue.trim()) {
      setAttributes(prev => [
        ...prev,
        { attribute_name: newAttrName.trim(), attribute_value: newAttrValue.trim() }
      ]);
      setNewAttrName('');
      setNewAttrValue('');
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, idx) => idx !== index));
  };

  // Discount computation
  const calcDiscount = () => {
    const s = parseFloat(sellingPrice);
    const o = parseFloat(originalPrice);
    if (!isNaN(s) && !isNaN(o) && o > s) {
      return Math.round(((o - s) / o) * 100);
    }
    return 0;
  };

  // Form Submit
  const handleSubmit = async (targetStatus?: 'published' | 'draft') => {
    setError(null);
    if (!name.trim()) {
      setError('Product Name is required');
      return;
    }
    if (!categoryId) {
      setError('Please select a Category');
      return;
    }
    if (!sellingPrice || isNaN(parseFloat(sellingPrice))) {
      setError('Valid Selling Price is required');
      return;
    }

    setSaving(true);
    const finalPublicationStatus = targetStatus || publicationStatus;

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      sku: sku.trim() || undefined,
      brand: brand.trim() || null,
      category_id: categoryId,
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      selling_price: parseFloat(sellingPrice),
      original_price: originalPrice && !isNaN(parseFloat(originalPrice)) ? parseFloat(originalPrice) : null,
      stock_quantity: parseInt(stockQuantity, 10) || 10,
      availability_status: availabilityStatus,
      publication_status: finalPublicationStatus,
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
      is_best_seller: isBestSeller,
      images: images.length > 0 ? images : [
        { image_url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80', is_primary: true }
      ],
      variants,
      attributes
    };

    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isEditing ? `Edit Product: ${initialData.name}` : 'Create New Product'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in product details, variants, specifications, and images for WhatsApp ordering.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Information & Media (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Basic Information
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Premium Cotton Oversized T-Shirt"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="auto-generated-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Product ID / SKU
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRD-FASH-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aura Essentials"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Short Description
              </label>
              <input
                type="text"
                placeholder="One sentence summary for product cards"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Full Description
              </label>
              <textarea
                rows={4}
                placeholder="Detailed description, fabric, care instructions, compatibility..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Images
            </h2>

            {/* Upload or Add URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste direct Image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add URL
                </button>
              </div>

              <div>
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No images added yet. Add at least one image URL or upload an image file.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 group bg-slate-900 ${
                      img.is_primary ? 'border-emerald-500' : 'border-slate-800'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`Product image ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                      unoptimized
                    />
                    
                    {img.is_primary && (
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Primary
                      </span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px]"
                          title="Make Primary"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants (Sizes, Colours, Custom) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Options & Variants
            </h2>
            <p className="text-xs text-slate-400">
              Add sizes, colours, or custom variants. Customers can choose these before ordering on WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newVariantType}
                onChange={(e) => setNewVariantType(e.target.value)}
                className="w-full sm:w-36 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Size">Size</option>
                <option value="Colour">Colour</option>
                <option value="Storage">Storage</option>
                <option value="Material">Material</option>
                <option value="Option">Custom Option</option>
              </select>
              <input
                type="text"
                placeholder="Option Value (e.g. M, L, XL, Jet Black, 128GB)..."
                value={newVariantValue}
                onChange={(e) => setNewVariantValue(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Variants Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {variants.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
                >
                  <strong className="text-emerald-400 font-semibold">{v.variant_type}:</strong>
                  <span>{v.variant_value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specifications / Key Attributes */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Specifications
            </h2>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Spec Name (e.g. Material, Battery Life, Warranty)..."
                value={newAttrName}
                onChange={(e) => setNewAttrName(e.target.value)}
                className="w-full sm:w-1/3 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. 100% Combed Cotton, 50 Hours)..."
                value={newAttrValue}
                onChange={(e) => setNewAttrValue(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddAttribute}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spec</span>
              </button>
            </div>

            {/* Attributes List */}
            {attributes.length > 0 && (
              <div className="divide-y divide-slate-850 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 text-xs">
                {attributes.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5">
                    <div>
                      <strong className="text-slate-300 font-semibold">{a.attribute_name}: </strong>
                      <span className="text-slate-400">{a.attribute_value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Inventory & Settings (1 col) */}
        <div className="space-y-6">
          {/* Pricing Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Pricing (₹ INR)
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="899"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Original / MRP Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1499"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {calcDiscount() > 0 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold flex items-center justify-between">
                <span>Calculated Discount:</span>
                <span>{calcDiscount()}% OFF</span>
              </div>
            )}
          </div>

          {/* Inventory & Availability */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Inventory & Status
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Availability Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Publication Status
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="published">Published (Visible on Storefront)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Highlights & Badges */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Homepage Highlights
            </h2>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-850 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-850 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                New Arrival
              </span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-850 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Best Seller
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
