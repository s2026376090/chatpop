import { SiteHeader } from "@/components/site-header";

export default function SafetyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-3xl font-semibold">Safety Guidelines</h1>
        <p>Report abuse, block disruptive users, and avoid sharing personal data publicly.</p>
      </main>
    </div>
  );
}
