import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sql = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
      FROM categories c
      ORDER BY c.display_order ASC, c.name ASC
    `;
    const res = await query(sql);
    return NextResponse.json({
      categories: res.rows.map(r => ({
        ...r,
        product_count: parseInt(r.product_count || '0', 10)
      }))
    });
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, image_url, display_order = 0, is_active = true } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const insertSql = `
      INSERT INTO categories (name, slug, description, image_url, display_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const res = await query(insertSql, [
      name,
      finalSlug,
      description || null,
      image_url || null,
      parseInt(display_order, 10) || 0,
      is_active !== false
    ]);

    return NextResponse.json({ success: true, category: res.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, slug, description, image_url, display_order, is_active } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'Category ID and Name are required' }, { status: 400 });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    const updateSql = `
      UPDATE categories SET
        name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        display_order = $5,
        is_active = $6,
        updated_at = now()
      WHERE id = $7
      RETURNING *
    `;

    const res = await query(updateSql, [
      name,
      finalSlug,
      description || null,
      image_url || null,
      parseInt(display_order, 10) || 0,
      is_active !== false,
      id
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: res.rows[0] });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check if products exist in category
    const checkRes = await query('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);
    const prodCount = parseInt(checkRes.rows[0]?.count || '0', 10);

    if (prodCount > 0 && !force) {
      return NextResponse.json({
        error: `Cannot delete: Category contains ${prodCount} product(s). Please reassign or delete these products first.`,
        productCount: prodCount,
        hasProducts: true
      }, { status: 409 });
    }

    if (force && prodCount > 0) {
      // Reassign to another default category or delete products
      await query('DELETE FROM products WHERE category_id = $1', [id]);
    }

    const delRes = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (delRes.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
