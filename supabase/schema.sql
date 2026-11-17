create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text not null check (char_length(body) between 1 and 280),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Posts are publicly readable" on public.posts;
create policy "Posts are publicly readable"
on public.posts for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can create a post" on public.posts;
create policy "Anyone can create a post"
on public.posts for insert
to anon, authenticated
with check (char_length(trim(body)) between 1 and 280);

do $$
begin
  alter publication supabase_realtime add table public.posts;
exception
  when duplicate_object then null;
end $$;
