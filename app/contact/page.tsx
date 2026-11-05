import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-3xl font-semibold">Contact Us</h1>
        <p>For support and safety escalations, contact support@chatpop.example.</p>
      </main>
    </div>
  );
}
