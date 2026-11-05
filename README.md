# ChatPop

ChatPop is a modern anonymous global chat platform built with Next.js App Router + Supabase.

## Features

- Anonymous guest onboarding (username only, no traditional account for chat users)
- Username validation (3-20 chars, letters/numbers/underscore, reserved-name protection)
- Room discovery by category with search, filtering, sorting, and room cards
- Real-time-ready room chat architecture with persisted messages
- Presence/activity stats API
- Legal/safety public pages
- Secure admin entry point (separate admin login)
- Supabase SQL migrations and seed data
- SEO metadata, robots, and sitemap

## Tech Stack

- Next.js 16 (App Router), TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Realtime-ready data model)
- Zod validation
- Zustand state
- Lucide icons

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure env vars:

```bash
cp .env.example .env.local
```

3. Fill Supabase keys and admin credentials in `.env.local`.

4. Apply schema and seed in Supabase SQL editor:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/seed.sql`

5. Start dev server:

```bash
npm run dev
```

## Core User Journey

Open website → Enter username → Explore rooms → Join room → Chat.

## Admin Dashboard

- Visit `/admin/login`
- Sign in with `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- Dashboard available at `/admin`

## Security Notes

- Guest session cookie is HTTP-only
- Username is display-only and validated server-side
- Reserved role/system names are blocked
- Do not expose Supabase service role key to the client

## Testing and Verification

Run checks:

```bash
npm run lint
npm run build
```

Manual verification recommendation:

- Open two browser sessions/incognito windows
- Create different guest usernames
- Join the same room
- Send messages and confirm cross-session message visibility

## Deployment

Deploy on Vercel:

1. Import repository in Vercel
2. Add env vars from `.env.example`
3. Deploy

Ensure Supabase project/network policies permit production traffic.
