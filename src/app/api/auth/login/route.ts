import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import Jwt from "jsonwebtoken"

// SECRET KEY lu (jangan hardcode di production)
const SECRET_KEY = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const token = Jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ message: "Login sukses" });

  // Simpan token di cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 hari
  });

  return response;
}
