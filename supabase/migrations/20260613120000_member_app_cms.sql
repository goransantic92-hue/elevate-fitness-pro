-- Extend site_content for member dashboard, nutrition, roadmap, and testimonials.

alter table public.site_content drop constraint if exists site_content_page_key_check;
alter table public.site_content add constraint site_content_page_key_check
  check (page_key in (
    'pricing', 'faq', 'handbooks', 'program', 'nutrition', 'coaching',
    'member_dashboard', 'member_nutrition', 'member_roadmap', 'testimonials'
  ));

-- Allow admins to upload testimonial videos/posters.
drop policy if exists "testimonials_admin_write" on storage.objects;
create policy "testimonials_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'testimonials' and public.is_admin())
  with check (bucket_id = 'testimonials' and public.is_admin());
