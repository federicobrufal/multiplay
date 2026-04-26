-- ============================================================
-- Multiplay — schema
-- Run this in the Supabase SQL editor once.
-- Safe to re-run: uses IF NOT EXISTS, DO blocks gated on shape, etc.
-- ============================================================

-- Profiles: one row per auth user (the parent's account).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 20),
  created_at timestamptz not null default now()
);

-- (Legacy) per-parent selected mascot. Now mascot selection is per kid;
-- this column is unused but kept to avoid breaking older deployments.
alter table public.profiles
  add column if not exists selected_mascot_id int not null default 1
  check (selected_mascot_id between 1 and 100);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- Kids: child profiles owned by a parent (one parent ↔ many kids).
-- All gameplay (progress, redemptions) is keyed by kid_id, not by the
-- parent's auth user. Kids do not have their own auth credentials —
-- the parent picks an active kid via cookie after logging in.
create table if not exists public.kids (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 30),
  grade int not null default 1 check (grade between 1 and 7),
  selected_mascot_id int not null default 1
    check (selected_mascot_id between 1 and 100),
  created_at timestamptz not null default now()
);

-- Migration: add grade column for older deployments. Defaults to 1.
alter table public.kids
  add column if not exists grade int not null default 1
  check (grade between 1 and 7);

create index if not exists kids_parent_idx on public.kids (parent_id);

alter table public.kids enable row level security;

drop policy if exists "kids_select_own" on public.kids;
create policy "kids_select_own"
  on public.kids for select
  using (auth.uid() = parent_id);

-- Insert/update/delete go through the service-role admin client; no
-- direct user write policies are needed.


-- Progress: one row per (kid, level, track, theme).
create table if not exists public.progress (
  kid_id uuid not null references public.kids(id) on delete cascade,
  level_id int not null check (level_id between 1 and 100),
  track text not null default 'math'
    check (track in ('math', 'language', 'social-sciences', 'natural-sciences')),
  theme text not null default 'tables',
  score int not null check (score >= 0),
  total int not null check (total > 0),
  passed boolean not null default false,
  stars int not null default 0 check (stars between 0 and 3),
  updated_at timestamptz not null default now(),
  primary key (kid_id, level_id, track, theme)
);

-- Idempotent migrations from previous shapes.

-- 1) Add `track` column if missing (legacy).
alter table public.progress
  add column if not exists track text not null default 'math';

-- Ensure the track CHECK includes all current tracks (idempotent).
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'progress_track_check'
      and conrelid = 'public.progress'::regclass
  ) then
    alter table public.progress drop constraint progress_track_check;
  end if;
  alter table public.progress add constraint progress_track_check
    check (track in ('math', 'language', 'social-sciences', 'natural-sciences'));
end $$;

-- 2) Add `theme` column if missing (legacy).
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'progress' and column_name = 'theme'
  ) then
    alter table public.progress add column theme text;
    update public.progress set theme = case track
      when 'language' then 'nouns-verbs'
      else 'tables'
    end where theme is null;
    alter table public.progress alter column theme set not null;
    alter table public.progress alter column theme set default 'tables';
  end if;
end $$;

-- 3) Drop legacy progress policies BEFORE migrating user_id → kid_id;
--    they depend on the user_id column and would block its removal.
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

-- 4) Migrate from `user_id` to `kid_id`.
--    For each existing parent that has progress rows, auto-create a
--    default kid (named after their username), reassign all rows.
do $$
declare
  has_kid_id boolean;
  has_user_id boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'progress' and column_name = 'kid_id'
  ) into has_kid_id;
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'progress' and column_name = 'user_id'
  ) into has_user_id;

  if has_user_id and not has_kid_id then
    alter table public.progress add column kid_id uuid;

    -- Auto-create one kid per parent that has progress rows.
    insert into public.kids (parent_id, name, selected_mascot_id)
    select distinct pr.user_id, coalesce(p.username, 'jugador'), coalesce(p.selected_mascot_id, 1)
    from public.progress pr
    left join public.profiles p on p.id = pr.user_id
    where not exists (select 1 from public.kids k where k.parent_id = pr.user_id);

    -- Backfill kid_id by linking each progress row to that parent's first kid.
    update public.progress pr
    set kid_id = (
      select k.id from public.kids k
      where k.parent_id = pr.user_id
      order by k.created_at asc
      limit 1
    );
  end if;
end $$;

-- 4) Lock down progress.kid_id and switch the primary key to it.
do $$
declare
  has_kid_id boolean;
  has_user_id boolean;
  pk_includes_kid boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'progress' and column_name = 'kid_id'
  ) into has_kid_id;
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'progress' and column_name = 'user_id'
  ) into has_user_id;

  if has_kid_id then
    -- Make NOT NULL once everything is backfilled.
    alter table public.progress alter column kid_id set not null;

    -- Add FK if not present.
    if not exists (
      select 1 from pg_constraint
      where conname = 'progress_kid_id_fkey' and conrelid = 'public.progress'::regclass
    ) then
      alter table public.progress
        add constraint progress_kid_id_fkey
        foreign key (kid_id) references public.kids(id) on delete cascade;
    end if;

    -- Rotate primary key to (kid_id, level_id, track, theme).
    if exists (
      select 1 from pg_constraint
      where conname = 'progress_pkey' and conrelid = 'public.progress'::regclass
    ) then
      select exists (
        select 1 from information_schema.key_column_usage
        where table_schema = 'public' and table_name = 'progress'
          and constraint_name = 'progress_pkey' and column_name = 'kid_id'
      ) into pk_includes_kid;
      if not pk_includes_kid then
        alter table public.progress drop constraint progress_pkey;
        alter table public.progress add primary key (kid_id, level_id, track, theme);
      end if;
    end if;

    -- Drop the legacy user_id column once kid_id is the source of truth.
    if has_user_id then
      alter table public.progress drop column user_id;
    end if;
  end if;
end $$;

alter table public.progress enable row level security;

-- Users (parents) can read progress rows of their own kids.
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress for select
  using (
    exists (
      select 1 from public.kids k
      where k.id = progress.kid_id and k.parent_id = auth.uid()
    )
  );

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress for insert
  with check (
    exists (
      select 1 from public.kids k
      where k.id = progress.kid_id and k.parent_id = auth.uid()
    )
  );

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress for update
  using (
    exists (
      select 1 from public.kids k
      where k.id = progress.kid_id and k.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.kids k
      where k.id = progress.kid_id and k.parent_id = auth.uid()
    )
  );

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own"
  on public.progress for delete
  using (
    exists (
      select 1 from public.kids k
      where k.id = progress.kid_id and k.parent_id = auth.uid()
    )
  );


-- Coin redemptions: log of admin-driven wallet drains (Robux, helado, etc.).
create table if not exists public.coin_redemptions (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid not null references public.kids(id) on delete cascade,
  amount int not null check (amount > 0),
  reason text not null check (char_length(reason) between 1 and 200),
  created_at timestamptz not null default now()
);

-- Drop legacy redemption policy first; it depends on user_id.
drop policy if exists "redemptions_select_own" on public.coin_redemptions;

-- Migrate from user_id to kid_id (idempotent).
do $$
declare
  has_kid_id boolean;
  has_user_id boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coin_redemptions' and column_name = 'kid_id'
  ) into has_kid_id;
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coin_redemptions' and column_name = 'user_id'
  ) into has_user_id;

  if has_user_id and not has_kid_id then
    alter table public.coin_redemptions add column kid_id uuid;
    -- Map every existing redemption to that parent's first kid.
    update public.coin_redemptions cr
    set kid_id = (
      select k.id from public.kids k
      where k.parent_id = cr.user_id
      order by k.created_at asc
      limit 1
    );
  end if;
end $$;

do $$
declare
  has_kid_id boolean;
  has_user_id boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coin_redemptions' and column_name = 'kid_id'
  ) into has_kid_id;
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'coin_redemptions' and column_name = 'user_id'
  ) into has_user_id;

  if has_kid_id then
    alter table public.coin_redemptions alter column kid_id set not null;
    if not exists (
      select 1 from pg_constraint
      where conname = 'coin_redemptions_kid_id_fkey'
        and conrelid = 'public.coin_redemptions'::regclass
    ) then
      alter table public.coin_redemptions
        add constraint coin_redemptions_kid_id_fkey
        foreign key (kid_id) references public.kids(id) on delete cascade;
    end if;
    if has_user_id then
      alter table public.coin_redemptions drop column user_id;
    end if;
  end if;
end $$;

drop index if exists coin_redemptions_user_idx;
create index if not exists coin_redemptions_kid_idx
  on public.coin_redemptions (kid_id, created_at desc);

alter table public.coin_redemptions enable row level security;

drop policy if exists "redemptions_select_own" on public.coin_redemptions;
create policy "redemptions_select_own"
  on public.coin_redemptions for select
  using (
    exists (
      select 1 from public.kids k
      where k.id = coin_redemptions.kid_id and k.parent_id = auth.uid()
    )
  );
-- No write policies — admin (service role) bypasses RLS.


-- Text submissions: free-text answers (TextProduction component) that
-- need adult approval before the level is marked passed. Approval is
-- inline (parent enters their password on the kid's screen).
-- `reviewer_type` is forward-prepared for an AI auto-grader.
create table if not exists public.text_submissions (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid not null references public.kids(id) on delete cascade,
  track text not null,
  theme text not null,
  level_id int not null,
  content text not null,
  min_chars int not null check (min_chars >= 1),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewer_type text check (reviewer_type in ('parent', 'ai')),
  feedback text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists text_submissions_kid_idx
  on public.text_submissions (kid_id, created_at desc);

alter table public.text_submissions enable row level security;

drop policy if exists "text_submissions_select_own" on public.text_submissions;
create policy "text_submissions_select_own"
  on public.text_submissions for select
  using (
    exists (
      select 1 from public.kids k
      where k.id = text_submissions.kid_id and k.parent_id = auth.uid()
    )
  );
-- No write policies — admin (service role) bypasses RLS for inserts/updates.
