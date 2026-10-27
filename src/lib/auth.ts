import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'seedcart-admin-secret-2025-token-auth';
const ADMIN_PHONE = (process.env.ADMIN_PHONE || '9744744960').replace(/\D/g, '');

export interface AdminPayload {
  phone: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function validateAdminPhone(inputPhone: string): boolean {
  if (!inputPhone) return false;
  const cleaned = inputPhone.replace(/\D/g, '');
  // Match either standard 10-digit number or with 91 prefix
  return cleaned === ADMIN_PHONE || cleaned === `91${ADMIN_PHONE}`;
}

export function createAdminToken(phone: string): string {
  return jwt.sign(
    { phone, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload;
    if (payload && payload.role === 'admin' && validateAdminPhone(payload.phone)) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('seedcart_admin_token')?.value;
  if (!token) return false;
  const payload = verifyAdminToken(token);
  return !!payload;
}

export function checkAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get('seedcart_admin_token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return false;
  return !!verifyAdminToken(token);
}
