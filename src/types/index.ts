export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_category_id?: string | null;
  is_active: boolean;
  display_order: number;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id?: string;
  product_id?: string;
  variant_type: string; // e.g. "Size", "Colour", "Option"
  variant_value: string; // e.g. "M", "L", "Black", "128GB"
  variant_sku?: string | null;
  price_override?: number | null;
  stock_quantity?: number;
  is_available: boolean;
}

export interface ProductAttribute {
  id?: string;
  product_id?: string;
  attribute_name: string;
  attribute_value: string;
  display_order: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  brand?: string | null;
  selling_price: number;
  original_price?: number | null;
  stock_quantity: number;
  availability_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  publication_status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}

export interface StoreSettings {
  id?: string;
  store_name: string;
  store_tagline: string;
  store_description: string;
  logo_url?: string | null;
  contact_whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  currency: string;
  currency_symbol: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  updated_at?: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  featuredProducts: number;
}
