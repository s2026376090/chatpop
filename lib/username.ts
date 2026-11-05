import { RESERVED_USERNAMES } from "@/lib/constants";
import { usernameSchema } from "@/lib/types";

const ADJECTIVES = ["Curious", "Friendly", "Bold", "Bright", "Calm", "Swift", "Kind"];
const NOUNS = ["Explorer", "Voyager", "Coder", "Nomad", "Connector", "Speaker", "Thinker"];

export function sanitizeUsername(input: string) {
  return input.trim();
}

export function validateUsername(input: string) {
  const username = sanitizeUsername(input);
  const result = usernameSchema.safeParse(username);
  if (!result.success) {
    return { valid: false as const, error: result.error.issues[0]?.message ?? "Invalid username" };
  }

  if (RESERVED_USERNAMES.has(username.toLowerCase())) {
    return { valid: false as const, error: "This username is reserved" };
  }

  return { valid: true as const, username };
}

export function suggestUsername() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${adjective}${noun}_${suffix}`;
}
