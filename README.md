# Pickleball Court Booking

A mobile-first Next.js app scaffold for a centralized pickleball court booking and management platform.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client setup

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values when you are ready to connect real data.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local` or real Supabase keys.

## Current Scope

This is the initial app structure only. Supabase queries, payments, and maps are intentionally not implemented yet.
