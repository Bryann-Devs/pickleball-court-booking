# Development Admin Setup

Use this only for local development or a trusted test project. Do not add public admin signup.

1. Register normally through the app using `/register`.
2. Open your Supabase project.
3. Go to Table Editor, then open the `profiles` table.
4. Change that user's `role` to `admin`.

You can also run this SQL in the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'YOUR_ADMIN_EMAIL_HERE'
);
```
