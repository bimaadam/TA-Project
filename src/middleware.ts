import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next(); // Biarkan frontend handle auth
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
