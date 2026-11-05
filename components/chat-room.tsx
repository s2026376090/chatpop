"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message, Room } from "@/lib/types";
import { avatarFromSeed } from "@/lib/avatar";

type Props = {
  room: Room;
  initialMessages: Message[];
};

export function ChatRoom({ room, initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const refreshMessages = useCallback(async () => {
    const response = await fetch(`/api/rooms/${room.slug}/messages`);
    const json = (await response.json()) as { messages?: Message[] };
    if (response.ok && json.messages) {
      setMessages(json.messages);
    }
  }, [room.slug]);

  useEffect(() => {
    const timer = setInterval(() => {
      void refreshMessages();
    }, 3000);

    return () => clearInterval(timer);
  }, [refreshMessages]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch(`/api/rooms/${room.slug}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const json = (await response.json()) as { error?: string; message?: Message };
    if (!response.ok) {
      setError(json.error ?? "Message not sent");
      return;
    }

    setContent("");
    setMessages((prev) => [...prev, json.message!]);
  }

  const charCount = useMemo(() => content.length, [content]);

  return (
    <section className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
      <aside className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">Categories</h2>
        <p className="mt-2 text-sm text-zinc-500">{room.categorySlug.replace(/-/g, " ")}</p>
      </aside>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-4 border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{room.name}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{room.description}</p>
        </header>

        <div className="h-[50vh] space-y-3 overflow-y-auto pb-3">
          {messages.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((message) => (
              <article key={message.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-1 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarFromSeed(message.avatarSeed)}
                    alt={message.username}
                    className="h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-700"
                  />
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{message.username}</p>
                  <time className="text-xs text-zinc-500">{new Date(message.createdAt).toLocaleTimeString()}</time>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{message.content}</p>
              </article>
            ))
          )}
        </div>

        <form onSubmit={submit} className="mt-3 space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            maxLength={800}
            required
            className="h-24 w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="Type your message"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{charCount}/800</span>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Send</button>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </form>
      </div>

      <aside className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Room info</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Online members: {room.onlineUsers}</li>
          <li>Capacity: {room.capacity}</li>
          <li>Room slug: {room.slug}</li>
        </ul>
      </aside>
    </section>
  );
}
