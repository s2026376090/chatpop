import { NextResponse } from "next/server";
import { listRooms } from "@/lib/server-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") ?? "popular") as "popular" | "active" | "new" | "alphabetical";

  const rooms = await listRooms({ search, category, sort });
  return NextResponse.json({ rooms });
}
