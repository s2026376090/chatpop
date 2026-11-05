import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p>ChatPop uses guest sessions instead of traditional accounts for chat participation.</p>
        <p>We store session and moderation data for abuse prevention, safety reporting, and service operations.</p>
      </main>
    </div>
  );
}
