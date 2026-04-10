-- BUSY STRONG 90 — initial schema (run in Supabase SQL Editor or via CLI)
-- Stripe / payment tables intentionally omitted until checkout is implemented.

create extension if not exists pgcrypto;

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  insert into public.member_access (user_id, has_access, access_type, source)
  values (new.id, false, 'expired', 'signup')
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- member access ----------
create table if not exists public.member_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  has_access boolean not null default false,
  access_type text not null default 'expired' check (access_type in ('lifetime', 'trial', 'expired')),
  source text not null default 'manual',
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_member_access_updated_at on public.member_access;
create trigger trg_member_access_updated_at
before update on public.member_access
for each row execute function public.set_updated_at();

-- ---------- progress ----------
create table if not exists public.progress_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_number integer not null check (week_number between 1 and 12),
  weight_kg numeric(6,2),
  waist_cm numeric(6,2),
  chest_cm numeric(6,2),
  energy_level integer check (energy_level between 1 and 10),
  compliance_score integer check (compliance_score between 1 and 10),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_number)
);

create index if not exists idx_progress_checkins_user on public.progress_checkins(user_id);

drop trigger if exists trg_progress_checkins_updated_at on public.progress_checkins;
create trigger trg_progress_checkins_updated_at
before update on public.progress_checkins
for each row execute function public.set_updated_at();

-- ---------- workout session log (Mon / Wed / Fri / Sat bonus) ----------
create table if not exists public.workout_session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_number integer not null check (week_number between 1 and 12),
  slot text not null check (slot in ('mon', 'wed', 'fri', 'sat_bonus')),
  variant text not null default 'gym' check (variant in ('gym', 'home')),
  completed boolean not null default true,
  main_lifts_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_number, slot)
);

create index if not exists idx_workout_logs_user on public.workout_session_logs(user_id);

drop trigger if exists trg_workout_session_logs_updated_at on public.workout_session_logs;
create trigger trg_workout_session_logs_updated_at
before update on public.workout_session_logs
for each row execute function public.set_updated_at();

-- ---------- nutrition adherence ----------
create table if not exists public.nutrition_adherence_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  meals_on_plan integer check (meals_on_plan is null or (meals_on_plan >= 0 and meals_on_plan <= 6)),
  protein_focus boolean,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create index if not exists idx_nutrition_logs_user on public.nutrition_adherence_logs(user_id);

drop trigger if exists trg_nutrition_adherence_updated_at on public.nutrition_adherence_logs;
create trigger trg_nutrition_adherence_updated_at
before update on public.nutrition_adherence_logs
for each row execute function public.set_updated_at();

-- ---------- notification prefs (push-ready flag; delivery via Edge Functions later) ----------
create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_reminders boolean not null default false,
  push_enabled boolean not null default false,
  preferred_reminder_time time,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_notification_preferences_updated_at on public.notification_preferences;
create trigger trg_notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

-- ---------- reminder queue (processed by cron / Edge Function — not wired in app yet) ----------
create table if not exists public.reminder_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  scheduled_for timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sent', 'cancelled', 'failed')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reminder_jobs_due on public.reminder_jobs(status, scheduled_for);

-- ---------- optional CMS-style resources for coach ----------
create table if not exists public.content_resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  audience text not null default 'member' check (audience in ('public', 'member')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_content_resources_updated_at on public.content_resources;
create trigger trg_content_resources_updated_at
before update on public.content_resources
for each row execute function public.set_updated_at();

-- ---------- coach notes on members ----------
create table if not exists public.coach_notes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  coach_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_coach_notes_member on public.coach_notes(member_id);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.member_access enable row level security;
alter table public.progress_checkins enable row level security;
alter table public.workout_session_logs enable row level security;
alter table public.nutrition_adherence_logs enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.reminder_jobs enable row level security;
alter table public.content_resources enable row level security;
alter table public.coach_notes enable row level security;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- member_access
drop policy if exists "member_access_select" on public.member_access;
create policy "member_access_select" on public.member_access
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "member_access_admin_write" on public.member_access;
create policy "member_access_admin_write" on public.member_access
for all using (public.is_admin()) with check (public.is_admin());

-- progress_checkins
drop policy if exists "progress_select" on public.progress_checkins;
create policy "progress_select" on public.progress_checkins
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "progress_insert" on public.progress_checkins;
create policy "progress_insert" on public.progress_checkins
for insert with check (auth.uid() = user_id);

drop policy if exists "progress_update" on public.progress_checkins;
create policy "progress_update" on public.progress_checkins
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "progress_delete" on public.progress_checkins;
create policy "progress_delete" on public.progress_checkins
for delete using (auth.uid() = user_id or public.is_admin());

-- workout_session_logs
drop policy if exists "wlog_select" on public.workout_session_logs;
create policy "wlog_select" on public.workout_session_logs
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "wlog_insert" on public.workout_session_logs;
create policy "wlog_insert" on public.workout_session_logs
for insert with check (auth.uid() = user_id);

drop policy if exists "wlog_update" on public.workout_session_logs;
create policy "wlog_update" on public.workout_session_logs
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "wlog_delete" on public.workout_session_logs;
create policy "wlog_delete" on public.workout_session_logs
for delete using (auth.uid() = user_id or public.is_admin());

-- nutrition_adherence_logs
drop policy if exists "nlog_select" on public.nutrition_adherence_logs;
create policy "nlog_select" on public.nutrition_adherence_logs
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "nlog_insert" on public.nutrition_adherence_logs;
create policy "nlog_insert" on public.nutrition_adherence_logs
for insert with check (auth.uid() = user_id);

drop policy if exists "nlog_update" on public.nutrition_adherence_logs;
create policy "nlog_update" on public.nutrition_adherence_logs
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "nlog_delete" on public.nutrition_adherence_logs;
create policy "nlog_delete" on public.nutrition_adherence_logs
for delete using (auth.uid() = user_id or public.is_admin());

-- notification_preferences
drop policy if exists "notif_select" on public.notification_preferences;
create policy "notif_select" on public.notification_preferences
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "notif_upsert" on public.notification_preferences;
create policy "notif_upsert" on public.notification_preferences
for insert with check (auth.uid() = user_id);

drop policy if exists "notif_update" on public.notification_preferences;
create policy "notif_update" on public.notification_preferences
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reminder_jobs
drop policy if exists "reminder_select" on public.reminder_jobs;
create policy "reminder_select" on public.reminder_jobs
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "reminder_insert_own" on public.reminder_jobs;
create policy "reminder_insert_own" on public.reminder_jobs
for insert with check (auth.uid() = user_id);

drop policy if exists "reminder_admin_write" on public.reminder_jobs;
create policy "reminder_admin_write" on public.reminder_jobs
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reminder_delete" on public.reminder_jobs;
create policy "reminder_delete" on public.reminder_jobs
for delete using (public.is_admin());

-- content_resources
drop policy if exists "content_select" on public.content_resources;
create policy "content_select" on public.content_resources
for select using (
  public.is_admin()
  or (
    published = true
    and audience = 'public'
  )
  or (
    published = true
    and audience = 'member'
    and auth.uid() is not null
    and (
      public.is_admin()
      or exists (
        select 1 from public.member_access ma
        where ma.user_id = auth.uid() and ma.has_access = true
      )
    )
  )
);

drop policy if exists "content_admin_all" on public.content_resources;
create policy "content_admin_all" on public.content_resources
for all using (public.is_admin()) with check (public.is_admin());

-- coach_notes
drop policy if exists "coach_notes_select" on public.coach_notes;
create policy "coach_notes_select" on public.coach_notes
for select using (auth.uid() = member_id or public.is_admin());

drop policy if exists "coach_notes_admin_write" on public.coach_notes;
create policy "coach_notes_admin_write" on public.coach_notes
for insert with check (public.is_admin());

drop policy if exists "coach_notes_admin_mutate" on public.coach_notes;
create policy "coach_notes_admin_mutate" on public.coach_notes
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "coach_notes_admin_delete" on public.coach_notes;
create policy "coach_notes_admin_delete" on public.coach_notes
for delete using (public.is_admin());

-- admin full access to profiles (e.g. role / support)
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- backfill rows for accounts created before this migration
insert into public.profiles (id, email)
select u.id, u.email from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

insert into public.member_access (user_id, has_access, access_type, source)
select u.id, false, 'expired', 'backfill' from auth.users u
where not exists (select 1 from public.member_access m where m.user_id = u.id);

insert into public.notification_preferences (user_id)
select u.id from auth.users u
where not exists (select 1 from public.notification_preferences n where n.user_id = u.id);
