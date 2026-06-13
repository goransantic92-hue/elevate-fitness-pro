-- Site-wide page CMS: pricing, faq, handbooks, program, nutrition, coaching.

create table if not exists public.site_content (
  page_key text not null check (page_key in ('pricing', 'faq', 'handbooks', 'program', 'nutrition', 'coaching')),
  locale text not null check (locale in ('en', 'ar')),
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  review_status text not null default 'draft'
    check (review_status in ('draft', 'pending_review', 'published')),
  review_requested_at timestamptz,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (page_key, locale)
);

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "site_content_admin_all" on public.site_content;
create policy "site_content_admin_all" on public.site_content
for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.get_published_site_content(p_page_key text, p_locale text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select published
  from public.site_content
  where page_key = p_page_key and locale = p_locale;
$$;

grant execute on function public.get_published_site_content(text, text) to anon, authenticated;

-- Handbook cover images (public read already via homepage bucket policies).
-- Admins upload to homepage/{locale}/handbooks/{id}-{timestamp}.jpg
