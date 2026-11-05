-- One row per paid Stripe Checkout Session: who paid, how much, when.
-- Written only by the server (service role) from the Stripe webhook and /welcome claim; idempotent on stripe_session_id.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  stripe_payment_link_id text,
  user_id uuid references auth.users (id) on delete set null,
  email text,
  customer_name text,
  product text not null default 'busy_strong_90',
  amount_total integer,            -- minor units (cents / fils), as Stripe sends it
  currency text,                   -- lower-case ISO code, e.g. 'eur', 'aed'
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  livemode boolean not null default true,
  purchased_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases (user_id);
create index if not exists purchases_email_idx on public.purchases (lower(email));
create index if not exists purchases_purchased_at_idx on public.purchases (purchased_at desc);

alter table public.purchases enable row level security;

-- Members see their own purchases, admins see all. No client writes: the server uses the service role.
drop policy if exists "purchases_select" on public.purchases;
create policy "purchases_select" on public.purchases
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "purchases_admin_write" on public.purchases;
create policy "purchases_admin_write" on public.purchases
  for all using (public.is_admin()) with check (public.is_admin());
