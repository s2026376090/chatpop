import { RoomSearch } from "@/components/room-search";
import { SiteHeader } from "@/components/site-header";
import { listCategories, listRooms } from "@/lib/server-data";

export default async function RoomsPage() {
  const [rooms, categories] = await Promise.all([listRooms({ sort: "popular" }), listCategories()]);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8">
        <h1 className="text-3xl font-semibold">Room Discovery</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Search, filter, and join active communities.</p>
        <RoomSearch rooms={rooms} categories={categories} />
      </main>
    </div>
  );
}
