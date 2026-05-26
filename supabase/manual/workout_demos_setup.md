# Workout demo videos (GYM Training A)

## One-time: run SQL in Supabase

Dashboard → **SQL Editor** → New query → paste contents of:

`supabase/migrations/20260526120000_workout_demos_storage.sql`

→ **Run**

## Upload videos (local)

```powershell
npm run upload:workout-demos
```

Videos are read from `public/Trening A/*.mp4` and uploaded to bucket `workout-demos`.

## Member app

Dashboard → Training → **GYM** → **Training A** → tap an exercise → **Play video**.

Only users with `member_access.has_access = true` (or admins) can load signed URLs.
