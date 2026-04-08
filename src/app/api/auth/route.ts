import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "dm23ifms@2024";

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAdminToken();
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
