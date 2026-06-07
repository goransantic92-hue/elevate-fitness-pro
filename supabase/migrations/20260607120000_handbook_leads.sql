-- Free handbook signups (lead magnet emails for coach marketing)

create table public.handbook_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  handbook_ids text[] not null,
  source text not null default 'homepage',
  emails_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_handbook_leads_email_lower on public.handbook_leads (lower(email));
create index idx_handbook_leads_created_at on public.handbook_leads (created_at desc);

alter table public.handbook_leads enable row level security;

create policy "handbook_leads_admin_select"
  on public.handbook_leads for select
  using (public.is_admin());

create policy "handbook_leads_admin_all"
  on public.handbook_leads for all
  using (public.is_admin()) with check (public.is_admin());
