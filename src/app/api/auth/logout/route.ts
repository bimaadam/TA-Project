import { NextResponse } from "next/server";

export async function POST() {
  // Clear cookie token (set expired date)
  const response = NextResponse.json({ message: "Berhasil logout" });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // langsung expired
  });

  return response;
}
