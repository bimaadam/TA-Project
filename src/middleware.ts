// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware tidak bisa akses localStorage langsung
  // Kita akan menggunakan cookie sebagai alternatif
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Daftar route yang diproteksi
  const protectedRoutes = ['/'];

  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/home/:path*'],
};
