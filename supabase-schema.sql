create table if not exists public.blog_posts (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null default 'General',
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.routine_posts (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
alter table public.routine_posts enable row level security;

create policy "Public can read blog posts"
on public.blog_posts
for select
to anon, authenticated
using (true);

create policy "Authenticated users can manage blog posts"
on public.blog_posts
for all
to authenticated
using (true)
with check (true);

create policy "Public can read routine posts"
on public.routine_posts
for select
to anon, authenticated
using (true);

create policy "Authenticated users can manage routine posts"
on public.routine_posts
for all
to authenticated
using (true)
with check (true);
