import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatPop | Global Anonymous Chat Rooms",
  description:
    "Meet the world in real-time chat rooms. Choose a username, pick a room, and start chatting instantly.",
  openGraph: {
    title: "ChatPop",
    description: "Global anonymous chat rooms with real-time conversations.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">{children}</body>
    </html>
  );
}
