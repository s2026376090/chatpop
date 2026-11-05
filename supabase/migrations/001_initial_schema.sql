create extension if not exists "pgcrypto";

create table if not exists admin_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role_id uuid not null references admin_roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text not null,
  icon text not null,
  color text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  category_slug text not null,
  slug text not null unique,
  name text not null,
  description text not null,
  featured boolean not null default false,
  is_enabled boolean not null default true,
  capacity int not null default 250,
  online_users int not null default 0,
  activity_score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists guest_sessions (
  id uuid primary key,
  username text not null,
  avatar_seed text not null,
  country text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 day')
);

create table if not exists guest_profiles (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid not null unique references guest_sessions(id) on delete cascade,
  bio text,
  notifications_muted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  room_slug text not null,
  guest_session_id uuid not null references guest_sessions(id) on delete cascade,
  status text not null default 'online',
  joined_at timestamptz not null default now(),
  heartbeat_at timestamptz not null default now(),
  left_at timestamptz,
  unique (room_slug, guest_session_id)
);

create table if not exists messages (
  id uuid primary key,
  room_id uuid references rooms(id),
  room_slug text not null,
  guest_session_id uuid references guest_sessions(id),
  username text not null,
  avatar_seed text not null,
  content text not null,
  is_system boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  guest_session_id uuid not null references guest_sessions(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (message_id, guest_session_id, emoji)
);

create table if not exists message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  reporter_guest_session_id uuid not null references guest_sessions(id),
  reason text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_guest_session_id uuid not null references guest_sessions(id),
  blocked_guest_session_id uuid not null references guest_sessions(id),
  created_at timestamptz not null default now(),
  unique (blocker_guest_session_id, blocked_guest_session_id)
);

create table if not exists user_mutes (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid not null references guest_sessions(id),
  target_guest_session_id uuid references guest_sessions(id),
  room_slug text,
  reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists moderation_actions (
  id uuid primary key default gen_random_uuid(),
  actor_admin_user_id uuid references admin_users(id),
  target_guest_session_id uuid references guest_sessions(id),
  action text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists room_announcements (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  room_slug text not null,
  content text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_rooms_category_slug on rooms(category_slug) where deleted_at is null;
create index if not exists idx_rooms_activity_score on rooms(activity_score desc);
create index if not exists idx_messages_room_slug_created_at on messages(room_slug, created_at);
create index if not exists idx_messages_guest_session_id on messages(guest_session_id);
create index if not exists idx_room_members_room_slug_status on room_members(room_slug, status, heartbeat_at);
create index if not exists idx_guest_sessions_last_seen on guest_sessions(last_seen_at);
create index if not exists idx_message_reports_status on message_reports(status, created_at);

alter table categories enable row level security;
alter table rooms enable row level security;
alter table guest_sessions enable row level security;
alter table room_members enable row level security;
alter table messages enable row level security;
alter table message_reactions enable row level security;
alter table message_reports enable row level security;
alter table user_blocks enable row level security;
alter table user_mutes enable row level security;
alter table moderation_actions enable row level security;
alter table room_announcements enable row level security;
alter table site_settings enable row level security;

create policy if not exists "public read categories" on categories for select using (is_enabled and deleted_at is null);
create policy if not exists "public read rooms" on rooms for select using (is_enabled and deleted_at is null);
create policy if not exists "public read messages" on messages for select using (is_deleted = false);
create policy if not exists "service role manage all" on categories for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage rooms" on rooms for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage sessions" on guest_sessions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage room members" on room_members for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage messages" on messages for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage message_reactions" on message_reactions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage message_reports" on message_reports for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage user_blocks" on user_blocks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage user_mutes" on user_mutes for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage moderation_actions" on moderation_actions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage room_announcements" on room_announcements for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy if not exists "service role manage site_settings" on site_settings for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
