\set ON_ERROR_STOP on
-- Run only in an isolated PostgreSQL fixture, after all application migrations.
grant usage on schema public, storage to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;

set role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', false);
insert into public.orders (id, customer_name, total, items, lang)
values ('11111111-1111-4111-8111-111111111111', 'Test customer', 30, '[{"q":1,"n":"Pita","p":30}]', 'en');
do $$ begin
  begin
    insert into public.orders (id, customer_name, total, items, lang)
    values ('11111111-1111-4111-8111-111111111111', 'Test customer', 30, '[{"q":1,"n":"Pita","p":30}]', 'en');
    raise exception 'Duplicate attempt was accepted';
  exception when unique_violation then null; end;
end $$;
do $$ begin
  if (select count(*) from public.orders) <> 0 then raise exception 'Anonymous order read leaked'; end if;
  begin
    insert into public.orders (customer_name, total, items, lang, status)
    values ('Forgery', 30, '[{}]', 'en', 'received');
    raise exception 'Anonymous forged confirmation was accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.menu_overrides (item_id, price) values ('unauthorized', 1);
    raise exception 'Anonymous menu write was accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set role authenticated;
-- A user-editable metadata role must not grant access.
select set_config('request.jwt.claims', '{"role":"authenticated","user_metadata":{"role":"owner"},"app_metadata":{}}', false);
do $$ begin
  if (select count(*) from public.orders) <> 0 then raise exception 'Ordinary user order read leaked'; end if;
  begin
    insert into public.menu_items (category, name, price) values ('pita', '{"en":"Unauthorized"}', 1);
    raise exception 'Ordinary user menu write was accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name) values ('menu-images', 'unauthorized.jpg');
    raise exception 'Ordinary user storage write was accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"owner"}}', false);
insert into public.menu_overrides (item_id, price) values ('owner-test', 30);
insert into public.menu_items (category, name, price) values ('pita', '{"en":"Owner dish"}', 30);
insert into storage.objects (bucket_id, name) values ('menu-images', 'owner.jpg');
insert into public.weekly_special (title, active) values ('{"en":"Special"}', true);
do $$ begin
  if (select count(*) from public.orders) <> 1 then raise exception 'Deduplication or owner read failed'; end if;
  if (select count(*) from public.orders where status = 'pending_whatsapp') <> 1 then raise exception 'Attempt incorrectly confirmed'; end if;
end $$;
update public.orders set status = 'received' where id = '11111111-1111-4111-8111-111111111111';
do $$ begin
  if (select count(*) from public.orders where status = 'received') <> 1 then raise exception 'Owner confirmation failed'; end if;
end $$;
reset role;
set role anon;
do $$ begin
  if (select count(*) from public.menu_items) <> 1 then raise exception 'Public menu read failed'; end if;
  if (select count(*) from public.weekly_special) <> 1 then raise exception 'Public active special read failed'; end if;
end $$;
reset role;
select 'RLS contract passed: anonymous, ordinary-user, owner, deduplication, confirmation, and public reads';
