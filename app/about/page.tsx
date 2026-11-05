import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <h1 className="text-3xl font-semibold">About ChatPop</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          ChatPop is a global, privacy-conscious chat platform focused on simple anonymous onboarding and meaningful
          real-time community conversations.
        </p>
      </main>
    </div>
  );
}
