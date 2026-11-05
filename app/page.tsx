import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { UsernameForm } from "@/components/username-form";
import { CATEGORIES } from "@/lib/constants";
import { getStats, listRooms } from "@/lib/server-data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function HomePage() {
  const [stats, rooms] = await Promise.all([getStats(), listRooms({ sort: "popular" })]);
  const trending = rooms.slice(0, 6);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-14 px-4 py-10">
        {!isSupabaseConfigured ? (
          <p className="rounded-xl border border-amber-400/40 bg-amber-100 px-4 py-3 text-sm text-amber-900 dark:bg-amber-600/20 dark:text-amber-200">
            Supabase is not configured yet. The UI is functional, but live production data/realtime requires environment setup.
          </p>
        ) : null}

        <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-indigo-500">Global Anonymous Chat</p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Meet the World. One Conversation at a Time.
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
              Join thousands of people around the world. Discover communities, meet new people, and start conversations
              instantly. No account required.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat label="Online users" value={String(stats.onlineUsers)} />
              <Stat label="Active rooms" value={String(stats.totalRooms)} />
              <Stat label="Community activity" value={stats.activity} />
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <UsernameForm />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Popular Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CATEGORIES.map((category) => (
              <article key={category.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{category.name}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{category.description}</p>
                <Link href={`/rooms?category=${category.slug}`} className="mt-4 inline-flex text-sm text-indigo-600 hover:text-indigo-500">
                  Join
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Trending Rooms</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((room) => (
              <article key={room.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-wide text-zinc-500">{room.categorySlug.replace(/-/g, " ")}</p>
                <h3 className="mt-2 text-lg font-semibold">{room.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{room.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                  <span>{room.onlineUsers} online</span>
                  <Link href={`/chat/${room.slug}`} className="text-indigo-600 hover:text-indigo-500">
                    Join Room
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "No registration required",
            "Meet people worldwide",
            "Real-time messaging",
            "Interest-based communities",
            "Free to use",
            "Privacy-focused sessions",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              {item}
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>Choose a username.</li>
            <li>Find your community.</li>
            <li>Start chatting instantly.</li>
          </ol>
        </section>
      </main>
      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-4 px-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/about">About Us</Link>
          <Link href="/guidelines">Community Guidelines</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/safety">Safety Center</Link>
          <Link href="/contact">Contact Us</Link>
          <p className="ml-auto">© 2026 ChatPop</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">{value}</p>
    </div>
  );
}
