import { NextResponse } from "next/server";
import { listMessages, sendMessage } from "@/lib/server-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const messages = await listMessages(slug);
  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const payload = (await request.json()) as { content?: string };
    if (!payload.content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const message = await sendMessage(slug, payload.content);
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not send message" },
      { status: 400 },
    );
  }
}
