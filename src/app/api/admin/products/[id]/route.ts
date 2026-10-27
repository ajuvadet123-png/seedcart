import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/auth';
import { getClient, query } from '@/lib/db';
import { getProductById } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await client.query('BEGIN');

    // Update existing product record (NOT creating duplicate!)
    const updateSql = `
      UPDATE products SET
        sku = COALESCE($1, sku),
        name = $2,
        slug = $3,
        short_description = $4,
        description = $5,
        category_id = $6,
        brand = $7,
        selling_price = $8,
        original_price = $9,
        stock_quantity = $10,
        availability_status = $11,
        publication_status = $12,
        is_featured = $13,
        is_new_arrival = $14,
        is_best_seller = $15,
        updated_at = now()
      WHERE id = $16
      RETURNING *
    `;

    const res = await client.query(updateSql, [
      sku,
      name,
      slug,
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
      !!is_best_seller,
      params.id
    ]);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Refresh images: delete and re-insert
    await client.query('DELETE FROM product_images WHERE product_id = $1', [params.id]);
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imageUrl = typeof img === 'string' ? img : img.image_url;
        if (!imageUrl) continue;
        const isPrimary = typeof img === 'object' && img.is_primary !== undefined ? img.is_primary : (i === 0);
        await client.query(
          `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [params.id, imageUrl, name, i, isPrimary]
        );
      }
    }

    // Refresh variants: delete and re-insert
    await client.query('DELETE FROM product_variants WHERE product_id = $1', [params.id]);
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (!v.variant_type || !v.variant_value) continue;
        await client.query(
          `INSERT INTO product_variants (product_id, variant_type, variant_value, variant_sku, price_override, is_available)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [params.id, v.variant_type, v.variant_value, v.variant_sku || null, v.price_override || null, v.is_available !== false]
        );
      }
    }

    // Refresh attributes: delete and re-insert
    await client.query('DELETE FROM product_attributes WHERE product_id = $1', [params.id]);
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (let j = 0; j < attributes.length; j++) {
        const attr = attributes[j];
        if (!attr.attribute_name || !attr.attribute_value) continue;
        await client.query(
          `INSERT INTO product_attributes (product_id, attribute_name, attribute_value, display_order)
           VALUES ($1, $2, $3, $4)`,
          [params.id, attr.attribute_name, attr.attribute_value, j]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, product: res.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query('DELETE FROM products WHERE id = $1 RETURNING id', [params.id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
