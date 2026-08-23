-- Greek Souvlaki — Supabase schema
-- Powers: shared /admin menu availability + price overrides, and order history.
--
-- Security model: a single owner account (created in Auth → Users) is the only
-- authenticated user. Public visitors use the anon key, which can:
--   • read menu_overrides (so the live menu reflects owner changes)
--   • insert an order row when they send a WhatsApp order
-- Everything else (editing the menu, reading orders) requires the owner login.

-- ── Menu overrides ──────────────────────────────────────────────────────────
create table if not exists public.menu_overrides (
  item_id    text primary key,
  sold_out   boolean not null default false,
  price      integer,                       -- overrides the in-code base price
  updated_at timestamptz not null default now()
);

alter table public.menu_overrides enable row level security;

-- Anyone may read current overrides (needed to render the live menu).
create policy "menu_overrides read for all"
  on public.menu_overrides for select
  using (true);

-- Only the signed-in owner may change them.
create policy "menu_overrides write for authenticated"
  on public.menu_overrides for all
  to authenticated
  using (true)
  with check (true);

-- ── Orders ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  customer_name    text,
  total            integer,                 -- shekels
  items            jsonb,                   -- [{ q, n, v, p }]
  lang             text,
  status           text not null default 'received',  -- received | served
  served_at        timestamptz,
  served_elapsed_sec integer
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Customers (anon) may create an order when they check out…
create policy "orders insert for all"
  on public.orders for insert
  with check (true);

-- …but only the owner may read them or mark them served.
create policy "orders read for authenticated"
  on public.orders for select
  to authenticated
  using (true);

create policy "orders update for authenticated"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);
