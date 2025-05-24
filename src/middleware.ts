import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value || '';

  // Routes that require authentication
  const protectedRoutes = ['/', '/profile'];
  // Routes that should not be accessed when logged in
  const authRoutes = ['/signin', '/signup'];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if current route is auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is logged in and tries to access auth route, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and tries to access protected route, redirect to signin
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow the request to continue
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