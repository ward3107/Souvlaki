# Administration and order handoff contract

Only an account whose server-managed `app_metadata.role` is `owner` may read
orders or change menu items, overrides, specials, or menu images. User-editable
metadata must never grant this role. Public menu reads remain available.

Opening WhatsApp creates a `pending_whatsapp` attempt, not a received order.
The owner confirms receipt after seeing the customer's message. Pending attempts
are excluded from sales and confirmed-order counts. Repeating the same payload
in one browser tab within ten minutes reuses its UUID; the database rejects a
duplicate primary key and the client treats that as already saved. A changed name,
note, language, or cart creates a new attempt.
Storage failures must not prevent the WhatsApp handoff.

## Applying the database change

Before applying migration 0004, identify the real owner's Auth user UUID in the
Supabase dashboard. Assign the role using an administrator connection:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"owner"}'::jsonb
where id = 'REPLACE_WITH_VERIFIED_OWNER_UUID'::uuid;
```

Apply migrations in order. Sign out and back in to refresh the owner's JWT.
No account has administrative access until this role is provisioned.
Existing `received` rows remain unchanged; review old rows because previous
versions recorded WhatsApp clicks as received orders.

## Acceptance checks against an isolated Supabase project

- Anonymous users can read the public menu and create only pending attempts.
- Anonymous and ordinary signed-in users cannot read orders or edit menu data.
- The owner can edit menu data, read attempts, and mark an attempt received.
- Repeating the same attempt UUID does not create another row.
- Attempts do not contribute to sales until confirmed.

Repository tests cover client behavior. Live RLS checks require an isolated
database and anonymous, ordinary-user, and owner tokens; never use production
customer data as test fixtures.

## GitHub merge requirements

Protect `main` and require `Lint`, `Type Check`, `Test`, `E2E Tests`, and `Build`.
The auto-merge workflow now skips major upgrades and refuses to enable merging
unless all five checks are configured as required. If protection settings cannot
be read (for example due to token permissions or ruleset-only configuration), it
leaves the pull request for manual review.
