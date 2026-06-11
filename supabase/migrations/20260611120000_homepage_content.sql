-- Homepage CMS: hero + coach sections with draft / publish workflow.

create table if not exists public.homepage_content (
  locale text primary key check (locale in ('en', 'ar')),
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  review_status text not null default 'draft'
    check (review_status in ('draft', 'pending_review', 'published')),
  review_requested_at timestamptz,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

drop trigger if exists trg_homepage_content_updated_at on public.homepage_content;
create trigger trg_homepage_content_updated_at
before update on public.homepage_content
for each row execute function public.set_updated_at();

alter table public.homepage_content enable row level security;

drop policy if exists "homepage_content_admin_all" on public.homepage_content;
create policy "homepage_content_admin_all" on public.homepage_content
for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.get_published_homepage(p_locale text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select published
  from public.homepage_content
  where locale = p_locale;
$$;

grant execute on function public.get_published_homepage(text) to anon, authenticated;

-- Public bucket for homepage hero / coach images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'homepage',
  'homepage',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "homepage_public_read" on storage.objects;
create policy "homepage_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'homepage');

drop policy if exists "homepage_admin_write" on storage.objects;
create policy "homepage_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'homepage' and public.is_admin())
  with check (bucket_id = 'homepage' and public.is_admin());
