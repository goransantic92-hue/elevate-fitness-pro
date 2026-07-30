-- Blog CMS: posts list (add/edit/delete), cover images, article body blocks.

alter table public.site_content drop constraint if exists site_content_page_key_check;
alter table public.site_content add constraint site_content_page_key_check
  check (page_key in (
    'pricing', 'faq', 'handbooks', 'program', 'nutrition', 'coaching',
    'member_dashboard', 'member_nutrition', 'member_roadmap', 'testimonials',
    'member_workouts', 'blog'
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog',
  'blog',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_public_read" on storage.objects;
create policy "blog_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'blog');

drop policy if exists "blog_admin_write" on storage.objects;
create policy "blog_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'blog' and public.is_admin())
  with check (bucket_id = 'blog' and public.is_admin());
