import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Buat ngehash password
import { prisma } from "@/lib/prisma"; // Misal lu pake Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fname, lname, email, password } = body;

    if (!email || !password || !fname || !lname) {
      return NextResponse.json({ error: "Data kurang lengkap" }, { status: 400 });
    }

    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return NextResponse.json({ error: "Email udah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User berhasil register" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal register" }, { status: 500 });
  }
}
