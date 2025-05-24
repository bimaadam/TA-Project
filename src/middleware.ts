// middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
  // Middleware di server GAK BISA akses localStorage, jadi lewatin aja
  // Biarkan frontend handle via useEffect()

  return NextResponse.next(); // allow semua route, karena proteksi di frontend
}

export const config = {
  matcher: ['/'], // cuma root yang di-match
};
