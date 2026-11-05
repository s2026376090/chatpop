"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Room } from "@/lib/types";

type Props = {
  rooms: Room[];
  categories: Category[];
};

export function RoomSearch({ rooms, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"popular" | "active" | "new" | "alphabetical">("popular");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rooms.filter((room) =>
      q ? [room.name, room.description, room.categorySlug].some((value) => value.toLowerCase().includes(q)) : true,
    );

    if (category !== "all") {
      list = list.filter((room) => room.categorySlug === category);
    }

    if (sort === "alphabetical") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "active") return [...list].sort((a, b) => b.activityScore - a.activityScore);
    if (sort === "new") return [...list].reverse();
    return [...list].sort((a, b) => b.onlineUsers - a.onlineUsers);
  }, [rooms, search, category, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="Search by room, category, keyword"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="popular">Most Popular</option>
          <option value="active">Most Active</option>
          <option value="new">Recently Created</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((room) => (
          <article key={room.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{room.categorySlug.replace(/-/g, " ")}</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{room.name}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{room.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span>{room.onlineUsers} online</span>
              <span>Activity {room.activityScore}</span>
            </div>
            <Link
              href={`/chat/${room.slug}`}
              className="mt-4 inline-flex rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Join Room
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
