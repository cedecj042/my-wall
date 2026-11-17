# My Wall

A nostalgic Facebook-style public wall built with Next.js, React, Tailwind CSS, and Supabase. Visitors can publish messages up to 280 characters, see the newest posts first, and receive new posts in real time.

## Setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. The script creates the table, public read/insert policies, and enables Realtime.
3. Add these variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

4. Start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run build
```

## Deploy

Deploy to Vercel and add the same two public Supabase variables to the Vercel project for Production, Preview, and Development environments.
