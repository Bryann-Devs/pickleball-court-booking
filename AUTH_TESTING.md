# Auth Testing Checklist

Use this checklist to verify Supabase authentication locally without committing secrets.

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Bryann-Devs/pickleball-court-booking.git
cd pickleball-court-booking
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from `.env.example` and add your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not commit `.env.local`.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Manual Auth Checks

1. Go to `/register` and create a test player account.
2. Go to `/register` and create a test court owner account.
3. In Supabase, open Table Editor, then check the `profiles` table.
4. Confirm each new profile was created by the auth trigger.
5. Confirm profile metadata is present as expected:
   - `full_name`
   - `phone`
   - `role`
6. Log in as the player account and confirm it redirects to `/courts`.
7. Log in as the court owner account and confirm it redirects to `/owner/dashboard`.
8. Log in as an admin account, if one already exists, and confirm it redirects to `/admin/dashboard`.
9. While logged out, visit `/bookings`, `/owner/dashboard`, or `/admin/dashboard` and confirm the app redirects to `/login`.
10. Log in, use the navbar logout button, and confirm it redirects to `/login`.
