import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  return createClient(env.supabaseUrl, env.supabaseServiceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getSupabaseBrowserClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;
  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}
