import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const COOKIE_NAME = "chatpop_admin";

export async function POST(request: Request) {
  const payload = (await request.json()) as { email?: string; password?: string };

  if (!env.adminEmail || !env.adminPassword) {
    return NextResponse.json({ error: "Admin credentials are not configured" }, { status: 503 });
  }

  if (payload.email !== env.adminEmail || payload.password !== env.adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  (await cookies()).set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ success: true });
}
