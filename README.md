# SermonFlow (MVP)

SermonFlow is an AI-powered YouTube sermon script builder for Christian creators.

## Stack

- Next.js 14 (App Router)
- TailwindCSS
- OpenAI API (`gpt-4o` or `gpt-4.1`)
- Supabase (magic link auth + persistence)
- Stripe Checkout subscriptions
- Vercel deployment target

## Core flow

Landing page → Email magic link login → Input sermon topic + params → Generate script → Show output → Upgrade to Pro.

## Output format

- Hook (30 sec opening)
- Scripture Context
- Point 1 (Explanation + Illustration)
- Point 2 (Explanation + Illustration)
- Point 3 (Explanation + Illustration)
- Practical Application
- Closing Prayer
- YouTube Titles (3)
- SEO Keywords (10)

## Setup

1. Install deps:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Run dev server:

```bash
npm run dev
```

## Suggested Supabase tables

```sql
create table users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz default now()
);

create table generations (
  id bigint generated always as identity primary key,
  user_id uuid references users(id),
  topic text not null,
  scripture text,
  video_length int not null,
  tone text not null,
  output jsonb not null,
  created_at timestamptz default now()
);

create table subscription_status (
  user_id uuid primary key references users(id),
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz default now()
);
```
