import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Dummy validasi (ganti ini nanti kalo udah connect DB)
    if (email === "" && password === "") {
      return NextResponse.json({ message: "Login berhasil!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
