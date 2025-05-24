import router from 'next/router';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useEffect } from 'react';

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) router.push("/signin");
}, []);


export function middleware(req: NextRequest) {
  const token = req.cookies.get('session_token');

  const protectedPaths = ['/', '/dashboard'];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
