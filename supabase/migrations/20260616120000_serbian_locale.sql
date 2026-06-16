-- Allow Serbian (sr) locale in CMS tables.

alter table public.homepage_content
  drop constraint if exists homepage_content_locale_check;

alter table public.homepage_content
  add constraint homepage_content_locale_check
  check (locale in ('en', 'ar', 'sr'));

alter table public.site_content
  drop constraint if exists site_content_locale_check;

alter table public.site_content
  add constraint site_content_locale_check
  check (locale in ('en', 'ar', 'sr'));
