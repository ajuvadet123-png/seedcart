import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfwnycshxwingwqeljfg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_UfqXShZKLP9y0n5c_u1hgw__75T0RIA';

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try uploading to Supabase Storage
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filename, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl
        });
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload failed, falling back to data URL', storageErr);
    }

    // Fallback: return data URL if bucket permissions are not yet configured
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
