import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-indigo-600 dark:text-indigo-300">
          ChatPop
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-zinc-700 md:flex dark:text-zinc-200">
          <Link href="/">Home</Link>
          <Link href="/rooms">Explore Rooms</Link>
          <Link href="/rooms?sort=popular">Popular Rooms</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/rooms"
            className="rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Join Chat
          </Link>
        </div>
      </div>
    </header>
  );
}
