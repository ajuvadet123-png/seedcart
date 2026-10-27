import { query } from './db';
import { Category, Product, StoreSettings, DashboardMetrics } from '@/types';

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const res = await query('SELECT * FROM store_settings LIMIT 1');
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch (error) {
    console.error('Error fetching store settings:', error);
  }
  return {
    store_name: 'SeedCart',
    store_tagline: 'Premium Multi-Category Store',
    store_description: 'Explore trending fashion, latest electronics, luxury beauty, and home essentials with instant WhatsApp checkout.',
    contact_whatsapp_number: '919744744960',
    contact_email: 'support@seedcart.shop',
    contact_phone: '+91 97447 44960',
    contact_address: 'SeedCart Store, Kerala, India',
    currency: 'INR',
    currency_symbol: '₹',
    hero_title: 'Discover Premium Multi-Category Shopping',
    hero_subtitle: 'Explore trending fashion, latest electronics, luxury beauty, home essentials, and more with instant WhatsApp ordering.',
    hero_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'
  };
}

export async function getCategories(onlyActive = true): Promise<Category[]> {
  try {
    const condition = onlyActive ? 'WHERE c.is_active = true' : '';
    const sql = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.publication_status = 'published') as product_count
      FROM categories c
      ${condition}
      ORDER BY c.display_order ASC, c.name ASC
    `;
    const res = await query(sql);
    return res.rows.map(row => ({
      ...row,
      product_count: parseInt(row.product_count || '0', 10)
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
    return res.rows[0] || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export interface ProductFilters {
  categorySlug?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'featured';
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number }> {
  try {
    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (!filters.includeInactive) {
      whereClauses.push(`p.publication_status = 'published'`);
    }

    if (filters.categorySlug) {
      whereClauses.push(`c.slug = $${paramIndex++}`);
      params.push(filters.categorySlug);
    }

    if (filters.isFeatured) {
      whereClauses.push(`p.is_featured = true`);
    }

    if (filters.isNewArrival) {
      whereClauses.push(`p.is_new_arrival = true`);
    }

    if (filters.isBestSeller) {
      whereClauses.push(`p.is_best_seller = true`);
    }

    if (filters.availability && filters.availability !== 'all') {
      whereClauses.push(`p.availability_status = $${paramIndex++}`);
      params.push(filters.availability);
    }

    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      whereClauses.push(`p.selling_price >= $${paramIndex++}`);
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      whereClauses.push(`p.selling_price <= $${paramIndex++}`);
      params.push(filters.maxPrice);
    }

    if (filters.search && filters.search.trim()) {
      whereClauses.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.brand ILIKE $${paramIndex} OR 
        p.short_description ILIKE $${paramIndex} OR 
        p.sku ILIKE $${paramIndex} OR
        c.name ILIKE $${paramIndex}
      )`);
      params.push(`%${filters.search.trim()}%`);
      paramIndex++;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total query
    const countSql = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
    `;
    const countRes = await query(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // Sorting
    let orderBy = 'p.created_at DESC';
    if (filters.sort === 'price_asc') orderBy = 'p.selling_price ASC';
    else if (filters.sort === 'price_desc') orderBy = 'p.selling_price DESC';
    else if (filters.sort === 'name_asc') orderBy = 'p.name ASC';
    else if (filters.sort === 'featured') orderBy = 'p.is_featured DESC, p.created_at DESC';
    else if (filters.sort === 'newest') orderBy = 'p.created_at DESC';

    let paginationSql = '';
    if (filters.limit) {
      paginationSql += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
      if (filters.offset) {
        paginationSql += ` OFFSET $${paramIndex++}`;
        params.push(filters.offset);
      }
    }

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', img.id,
                'image_url', img.image_url,
                'alt_text', img.alt_text,
                'display_order', img.display_order,
                'is_primary', img.is_primary
              ) ORDER BY img.is_primary DESC, img.display_order ASC
            )
            FROM product_images img
            WHERE img.product_id = p.id
          ), '[]'::json
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
      ORDER BY ${orderBy}
      ${paginationSql}
    `;

    const res = await query(sql, params);
    const products: Product[] = res.rows.map(row => ({
      ...row,
      selling_price: parseFloat(row.selling_price),
      original_price: row.original_price ? parseFloat(row.original_price) : null,
      images: Array.isArray(row.images) ? row.images : []
    }));

    return { products, total };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', img.id,
                'image_url', img.image_url,
                'alt_text', img.alt_text,
                'display_order', img.display_order,
                'is_primary', img.is_primary
              ) ORDER BY img.is_primary DESC, img.display_order ASC
            )
            FROM product_images img
            WHERE img.product_id = p.id
          ), '[]'::json
        ) as images,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', v.id,
                'variant_type', v.variant_type,
                'variant_value', v.variant_value,
                'variant_sku', v.variant_sku,
                'price_override', v.price_override,
                'stock_quantity', v.stock_quantity,
                'is_available', v.is_available
              ) ORDER BY v.variant_type, v.variant_value
            )
            FROM product_variants v
            WHERE v.product_id = p.id AND v.is_available = true
          ), '[]'::json
        ) as variants,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', a.id,
                'attribute_name', a.attribute_name,
                'attribute_value', a.attribute_value,
                'display_order', a.display_order
              ) ORDER BY a.display_order ASC, a.attribute_name ASC
            )
            FROM product_attributes a
            WHERE a.product_id = p.id
          ), '[]'::json
        ) as attributes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
      LIMIT 1
    `;

    const res = await query(sql, [slug]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      ...row,
      selling_price: parseFloat(row.selling_price),
      original_price: row.original_price ? parseFloat(row.original_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      variants: Array.isArray(row.variants) ? row.variants : [],
      attributes: Array.isArray(row.attributes) ? row.attributes : []
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', img.id,
                'image_url', img.image_url,
                'alt_text', img.alt_text,
                'display_order', img.display_order,
                'is_primary', img.is_primary
              ) ORDER BY img.is_primary DESC, img.display_order ASC
            )
            FROM product_images img
            WHERE img.product_id = p.id
          ), '[]'::json
        ) as images,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', v.id,
                'variant_type', v.variant_type,
                'variant_value', v.variant_value,
                'variant_sku', v.variant_sku,
                'price_override', v.price_override,
                'stock_quantity', v.stock_quantity,
                'is_available', v.is_available
              ) ORDER BY v.variant_type, v.variant_value
            )
            FROM product_variants v
            WHERE v.product_id = p.id
          ), '[]'::json
        ) as variants,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', a.id,
                'attribute_name', a.attribute_name,
                'attribute_value', a.attribute_value,
                'display_order', a.display_order
              ) ORDER BY a.display_order ASC, a.attribute_name ASC
            )
            FROM product_attributes a
            WHERE a.product_id = p.id
          ), '[]'::json
        ) as attributes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
      LIMIT 1
    `;

    const res = await query(sql, [id]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      ...row,
      selling_price: parseFloat(row.selling_price),
      original_price: row.original_price ? parseFloat(row.original_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      variants: Array.isArray(row.variants) ? row.variants : [],
      attributes: Array.isArray(row.attributes) ? row.attributes : []
    };
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const res = await query(`
      SELECT
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE publication_status = 'published') as active_products,
        COUNT(*) FILTER (WHERE publication_status = 'draft') as draft_products,
        COUNT(*) FILTER (WHERE availability_status = 'out_of_stock') as out_of_stock_products,
        COUNT(*) FILTER (WHERE is_featured = true) as featured_products,
        (SELECT COUNT(*) FROM categories WHERE is_active = true) as total_categories
      FROM products
    `);

    const row = res.rows[0] || {};
    return {
      totalProducts: parseInt(row.total_products || '0', 10),
      activeProducts: parseInt(row.active_products || '0', 10),
      draftProducts: parseInt(row.draft_products || '0', 10),
      outOfStockProducts: parseInt(row.out_of_stock_products || '0', 10),
      featuredProducts: parseInt(row.featured_products || '0', 10),
      totalCategories: parseInt(row.total_categories || '0', 10),
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      draftProducts: 0,
      outOfStockProducts: 0,
      featuredProducts: 0,
      totalCategories: 0,
    };
  }
}
