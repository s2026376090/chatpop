export const instant = false;

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listRooms } from "@/lib/server-data";

export default async function AdminDashboardPage() {
  const cookie = (await cookies()).get("chatpop_admin")?.value;
  if (cookie !== "authenticated") {
    redirect("/admin/login");
  }

  const rooms = await listRooms({ sort: "popular" });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Moderation, category, room, and analytics controls.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Active rooms" value={String(rooms.length)} />
        <Card title="Online users" value={String(rooms.reduce((acc, room) => acc + room.onlineUsers, 0))} />
        <Card title="Featured rooms" value={String(rooms.filter((room) => room.featured).length)} />
        <Card title="Pending reports" value="0" />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold">Room management</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Use Supabase-backed APIs for CRUD and moderation actions.</p>
        <Link href="/rooms" className="mt-3 inline-flex text-sm text-indigo-600 hover:text-indigo-500">
          Open discovery page
        </Link>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
