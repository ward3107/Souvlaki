-- Owner-added menu dishes + an image bucket for their photos.
--
-- These rows are *additive*: the site's built-in menu (in code) always shows,
-- and any dishes the owner adds here are merged in per category. Public can
-- read them (to render the menu); only the signed-in owner can change them.

create table if not exists public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,                 -- pita | plates | platters | pizza | salads | sides | drinks | alcohol
  name        jsonb not null,                -- { en, he, ar, ru, el }
  description jsonb,                          -- { en, he, ar, ru, el }
  price       integer not null,              -- shekels
  image_url   text,
  badges      text[] not null default '{}',  -- popular | gf | vegan | spicy | new
  available   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists menu_items_category_idx on public.menu_items (category, sort_order);

alter table public.menu_items enable row level security;

create policy "menu_items read for all"
  on public.menu_items for select using (true);

create policy "menu_items write for authenticated"
  on public.menu_items for all to authenticated using (true) with check (true);

-- ── Image storage ────────────────────────────────────────────────────────────
-- A public bucket for dish photos the owner uploads from /admin.
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Anyone can view the images (they're shown on the public menu)…
create policy "menu-images public read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- …only the signed-in owner can upload / change / remove them.
create policy "menu-images owner write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images');

create policy "menu-images owner update"
  on storage.objects for update to authenticated
  using (bucket_id = 'menu-images') with check (bucket_id = 'menu-images');

create policy "menu-images owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images');
