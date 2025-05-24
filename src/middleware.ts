import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Get accessToken from header instead of cookie
  const token = request.headers.get('accessToken');
  const isProtectedRoute = ['/', '/profile', '/dashboard'].some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = ['/signin', '/signup'].includes(pathname);

  // Kalo lagi login terus coba ke /signin /signup, tendang balik ke /
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Kalo belum login dan akses route yang butuh login, tendang ke /signin
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/dashboard/:path*',
    '/profile/:path*'
  ],
};
