-- "Board of the Week" — a single weekly special the owner sets from /admin and
-- that appears on the homepage as the 3D plate.
--
-- Design: many rows may exist over time (a history of past specials), but only
-- the ONE row with active = true is shown to customers. Publishing a new
-- special flips the previous active row off (handled in app code).

create table if not exists public.weekly_special (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,                -- { en, he, ar, ru, el }
  description jsonb,                          -- { en, he, ar, ru, el }
  price       integer,                        -- shekels (optional)
  image_url   text,                           -- dish photo (menu-images bucket)
  badge       jsonb,                          -- short ribbon text, localized (optional)
  active      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Only ever one active special. A partial unique index enforces it at the DB
-- level, so a race can't publish two boards at once.
create unique index if not exists weekly_special_one_active
  on public.weekly_special (active)
  where active;

alter table public.weekly_special enable row level security;

-- Customers read only the active board…
create policy "weekly_special read active for all"
  on public.weekly_special for select
  using (active);

-- …the signed-in owner can read every row (history) and change them.
create policy "weekly_special read all for authenticated"
  on public.weekly_special for select to authenticated using (true);

create policy "weekly_special write for authenticated"
  on public.weekly_special for all to authenticated using (true) with check (true);

-- Dish photos reuse the public `menu-images` bucket created in 0002.
