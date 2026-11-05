"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setStoredUsername = useSessionStore((state) => state.setUsername);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuggestion("");

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const json = (await response.json()) as { error?: string; suggestion?: string; session?: { username: string } };
    setIsLoading(false);

    if (!response.ok) {
      setError(json.error ?? "Could not create session");
      setSuggestion(json.suggestion ?? "");
      return;
    }

    setStoredUsername(json.session?.username ?? username);
    router.push("/rooms");
  }

  return (
    <form onSubmit={submit} className="w-full space-y-3">
      <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Choose a username
      </label>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="e.g. GlobalTraveler"
          className="h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-zinc-900 outline-none ring-indigo-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          minLength={3}
          maxLength={20}
          pattern="[A-Za-z0-9_]+"
          required
        />
        <button
          disabled={isLoading}
          className="h-11 rounded-xl bg-indigo-600 px-6 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
        >
          {isLoading ? "Joining..." : "Start Chatting"}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {suggestion ? (
        <button
          type="button"
          onClick={() => setUsername(suggestion)}
          className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
        >
          Use suggestion: {suggestion}
        </button>
      ) : null}
    </form>
  );
}
