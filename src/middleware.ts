import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // belum login → tendang ke /signin
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // udah login tapi buka signin → lempar ke /
  if (token && pathname === '/signin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/home/:path*',  // all pages under /home
    '/signin',       // signin page
    '/signup',       // signup page
    '/reset-pwd',    // reset password page
    '/'              // root path
  ],
}
