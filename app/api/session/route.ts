import { NextResponse } from "next/server";
import { createGuestSession } from "@/lib/server-data";
import { suggestUsername } from "@/lib/username";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { username?: string; country?: string | null };
    if (!payload.username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const session = await createGuestSession(payload.username, payload.country ?? null);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create guest session",
        suggestion: suggestUsername(),
      },
      { status: 400 },
    );
  }
}
