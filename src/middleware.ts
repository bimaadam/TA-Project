import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar halaman yang butuh login
const protectedRoutes = ["/", "/profile"];

// Daftar halaman yang gak boleh diakses kalau udah login
const authPages = ["/signin", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // INI harus di dalam function
  const { pathname } = req.nextUrl;

  // Kalau belum login dan akses protected routes
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Kalau udah login dan akses halaman auth
  if (authPages.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Lanjutkan kalau semua aman
  return NextResponse.next();
}
