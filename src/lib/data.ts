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
    store_name: 'SEED',
    store_tagline: 'Rooted in quality',
    store_description: 'Engineered for movement, tailored for life. Premium technical apparel, fashion, and lifestyle shopping with instant WhatsApp ordering.',
    contact_whatsapp_number: '919744744960',
    contact_email: 'support@seedcart.shop',
    contact_phone: '+91 97447 44960',
    contact_address: 'SEED Store, Kerala, India',
    currency: 'INR',
    currency_symbol: '₹',
    hero_title: 'Seed Sport Project',
    hero_subtitle: 'Engineered for movement, tailored for life. Discover technical silhouettes, premium outerwear, and everyday essentials built to endure.',
    hero_image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=2000&q=85'
  };
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Fashion & Clothing",
    slug: "fashion-clothing",
    description: "Trending street silhouettes, heavyweight cotton tees, technical outerwear, and lifestyle apparel.",
    image_url: "/images/collections/jackets.jpg",
    display_order: 1,
    is_active: true,
    product_count: 8,
  },
  {
    id: "cat-2",
    name: "Footwear",
    slug: "footwear",
    description: "Technical runners, retro cushion sneakers, lifestyle slip-ons, and performance shoes.",
    image_url: "/images/collections/footwear.jpg",
    display_order: 2,
    is_active: true,
    product_count: 6,
  },
  {
    id: "cat-3",
    name: "Fashion Accessories",
    slug: "fashion-accessories",
    description: "Minimalist leather goods, caps, bags, utility packs, and everyday carry essentials.",
    image_url: "/images/collections/accessories.jpg",
    display_order: 3,
    is_active: true,
    product_count: 5,
  },
  {
    id: "cat-4",
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    description: "Studio headphones, ANC earbuds, smart wearables, and audio tech.",
    image_url: "/images/products/headphone-black.jpg",
    display_order: 4,
    is_active: true,
    product_count: 4,
  },
  {
    id: "cat-5",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Performance training gear, gym accessories, yoga mats, and active lifestyle goods.",
    image_url: "/images/hero-sport.jpg",
    display_order: 5,
    is_active: true,
    product_count: 4,
  },
  {
    id: "cat-6",
    name: "Jewellery & Watches",
    slug: "jewellery-watches",
    description: "Fine timepieces, stainless steel automatic watches, and minimalist accessories.",
    image_url: "/images/products/watch-chrono.jpg",
    display_order: 6,
    is_active: true,
    product_count: 3,
  },
];

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
    if (res.rows && res.rows.length > 0) {
      return res.rows.map(row => ({
        ...row,
        product_count: parseInt(row.product_count || '0', 10)
      }));
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
  return DEFAULT_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
    if (res.rows[0]) return res.rows[0];
  } catch (error) {
    console.error('Error fetching category by slug:', error);
  }
  return DEFAULT_CATEGORIES.find(c => c.slug === slug) || null;
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "PRD-FASH-001",
    name: "Heavyweight Cotton Oversized Boxy Tee",
    slug: "heavyweight-cotton-oversized-boxy-tee",
    category_id: "cat-1",
    category_name: "Fashion & Clothing",
    category_slug: "fashion-clothing",
    brand: "SEED Essentials",
    selling_price: 999,
    original_price: 1599,
    stock_quantity: 40,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    publication_status: "published",
    short_description: "260 GSM combed cotton with drop-shoulder cut and ribbed crewneck.",
    description: "Built for everyday comfort with high-density 260 GSM combed cotton. Features dropped shoulders, reinforced neckline, and double-stitched hems designed to maintain structure wash after wash.",
    images: [
      { id: "img-1", image_url: "/images/products/tee-black.jpg", is_primary: true, display_order: 0 },
      { id: "img-2", image_url: "/images/products/tee-back.jpg", is_primary: false, display_order: 1 }
    ],
    variants: [
      { id: "v-1", product_id: "prod-1", variant_type: "Size", variant_value: "S", is_available: true },
      { id: "v-2", product_id: "prod-1", variant_type: "Size", variant_value: "M", is_available: true },
      { id: "v-3", product_id: "prod-1", variant_type: "Size", variant_value: "L", is_available: true },
      { id: "v-4", product_id: "prod-1", variant_type: "Size", variant_value: "XL", is_available: true },
      { id: "v-5", product_id: "prod-1", variant_type: "Colour", variant_value: "Jet Black", is_available: true },
      { id: "v-6", product_id: "prod-1", variant_type: "Colour", variant_value: "Vintage Bone", is_available: true }
    ],
    attributes: [
      { id: "a-1", product_id: "prod-1", attribute_name: "Fabric", attribute_value: "100% Combed Heavyweight Cotton", display_order: 1 },
      { id: "a-2", product_id: "prod-1", attribute_name: "Fit", attribute_value: "Relaxed Boxy Fit", display_order: 2 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-2",
    sku: "PRD-FOOT-002",
    name: "CloudGlide Retro Cushion Running Sneakers",
    slug: "cloudglide-retro-cushion-running-sneakers",
    category_id: "cat-2",
    category_name: "Footwear",
    category_slug: "footwear",
    brand: "SEED Sport",
    selling_price: 2499,
    original_price: 4499,
    stock_quantity: 25,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    publication_status: "published",
    short_description: "Ultra-responsive nitrogen-infused foam sole with breathable knit upper.",
    description: "Engineered for road running and all-day street comfort with nitrogen-infused midsole dampening, engineered jacquard knit, and reinforced high-traction rubber outsole.",
    images: [
      { id: "img-3", image_url: "/images/products/sneaker-red.jpg", is_primary: true, display_order: 0 },
      { id: "img-4", image_url: "/images/products/sneaker-white.jpg", is_primary: false, display_order: 1 }
    ],
    variants: [
      { id: "v-7", product_id: "prod-2", variant_type: "Size", variant_value: "UK 7", is_available: true },
      { id: "v-8", product_id: "prod-2", variant_type: "Size", variant_value: "UK 8", is_available: true },
      { id: "v-9", product_id: "prod-2", variant_type: "Size", variant_value: "UK 9", is_available: true },
      { id: "v-10", product_id: "prod-2", variant_type: "Size", variant_value: "UK 10", is_available: true }
    ],
    attributes: [
      { id: "a-3", product_id: "prod-2", attribute_name: "Sole", attribute_value: "Nitrogen EVA + Rubber Grip", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-3",
    sku: "PRD-ELEC-003",
    name: "SonicPro Active Noise-Cancelling Wireless Headphones",
    slug: "sonicpro-anc-wireless-headphones",
    category_id: "cat-4",
    category_name: "Electronics & Gadgets",
    category_slug: "electronics-gadgets",
    brand: "SonicAcoustics",
    selling_price: 3499,
    original_price: 6999,
    stock_quantity: 30,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    publication_status: "published",
    short_description: "Hybrid active noise cancellation with 40mm beryllium drivers and 50h battery.",
    description: "Studio-grade frequency response with 3-tier hybrid active noise cancellation up to 38dB. Features memory foam earcups, USB-C rapid charging, and crystal-clear dual beamforming microphones.",
    images: [
      { id: "img-5", image_url: "/images/products/headphone-black.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-11", product_id: "prod-3", variant_type: "Colour", variant_value: "Matte Black", is_available: true },
      { id: "v-12", product_id: "prod-3", variant_type: "Colour", variant_value: "Platinum Silver", is_available: true }
    ],
    attributes: [
      { id: "a-4", product_id: "prod-3", attribute_name: "Battery Life", attribute_value: "50 Hours", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-4",
    sku: "PRD-WAT-004",
    name: "Chronos Classic Men's Automatic Chronograph Watch",
    slug: "chronos-classic-automatic-chronograph-watch",
    category_id: "cat-6",
    category_name: "Jewellery & Watches",
    category_slug: "jewellery-watches",
    brand: "SEED Chrono",
    selling_price: 4999,
    original_price: 9999,
    stock_quantity: 15,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    publication_status: "published",
    short_description: "Japanese automatic movement, sapphire crystal glass, and Italian leather strap.",
    description: "Precision automatic mechanical movement with double-domed scratch-resistant sapphire crystal and full-grain Italian leather band. 5 ATM water resistance.",
    images: [
      { id: "img-7", image_url: "/images/products/watch-chrono.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-13", product_id: "prod-4", variant_type: "Dial Colour", variant_value: "Sunburst Emerald", is_available: true },
      { id: "v-14", product_id: "prod-4", variant_type: "Dial Colour", variant_value: "Midnight Noir", is_available: true }
    ],
    attributes: [
      { id: "a-5", product_id: "prod-4", attribute_name: "Glass", attribute_value: "Sapphire Crystal", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-5",
    sku: "PRD-JACK-005",
    name: "Technical Ripstop Windbreaker Shell Jacket",
    slug: "technical-ripstop-windbreaker-shell-jacket",
    category_id: "cat-1",
    category_name: "Fashion & Clothing",
    category_slug: "fashion-clothing",
    brand: "SEED Sport Project",
    selling_price: 2999,
    original_price: 5499,
    stock_quantity: 20,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    publication_status: "published",
    short_description: "Water-repellent DWR coated ripstop nylon shell with taped sealed seams.",
    description: "Designed for variable weather conditions with breathable underarm vents, adjustable bungee hem, YKK weatherproof zips, and packable inner chest pocket.",
    images: [
      { id: "img-9", image_url: "/images/products/jacket-wind.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-15", product_id: "prod-5", variant_type: "Size", variant_value: "M", is_available: true },
      { id: "v-16", product_id: "prod-5", variant_type: "Size", variant_value: "L", is_available: true },
      { id: "v-17", product_id: "prod-5", variant_type: "Size", variant_value: "XL", is_available: true }
    ],
    attributes: [
      { id: "a-6", product_id: "prod-5", attribute_name: "Material", attribute_value: "100% Ripstop Nylon with DWR", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-6",
    sku: "PRD-BAG-006",
    name: "Tactical Utility Modular Crossbody Sling Bag",
    slug: "tactical-utility-modular-crossbody-sling-bag",
    category_id: "cat-3",
    category_name: "Fashion Accessories",
    category_slug: "fashion-accessories",
    brand: "SEED Urban Carry",
    selling_price: 1299,
    original_price: 2199,
    stock_quantity: 35,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    publication_status: "published",
    short_description: "1000D Cordura weather-resistant fabric with quick-release magnetic fidlock buckle.",
    description: "The ultimate everyday companion featuring modular webbing straps, water-resistant compartments, dedicated tablet sleeve, and magnetic quick-release closure.",
    images: [
      { id: "img-11", image_url: "/images/products/bag-tactical.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-18", product_id: "prod-6", variant_type: "Colour", variant_value: "Tactical Black", is_available: true },
      { id: "v-19", product_id: "prod-6", variant_type: "Colour", variant_value: "Olive Drab", is_available: true }
    ],
    attributes: [
      { id: "a-7", product_id: "prod-6", attribute_name: "Fabric", attribute_value: "1000D Cordura Nylon", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-7",
    sku: "PRD-HEAD-007",
    name: "Performance Technical Waterproof Cap",
    slug: "performance-technical-waterproof-cap",
    category_id: "cat-3",
    category_name: "Fashion Accessories",
    category_slug: "fashion-accessories",
    brand: "SEED Sport Project",
    selling_price: 799,
    original_price: 1299,
    stock_quantity: 50,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    publication_status: "published",
    short_description: "Quick-dry breathable 5-panel cap with reflective SEED logo and laser-cut eyelets.",
    description: "Built for active workouts and street everyday styling. Features lightweight quick-dry polyester with anti-sweat headband and adjustable nylon strap with low-profile buckle.",
    images: [
      { id: "img-12", image_url: "/images/products/cap-black.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-20", product_id: "prod-7", variant_type: "Colour", variant_value: "Stealth Black", is_available: true }
    ],
    attributes: [
      { id: "a-8", product_id: "prod-7", attribute_name: "Closure", attribute_value: "Adjustable Nylon Strap", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-8",
    sku: "PRD-BOTT-008",
    name: "Urban Tactical Modular Cargo Pants",
    slug: "urban-tactical-modular-cargo-pants",
    category_id: "cat-1",
    category_name: "Fashion & Clothing",
    category_slug: "fashion-clothing",
    brand: "SEED Streetwear",
    selling_price: 2199,
    original_price: 3899,
    stock_quantity: 30,
    availability_status: "in_stock",
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    publication_status: "published",
    short_description: "Stretch ripstop cargo trousers with 8 utility pockets and cinchable hems.",
    description: "Heavy-duty cotton-spandex ripstop weave with articulated knees, reinforced pocket seams, and elasticized cinchable cuffs for customizable styling.",
    images: [
      { id: "img-13", image_url: "/images/products/pants-cargo.jpg", is_primary: true, display_order: 0 }
    ],
    variants: [
      { id: "v-21", product_id: "prod-8", variant_type: "Size", variant_value: "30", is_available: true },
      { id: "v-22", product_id: "prod-8", variant_type: "Size", variant_value: "32", is_available: true },
      { id: "v-23", product_id: "prod-8", variant_type: "Size", variant_value: "34", is_available: true }
    ],
    attributes: [
      { id: "a-9", product_id: "prod-8", attribute_name: "Material", attribute_value: "98% Cotton, 2% Spandex Ripstop", display_order: 1 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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
    let filtered = [...DEFAULT_PRODUCTS];
    if (filters.categorySlug) {
      filtered = filtered.filter(p => p.category_slug === filters.categorySlug);
    }
    if (filters.isFeatured) {
      filtered = filtered.filter(p => p.is_featured);
    }
    if (filters.isNewArrival) {
      filtered = filtered.filter(p => p.is_new_arrival);
    }
    if (filters.isBestSeller) {
      filtered = filtered.filter(p => p.is_best_seller);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }
    const limit = filters.limit || filtered.length;
    return { products: filtered.slice(0, limit), total: filtered.length };
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
  }
  return DEFAULT_PRODUCTS.find(p => p.slug === slug) || null;
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
