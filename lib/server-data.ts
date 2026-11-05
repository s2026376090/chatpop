import crypto from "node:crypto";
import { cookies } from "next/headers";
import { CATEGORIES, ROOMS } from "@/lib/constants";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { GuestSession, Message, Room } from "@/lib/types";
import { validateUsername } from "@/lib/username";

const SESSION_COOKIE = "chatpop_guest";
const FALLBACK_MESSAGES = new Map<string, Message[]>();
const FALLBACK_SESSIONS = new Map<string, GuestSession>();

function sessionAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}`;
}

export function avatarFromSeed(seed: string) {
  return sessionAvatar(seed);
}

export async function getStats() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      totalRooms: ROOMS.length,
      onlineUsers: 0,
      activity: "Connect Supabase to enable live community activity",
    };
  }

  const [roomRes, membersRes] = await Promise.all([
    supabase.from("rooms").select("id", { count: "exact", head: true }).eq("is_enabled", true),
    supabase
      .from("room_members")
      .select("id", { count: "exact", head: true })
      .eq("status", "online")
      .gte("heartbeat_at", new Date(Date.now() - 60_000).toISOString()),
  ]);

  return {
    totalRooms: roomRes.count ?? 0,
    onlineUsers: membersRes.count ?? 0,
    activity: "Live activity is based on room membership heartbeat",
  };
}

export async function listCategories() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return CATEGORIES;

  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, description, icon, color")
    .eq("is_enabled", true)
    .order("name");

  return data ?? CATEGORIES;
}

export async function listRooms(params?: {
  search?: string;
  category?: string;
  sort?: "popular" | "active" | "new" | "alphabetical";
}) {
  const supabase = getSupabaseServerClient();
  const sort = params?.sort ?? "popular";
  const search = params?.search?.trim().toLowerCase();
  const category = params?.category;

  if (!supabase) {
    let rooms = [...ROOMS];
    if (search) {
      rooms = rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(search) ||
          room.description.toLowerCase().includes(search) ||
          room.categorySlug.toLowerCase().includes(search),
      );
    }

    if (category) rooms = rooms.filter((room) => room.categorySlug === category);
    return sortRooms(rooms, sort);
  }

  let query = supabase
    .from("rooms")
    .select("id, slug, name, description, category_slug, featured, capacity, online_users, activity_score, created_at")
    .eq("is_enabled", true);

  if (category) query = query.eq("category_slug", category);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

  const { data } = await query.limit(200);

  const rooms: Room[] = (data ?? []).map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    categorySlug: room.category_slug,
    featured: room.featured,
    capacity: room.capacity,
    onlineUsers: room.online_users ?? 0,
    activityScore: room.activity_score ?? 0,
  }));

  return sortRooms(rooms, sort);
}

function sortRooms(rooms: Room[], sort: "popular" | "active" | "new" | "alphabetical") {
  const sorted = [...rooms];

  if (sort === "alphabetical") return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "active") return sorted.sort((a, b) => b.activityScore - a.activityScore);
  if (sort === "new") return sorted.reverse();
  return sorted.sort((a, b) => b.onlineUsers - a.onlineUsers);
}

export async function getRoomBySlug(slug: string) {
  const rooms = await listRooms();
  return rooms.find((room) => room.slug === slug) ?? null;
}

export async function createGuestSession(usernameInput: string, country: string | null = null) {
  const validation = validateUsername(usernameInput);
  if (!validation.valid) throw new Error(validation.error);

  const session: GuestSession = {
    id: crypto.randomUUID(),
    username: validation.username,
    avatarSeed: validation.username,
    country,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from("guest_sessions").insert({
      id: session.id,
      username: session.username,
      avatar_seed: session.avatarSeed,
      country: session.country,
      is_active: true,
      last_seen_at: session.createdAt,
    });
  } else {
    FALLBACK_SESSIONS.set(session.id, session);
  }

  (await cookies()).set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return session;
}

export async function getCurrentGuest() {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase
      .from("guest_sessions")
      .select("id, username, avatar_seed, country, created_at")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      avatarSeed: data.avatar_seed,
      country: data.country,
      createdAt: data.created_at,
    } satisfies GuestSession;
  }

  return FALLBACK_SESSIONS.get(id) ?? null;
}

export async function listMessages(roomSlug: string, limit = 50) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return (FALLBACK_MESSAGES.get(roomSlug) ?? []).slice(-limit);
  }

  const { data } = await supabase
    .from("messages")
    .select("id, room_slug, username, avatar_seed, content, created_at, is_system")
    .eq("room_slug", roomSlug)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .map((message) => ({
      id: message.id,
      roomSlug: message.room_slug,
      username: message.username,
      avatarSeed: message.avatar_seed,
      content: message.content,
      createdAt: message.created_at,
      isSystem: message.is_system,
    }))
    .reverse();
}

export async function sendMessage(roomSlug: string, content: string) {
  const guest = await getCurrentGuest();
  if (!guest) throw new Error("Create a guest session before sending messages");

  const text = content.trim();
  if (!text) throw new Error("Message cannot be empty");
  if (text.length > 800) throw new Error("Message is too long");

  const message: Message = {
    id: crypto.randomUUID(),
    roomSlug,
    username: guest.username,
    avatarSeed: guest.avatarSeed,
    content: text,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from("messages").insert({
      id: message.id,
      room_slug: message.roomSlug,
      guest_session_id: guest.id,
      username: message.username,
      avatar_seed: message.avatarSeed,
      content: message.content,
      is_system: false,
      is_deleted: false,
    });
  } else {
    const list = FALLBACK_MESSAGES.get(roomSlug) ?? [];
    list.push(message);
    FALLBACK_MESSAGES.set(roomSlug, list);
  }

  return message;
}
