# Workout demo videos (GYM Training A & B)

## One-time: run SQL in Supabase

Dashboard → **SQL Editor** → New query → paste contents of:

`supabase/migrations/20260526120000_workout_demos_storage.sql`

→ **Run**

## Upload videos (local)

```powershell
npm run upload:workout-demos
```

Videos are read from:

- `public/Trening A/*.mp4` → `workout-demos/gym/a/…`
- `public/Trening B/*.mp4` → `workout-demos/gym/b/…`

## Member app

Dashboard → Training → **GYM** → **Training A** or **Training B** → tap an exercise → **Play video**.

Only users with `member_access.has_access = true` (or admins) can load signed URLs.
