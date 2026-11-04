import { NextResponse, type NextRequest } from 'next/server';
import { TenantResolutionError } from '@/lib/errors';

const TENANT_SLUG = /^[a-z0-9-]+$/;

export function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2] ?? '';
  if (!TENANT_SLUG.test(slug)) {
    throw new TenantResolutionError(`Tenant slug is not valid: ${slug} (TN09)`);
  }
  const response = NextResponse.next();
  response.headers.set('x-tenant', slug);
  return response;
}

export const config = { matcher: '/portal/:path*' };
