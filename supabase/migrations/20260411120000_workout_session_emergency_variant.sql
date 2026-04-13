-- Allow 10-min (emergency) track per slot/week alongside gym & home.
-- One row per (user, week, slot, variant).

alter table public.workout_session_logs
  drop constraint if exists workout_session_logs_user_id_week_number_slot_key;

alter table public.workout_session_logs
  drop constraint if exists workout_session_logs_variant_check;

alter table public.workout_session_logs
  add constraint workout_session_logs_variant_check
  check (variant in ('gym', 'home', 'emergency'));

alter table public.workout_session_logs
  add constraint workout_session_logs_user_week_slot_variant_key
  unique (user_id, week_number, slot, variant);
