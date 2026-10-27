import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:2wrNRW-8xX!Gf_T@db.wfwnycshxwingwqeljfg.supabase.co:5432/postgres';

const { Pool } = pg;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const schemaSql = `
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  brand TEXT,
  selling_price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),
  stock_quantity INTEGER DEFAULT 25,
  availability_status TEXT DEFAULT 'in_stock', -- in_stock, low_stock, out_of_stock
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  publication_status TEXT DEFAULT 'published', -- published, draft, archived
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product Variants table (Sizes, Colours, Options)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL, -- e.g. Size, Colour, Option
  variant_value TEXT NOT NULL, -- e.g. S, M, L, XL, Black, 128GB
  variant_sku TEXT,
  price_override NUMERIC(12, 2),
  stock_quantity INTEGER DEFAULT 10,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Attributes table (Specifications)
CREATE TABLE IF NOT EXISTS product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  attribute_value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Store Settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'SeedCart',
  store_tagline TEXT DEFAULT 'Premium Online Store',
  store_description TEXT DEFAULT 'Your premier multi-category shopping destination for fashion, gadgets, home, beauty, accessories, and lifestyle.',
  logo_url TEXT,
  contact_whatsapp_number TEXT DEFAULT '919744744960',
  contact_email TEXT DEFAULT 'support@seedcart.shop',
  contact_phone TEXT DEFAULT '+91 97447 44960',
  contact_address TEXT DEFAULT 'SeedCart Store, Kerala, India',
  currency TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  hero_title TEXT DEFAULT 'Discover Premium Multi-Category Shopping',
  hero_subtitle TEXT DEFAULT 'Explore trending fashion, latest electronics, luxury beauty, home essentials, and more. Instant WhatsApp ordering with zero checkout hassle.',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(publication_status, availability_status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
`;

const initialCategories = [
  {
    name: "Fashion & Clothing",
    slug: "fashion-clothing",
    description: "Trending apparel for men, women, and kids including t-shirts, dresses, ethnic wear, and winterwear.",
    image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    display_order: 1
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Sneakers, formal shoes, casual slip-ons, boots, and sports footwear.",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    display_order: 2
  },
  {
    name: "Fashion Accessories",
    slug: "fashion-accessories",
    description: "Designer watches, sunglasses, luxury belts, leather wallets, handbags, and backpacks.",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    display_order: 3
  },
  {
    name: "Cosmetics & Beauty",
    slug: "cosmetics-beauty",
    description: "Skincare, luxury makeup, face serums, perfumes, grooming essentials, and hair styling.",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    display_order: 4
  },
  {
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    description: "Smartphones, premium headphones, wireless earbuds, smartwatches, chargers, and gaming accessories.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    display_order: 5
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Aesthetic home decor, ambient lighting, bedsheets, cushions, organizers, and kitchenware.",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    display_order: 6
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Action figures, educational toys, puzzles, board games, and creative craft kits.",
    image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    display_order: 7
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    description: "Baby care essentials, nursery accessories, kids' bags, and infant wear.",
    image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    display_order: 8
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Workout equipment, yoga mats, gym accessories, water bottles, and sports gear.",
    image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    display_order: 9
  },
  {
    name: "Jewellery & Watches",
    slug: "jewellery-watches",
    description: "Fine rings, necklaces, minimalist bracelets, luxury timepieces, and pendants.",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    display_order: 10
  },
  {
    name: "Stationery & Office",
    slug: "stationery-office",
    description: "Executive notebooks, fountain pens, desk organizers, planners, and art supplies.",
    image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    display_order: 11
  },
  {
    name: "Automotive & Lifestyle",
    slug: "automotive-lifestyle",
    description: "Car interior accessories, magnetic phone mounts, travel gear, and everyday carry essentials.",
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    display_order: 12
  }
];

export async function initDb() {
  console.log("Connecting to PostgreSQL database...");
  const client = await pool.connect();
  try {
    console.log("Creating database schema...");
    await client.query(schemaSql);
    console.log("Schema created or verified successfully.");

    // Check existing store settings
    const settingsRes = await client.query("SELECT * FROM store_settings LIMIT 1");
    if (settingsRes.rows.length === 0) {
      await client.query(`
        INSERT INTO store_settings (store_name, store_tagline, store_description, contact_whatsapp_number)
        VALUES ('SeedCart', 'Premium Multi-Category Store', 'Shop curated fashion, electronics, cosmetics, and lifestyle products.', '919744744960')
      `);
      console.log("Initialized default store settings.");
    }

    // Insert categories if not present
    for (const cat of initialCategories) {
      await client.query(
        `INSERT INTO categories (name, slug, description, image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             image_url = EXCLUDED.image_url,
             display_order = EXCLUDED.display_order`,
        [cat.name, cat.slug, cat.description, cat.image_url, cat.display_order]
      );
    }
    console.log("Categories seeded successfully.");

    // Check if products exist, seed initial products if count is 0
    const prodRes = await client.query("SELECT COUNT(*) FROM products");
    if (parseInt(prodRes.rows[0].count) === 0) {
      console.log("Seeding initial high-quality products...");
      
      // Get category IDs
      const catMap = {};
      const allCats = await client.query("SELECT id, slug FROM categories");
      for (const row of allCats.rows) {
        catMap[row.slug] = row.id;
      }

      const sampleProducts = [
        {
          sku: "PRD-FASH-001",
          name: "Premium Heavyweight Cotton Oversized T-Shirt",
          slug: "premium-heavyweight-cotton-oversized-t-shirt",
          category_slug: "fashion-clothing",
          brand: "Aura Essentials",
          selling_price: 899,
          original_price: 1499,
          short_description: "240 GSM pure combed cotton oversized tee with drop-shoulder fit and ribbed collar.",
          description: "Elevate your daily streetwear with this meticulously tailored heavyweight oversized tee. Crafted from 100% pre-shrunk combed cotton with bio-wash finish for silky softness and extreme durability. Features drop-shoulder styling, double-needle stitched hems, and a non-sagging ribbed crewneck.",
          is_featured: true,
          is_new_arrival: true,
          is_best_seller: true,
          images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Size", value: "S" },
            { type: "Size", value: "M" },
            { type: "Size", value: "L" },
            { type: "Size", value: "XL" },
            { type: "Colour", value: "Jet Black" },
            { type: "Colour", value: "Vintage Beige" },
            { type: "Colour", value: "Forest Green" }
          ],
          attributes: [
            { name: "Fabric", value: "100% Combed Cotton, 240 GSM" },
            { name: "Fit", value: "Relaxed Oversized Drop-Shoulder" },
            { name: "Wash Care", value: "Machine wash cold, tumble dry low" },
            { name: "Origin", value: "Made in India" }
          ]
        },
        {
          sku: "PRD-ELEC-002",
          name: "SonicPro Active Noise-Cancelling Wireless Headphones",
          slug: "sonicpro-anc-wireless-headphones",
          category_slug: "electronics-gadgets",
          brand: "SonicAcoustics",
          selling_price: 3499,
          original_price: 6999,
          short_description: "Hybrid active noise cancellation, 40mm beryllium drivers, and 50-hour battery life.",
          description: "Immerse yourself in studio-grade audio fidelity with the SonicPro ANC Wireless Headphones. Powered by custom 40mm dynamic drivers that deliver punchy bass and crystalline highs. With advanced 3-level hybrid active noise cancellation up to 38dB, stay focused whether traveling or in busy workspaces.",
          is_featured: true,
          is_new_arrival: false,
          is_best_seller: true,
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Colour", value: "Matte Black" },
            { type: "Colour", value: "Silver Platinum" },
            { type: "Colour", value: "Midnight Navy" }
          ],
          attributes: [
            { name: "Bluetooth Version", value: "5.3 with AAC/aptX support" },
            { name: "Battery Life", value: "Up to 50 hours (ANC on)" },
            { name: "Charging", value: "USB-C Fast Charging (10 mins = 5 hrs)" },
            { name: "Microphone", value: "Dual beamforming AI mics for clear calls" }
          ]
        },
        {
          sku: "PRD-FOOT-003",
          name: "CloudGlide Retro Cushion Running Sneakers",
          slug: "cloudglide-retro-cushion-running-sneakers",
          category_slug: "footwear",
          brand: "Veloce Sport",
          selling_price: 2199,
          original_price: 3999,
          short_description: "Ultra-responsive nitrogen-infused foam sole with breathable knit upper.",
          description: "Experience cloud-like cushioning with every stride. The CloudGlide sneakers fuse vintage 90s aesthetic with modern performance technology. Breathable engineered mesh upper keeps your feet cool, while the high-rebound midsole reduces joint fatigue.",
          is_featured: true,
          is_new_arrival: true,
          is_best_seller: false,
          images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Size", value: "UK 7" },
            { type: "Size", value: "UK 8" },
            { type: "Size", value: "UK 9" },
            { type: "Size", value: "UK 10" },
            { type: "Colour", value: "Crimson Red / White" },
            { type: "Colour", value: "All-White Classic" }
          ],
          attributes: [
            { name: "Sole Material", value: "Nitrogen Infused EVA + Rubber Grip" },
            { name: "Upper Material", value: "Engineered Jacquard Knit" },
            { name: "Closure", value: "Lace-Up" },
            { name: "Ideal For", value: "Running, Gym, Daily Casual" }
          ]
        },
        {
          sku: "PRD-BEAU-004",
          name: "Radiant Glow Vitamin C & Hyaluronic Acid Face Serum (30ml)",
          slug: "radiant-glow-vitamin-c-hyaluronic-acid-serum",
          category_slug: "cosmetics-beauty",
          brand: "Lumiere Botanics",
          selling_price: 649,
          original_price: 1199,
          short_description: "15% active Vitamin C with Ferulic Acid and multi-molecular Hyaluronic Acid.",
          description: "Revitalize dull skin and fade hyperpigmentation with Lumiere Botanics 15% Ethyl Ascorbic Acid Serum. Formulated with pure botanical extracts, Centella Asiatica, and multi-molecular weight Hyaluronic Acid for deep plumping hydration and luminous tone.",
          is_featured: false,
          is_new_arrival: true,
          is_best_seller: true,
          images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1608248597359-399092c23c7f?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Volume", value: "30ml Standard Dropper" },
            { type: "Volume", value: "50ml Economy Value" }
          ],
          attributes: [
            { name: "Skin Type", value: "All skin types, sensitive skin friendly" },
            { name: "Key Ingredients", value: "15% Vitamin C, 1% Hyaluronic Acid, Ferulic Acid" },
            { name: "Free From", value: "Parabens, Sulfates, Artificial Fragrance" },
            { name: "Cruelty Free", value: "100% PETA Certified Vegan" }
          ]
        },
        {
          sku: "PRD-HOME-005",
          name: "Nordic Minimalist Amber Glass Aromatherapy Diffuser Lamp",
          slug: "nordic-minimalist-amber-glass-aromatherapy-lamp",
          category_slug: "home-living",
          brand: "NordicVibe",
          selling_price: 1699,
          original_price: 2999,
          short_description: "Ultrasonic cool-mist aroma diffuser with dimmable ambient warm LED glow.",
          description: "Transform your bedroom or living space into a serene sanctuary. Hand-blown ribbed amber glass shade paired with warm 2700K ambient LED lighting and whisper-quiet ultrasonic atomization. Features auto shut-off, 3 timer settings, and up to 10 hours continuous mist.",
          is_featured: true,
          is_new_arrival: true,
          is_best_seller: false,
          images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Colour", value: "Amber Smoke" },
            { type: "Colour", value: "Frosted Opal White" }
          ],
          attributes: [
            { name: "Capacity", value: "350ml Water Tank" },
            { name: "Coverage Area", value: "Up to 300 sq. ft." },
            { name: "Power", value: "USB-C / 12V DC Adapter included" },
            { name: "Material", value: "Handblown Glass & BPA-free PP" }
          ]
        },
        {
          sku: "PRD-WAT-006",
          name: "Chronos Classic Men's Automatic Chronograph Watch",
          slug: "chronos-classic-automatic-chronograph-watch",
          category_slug: "jewellery-watches",
          brand: "Chronos Atelier",
          selling_price: 4999,
          original_price: 9999,
          short_description: "Japanese Miyota movement, sapphire crystal glass, and Italian genuine leather strap.",
          description: "Meticulous horological craftsmanship at an accessible price point. Features an automatic self-winding mechanical movement visible through the exhibition caseback, scratch-resistant anti-reflective sapphire glass, and genuine full-grain Italian leather strap with quick-release spring bars.",
          is_featured: true,
          is_new_arrival: false,
          is_best_seller: true,
          images: [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80"
          ],
          variants: [
            { type: "Dial Colour", value: "Sunburst Emerald Green" },
            { type: "Dial Colour", value: "Deep Midnight Blue" },
            { type: "Dial Colour", value: "Classic Champagne Gold" }
          ],
          attributes: [
            { name: "Case Diameter", value: "40mm 316L Stainless Steel" },
            { name: "Movement", value: "Automatic Mechanical (42hr reserve)" },
            { name: "Water Resistance", value: "5 ATM (50 meters)" },
            { name: "Glass", value: "Double Curved Sapphire Crystal" }
          ]
        }
      ];

      for (const p of sampleProducts) {
        const catId = catMap[p.category_slug];
        if (!catId) continue;

        const prodInsert = await client.query(
          `INSERT INTO products (sku, name, slug, short_description, description, category_id, brand, selling_price, original_price, is_featured, is_new_arrival, is_best_seller, publication_status, availability_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'published', 'in_stock')
           RETURNING id`,
          [p.sku, p.name, p.slug, p.short_description, p.description, catId, p.brand, p.selling_price, p.original_price, p.is_featured, p.is_new_arrival, p.is_best_seller]
        );
        const productId = prodInsert.rows[0].id;

        // Insert images
        for (let i = 0; i < p.images.length; i++) {
          await client.query(
            `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
             VALUES ($1, $2, $3, $4, $5)`,
            [productId, p.images[i], p.name, i, i === 0]
          );
        }

        // Insert variants
        for (const v of p.variants) {
          await client.query(
            `INSERT INTO product_variants (product_id, variant_type, variant_value, is_available)
             VALUES ($1, $2, $3, true)`,
            [productId, v.type, v.value]
          );
        }

        // Insert attributes
        for (let j = 0; j < p.attributes.length; j++) {
          const a = p.attributes[j];
          await client.query(
            `INSERT INTO product_attributes (product_id, attribute_name, attribute_value, display_order)
             VALUES ($1, $2, $3, $4)`,
            [productId, a.name, a.value, j]
          );
        }
      }
      console.log("Seeded sample products with rich images, variants, and specifications.");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

initDb().catch(err => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
