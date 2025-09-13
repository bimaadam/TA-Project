import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/signin", "/signup", "/reset-pwd"];

  // kalau belum login & bukan halaman publik → tendang ke signin
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // kalau udah login tapi masih buka halaman publik → lempar ke /
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
