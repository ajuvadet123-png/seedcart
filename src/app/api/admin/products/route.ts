import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '../../../../lib/auth';
import { getClient, query } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const whereClauses: string[] = [];
    const params: any[] = [];
    let pIdx = 1;

    if (category && category !== 'all') {
      whereClauses.push(`p.category_id = $${pIdx++}`);
      params.push(category);
    }

    if (status && status !== 'all') {
      whereClauses.push(`p.publication_status = $${pIdx++}`);
      params.push(status);
    }

    if (search && search.trim()) {
      whereClauses.push(`(p.name ILIKE $${pIdx} OR p.sku ILIKE $${pIdx} OR p.brand ILIKE $${pIdx})`);
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(
          (SELECT img.image_url FROM product_images img WHERE img.product_id = p.id AND img.is_primary = true LIMIT 1),
          (SELECT img.image_url FROM product_images img WHERE img.product_id = p.id LIMIT 1),
          'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80'
        ) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereSql}
      ORDER BY p.created_at DESC
    `;

    const res = await query(sql, params);
    return NextResponse.json({ products: res.rows });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await getClient();
  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      category_id,
      brand,
      selling_price,
      original_price,
      short_description,
      description,
      stock_quantity = 10,
      availability_status = 'in_stock',
      publication_status = 'published',
      is_featured = false,
      is_new_arrival = false,
      is_best_seller = false,
      images = [],
      variants = [],
      attributes = []
    } = body;

    if (!name || !category_id || !selling_price) {
      return NextResponse.json(
        { error: 'Name, Category, and Selling Price are required' },
        { status: 400 }
      );
    }

    // Auto-generate slug and SKU if missing
    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const uniqueSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    const finalSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    await client.query('BEGIN');

    const insertProdSql = `
      INSERT INTO products (
        sku, name, slug, short_description, description, category_id, brand,
        selling_price, original_price, stock_quantity, availability_status,
        publication_status, is_featured, is_new_arrival, is_best_seller, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now())
      RETURNING *
    `;

    const prodRes = await client.query(insertProdSql, [
      finalSku,
      name,
      uniqueSlug,
      short_description,
      description,
      category_id,
      brand,
      parseFloat(selling_price),
      original_price ? parseFloat(original_price) : null,
      parseInt(stock_quantity, 10),
      availability_status,
      publication_status,
      !!is_featured,
      !!is_new_arrival,
      !!is_best_seller
    ]);

    const newProduct = prodRes.rows[0];

    // Insert Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imageUrl = typeof img === 'string' ? img : img.image_url;
        if (!imageUrl) continue;
        const isPrimary = typeof img === 'object' && img.is_primary !== undefined ? img.is_primary : (i === 0);
        await client.query(
          `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [newProduct.id, imageUrl, name, i, isPrimary]
        );
      }
    }

    // Insert Variants
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (!v.variant_type || !v.variant_value) continue;
        await client.query(
          `INSERT INTO product_variants (product_id, variant_type, variant_value, variant_sku, price_override, is_available)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [newProduct.id, v.variant_type, v.variant_value, v.variant_sku || null, v.price_override || null, v.is_available !== false]
        );
      }
    }

    // Insert Attributes
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (let j = 0; j < attributes.length; j++) {
        const attr = attributes[j];
        if (!attr.attribute_name || !attr.attribute_value) continue;
        await client.query(
          `INSERT INTO product_attributes (product_id, attribute_name, attribute_value, display_order)
           VALUES ($1, $2, $3, $4)`,
          [newProduct.id, attr.attribute_name, attr.attribute_value, j]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  } finally {
    client.release();
  }
}
