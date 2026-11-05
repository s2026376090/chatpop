import { SiteHeader } from "@/components/site-header";

export default function GuidelinesPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-3xl font-semibold">Community Guidelines</h1>
        <p>Be respectful, avoid harassment, and never share private or sensitive personal information in public chat.</p>
      </main>
    </div>
  );
}
