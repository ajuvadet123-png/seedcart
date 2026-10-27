import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '../../../../lib/auth';
import { query } from '../../../../lib/db';
import { getStoreSettings } from '../../../../lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      store_name,
      store_tagline,
      store_description,
      logo_url,
      contact_whatsapp_number,
      contact_email,
      contact_phone,
      contact_address,
      currency,
      currency_symbol,
      hero_title,
      hero_subtitle,
      hero_image_url
    } = body;

    const existing = await query('SELECT id FROM store_settings LIMIT 1');
    if (existing.rows.length === 0) {
      await query(`
        INSERT INTO store_settings (
          store_name, store_tagline, store_description, logo_url,
          contact_whatsapp_number, contact_email, contact_phone, contact_address,
          currency, currency_symbol, hero_title, hero_subtitle, hero_image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        store_name, store_tagline, store_description, logo_url,
        contact_whatsapp_number, contact_email, contact_phone, contact_address,
        currency || 'INR', currency_symbol || '₹', hero_title, hero_subtitle, hero_image_url
      ]);
    } else {
      await query(`
        UPDATE store_settings SET
          store_name = $1,
          store_tagline = $2,
          store_description = $3,
          logo_url = $4,
          contact_whatsapp_number = $5,
          contact_email = $6,
          contact_phone = $7,
          contact_address = $8,
          currency = $9,
          currency_symbol = $10,
          hero_title = $11,
          hero_subtitle = $12,
          hero_image_url = $13,
          updated_at = now()
        WHERE id = $14
      `, [
        store_name, store_tagline, store_description, logo_url,
        contact_whatsapp_number, contact_email, contact_phone, contact_address,
        currency || 'INR', currency_symbol || '₹', hero_title, hero_subtitle, hero_image_url,
        existing.rows[0].id
      ]);
    }

    const updated = await getStoreSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
