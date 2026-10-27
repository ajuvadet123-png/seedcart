import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPhone, createAdminToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const isValid = validateAdminPhone(phone);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized: Phone number not recognized as admin.' },
        { status: 401 }
      );
    }

    const token = createAdminToken(phone);
    const response = NextResponse.json({
      success: true,
      message: 'Admin authorization successful'
    });

    // Set secure HttpOnly cookie
    response.cookies.set('seedcart_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
