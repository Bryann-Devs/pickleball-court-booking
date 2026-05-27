-- Courts RLS and permissions for owner submissions and admin approval.
-- Run this in the Supabase SQL editor.

alter table public.courts enable row level security;

alter table public.courts
  alter column status set default 'pending';

grant select on public.courts to anon;
grant select, insert, update on public.courts to authenticated;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.prevent_owner_court_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.owner_id
    and public.current_user_role() <> 'admin'
    and new.status is distinct from old.status
  then
    raise exception 'Court owners cannot change court status';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_owner_court_status_change on public.courts;

create trigger prevent_owner_court_status_change
before update on public.courts
for each row
execute function public.prevent_owner_court_status_change();

drop policy if exists "Public can view approved courts" on public.courts;
drop policy if exists "Court owners can view own courts" on public.courts;
drop policy if exists "Court owners can create pending courts" on public.courts;
drop policy if exists "Court owners can update own court details" on public.courts;
drop policy if exists "Admins can view all courts" on public.courts;
drop policy if exists "Admins can update court status" on public.courts;

create policy "Public can view approved courts"
on public.courts
for select
to anon, authenticated
using (status = 'approved');

create policy "Court owners can view own courts"
on public.courts
for select
to authenticated
using (
  owner_id = auth.uid()
  and public.current_user_role() = 'court_owner'
);

create policy "Court owners can create pending courts"
on public.courts
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and status = 'pending'
  and public.current_user_role() = 'court_owner'
);

create policy "Court owners can update own court details"
on public.courts
for update
to authenticated
using (
  owner_id = auth.uid()
  and public.current_user_role() = 'court_owner'
)
with check (
  owner_id = auth.uid()
  and public.current_user_role() = 'court_owner'
);

create policy "Admins can view all courts"
on public.courts
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "Admins can update court status"
on public.courts
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
