-- MusicHub schema. Run this once in the Supabase SQL editor.
-- (Dashboard -> SQL Editor -> New query -> paste -> Run.)

-- Posts ---------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text,
  image_url   text,
  upvotes     int  not null default 0,
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Anyone can read posts.
drop policy if exists "posts read"  on public.posts;
create policy "posts read"   on public.posts for select using (true);

-- Anyone (incl. anon) can create posts during the dev phase.
-- Tightened after auth ships in the next commit.
drop policy if exists "posts insert" on public.posts;
create policy "posts insert" on public.posts for insert with check (true);

-- Anyone can update / delete during the dev phase.
drop policy if exists "posts update" on public.posts;
create policy "posts update" on public.posts for update using (true);

drop policy if exists "posts delete" on public.posts;
create policy "posts delete" on public.posts for delete using (true);


-- Comments ------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  body        text not null,
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.comments enable row level security;

drop policy if exists "comments read" on public.comments;
create policy "comments read"  on public.comments for select using (true);

drop policy if exists "comments insert" on public.comments;
create policy "comments insert" on public.comments for insert with check (true);

drop policy if exists "comments delete" on public.comments;
create policy "comments delete" on public.comments for delete using (true);


-- Atomic upvote helper ------------------------------------------------
create or replace function public.upvote_post(post_id uuid)
returns int
language sql
security definer
as $$
  update public.posts
     set upvotes = upvotes + 1
   where id = post_id
   returning upvotes;
$$;

grant execute on function public.upvote_post(uuid) to anon, authenticated;
