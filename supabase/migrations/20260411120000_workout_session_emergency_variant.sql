-- Allow gym, home, and 10-min (emergency) rows per slot/week.
-- Required for PostgREST upsert: onConflict user_id,week_number,slot,variant

-- Re-runnable: drop target unique if it already exists
alter table public.workout_session_logs
  drop constraint if exists workout_session_logs_user_week_slot_variant_key;

-- Drop any OLD 3-column unique on (user_id, week_number, slot) — default PG name or variants
alter table public.workout_session_logs
  drop constraint if exists workout_session_logs_user_id_week_number_slot_key;

do $$
declare
  r record;
begin
  for r in
    select c.conname::text as conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'workout_session_logs'
      and c.contype = 'u'
      and array_length(c.conkey, 1) = 3
  loop
    execute format('alter table public.workout_session_logs drop constraint if exists %I', r.conname);
  end loop;
end $$;

alter table public.workout_session_logs
  drop constraint if exists workout_session_logs_variant_check;

alter table public.workout_session_logs
  add constraint workout_session_logs_variant_check
  check (variant in ('gym', 'home', 'emergency'));

alter table public.workout_session_logs
  add constraint workout_session_logs_user_week_slot_variant_key
  unique (user_id, week_number, slot, variant);
