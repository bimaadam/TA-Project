import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path sesuai projek kamu
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Cek input kosong
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    // Bandingkan password dengan hashed password di DB
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // Login berhasil (bisa lanjut generate JWT atau set cookie di sini)
    return NextResponse.json(
      { message: "Login berhasil", user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
