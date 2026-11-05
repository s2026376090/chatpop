export const instant = false;

import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat-room";
import { SiteHeader } from "@/components/site-header";
import { getRoomBySlug, listMessages } from "@/lib/server-data";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  const messages = await listMessages(slug);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <ChatRoom room={room} initialMessages={messages} />
      </main>
    </div>
  );
}
