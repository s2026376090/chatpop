import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or less")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed");

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  featured: boolean;
  capacity: number;
  onlineUsers: number;
  activityScore: number;
};

export type Message = {
  id: string;
  roomSlug: string;
  username: string;
  avatarSeed: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
};

export type GuestSession = {
  id: string;
  username: string;
  avatarSeed: string;
  country: string | null;
  createdAt: string;
};
