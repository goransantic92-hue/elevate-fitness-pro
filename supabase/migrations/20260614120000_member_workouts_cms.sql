-- Member workout CMS: gym/home A/B/C, emergency sessions, demo video paths.

alter table public.site_content drop constraint if exists site_content_page_key_check;
alter table public.site_content add constraint site_content_page_key_check
  check (page_key in (
    'pricing', 'faq', 'handbooks', 'program', 'nutrition', 'coaching',
    'member_dashboard', 'member_nutrition', 'member_roadmap', 'testimonials',
    'member_workouts'
  ));
