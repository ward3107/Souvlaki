begin;

-- app_metadata is assigned by administrators, not public users.
alter policy "menu_overrides write for authenticated" on public.menu_overrides
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "menu_items write for authenticated" on public.menu_items
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "weekly_special read all for authenticated" on public.weekly_special
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "weekly_special write for authenticated" on public.weekly_special
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "orders read for authenticated" on public.orders
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "orders update for authenticated" on public.orders
  using ((auth.jwt()->'app_metadata'->>'role') = 'owner')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "menu-images owner write" on storage.objects
  with check (bucket_id = 'menu-images' and (auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "menu-images owner update" on storage.objects
  using (bucket_id = 'menu-images' and (auth.jwt()->'app_metadata'->>'role') = 'owner')
  with check (bucket_id = 'menu-images' and (auth.jwt()->'app_metadata'->>'role') = 'owner');
alter policy "menu-images owner delete" on storage.objects
  using (bucket_id = 'menu-images' and (auth.jwt()->'app_metadata'->>'role') = 'owner');

alter table public.orders add column customer_note text;
alter table public.orders alter column status set default 'pending_whatsapp';
alter policy "orders insert for all" on public.orders
  with check (status = 'pending_whatsapp' and served_at is null
    and served_elapsed_sec is null and total >= 0 and total <= 100000
    and char_length(customer_name) between 1 and 200
    and (customer_note is null or char_length(customer_note) <= 2000)
    and jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 100
    and lang in ('he', 'ar', 'en', 'ru', 'el'));

commit;
