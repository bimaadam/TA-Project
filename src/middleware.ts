import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  console.log('[MIDDLEWARE]', { hostname, pathname, token });

  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocalhost) {
    console.log('[MIDDLEWARE] Skip auth: localhost detected');
    return NextResponse.next();
  }

  const protectedRoutes = ['/'];
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    console.log('[MIDDLEWARE] Redirect to signin');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home/:path*'],
};
