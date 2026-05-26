-- Private bucket for exercise demo videos (GYM/HOME). Members with program access only.

create or replace function public.has_program_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
  or exists (
    select 1 from public.member_access ma
    where ma.user_id = auth.uid() and ma.has_access = true
  );
$$;

grant execute on function public.has_program_access() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workout-demos',
  'workout-demos',
  false,
  104857600,
  array['video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "workout_demos_member_read" on storage.objects;
create policy "workout_demos_member_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'workout-demos'
    and public.has_program_access()
  );

drop policy if exists "workout_demos_admin_write" on storage.objects;
create policy "workout_demos_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'workout-demos' and public.is_admin())
  with check (bucket_id = 'workout-demos' and public.is_admin());
