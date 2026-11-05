import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p>Use ChatPop respectfully and follow all local laws and community safety guidelines.</p>
      </main>
    </div>
  );
}
