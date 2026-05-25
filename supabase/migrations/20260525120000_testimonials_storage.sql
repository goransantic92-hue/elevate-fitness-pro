-- Public bucket for homepage testimonial videos and poster images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonials',
  'testimonials',
  true,
  52428800,
  array['video/mp4', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "testimonials_public_read" on storage.objects;
create policy "testimonials_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'testimonials');
