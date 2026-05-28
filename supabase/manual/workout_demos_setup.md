# Workout demo videos (GYM Training A, B & C)

## One-time: run SQL in Supabase

Dashboard → **SQL Editor** → New query → paste contents of:

`supabase/migrations/20260526120000_workout_demos_storage.sql`

→ **Run**

## Upload videos (local)

```powershell
npm run upload:workout-demos
```

Upload only one program:

```powershell
node scripts/upload-workout-demos.mjs c       # GYM Training C only
node scripts/upload-workout-demos.mjs home-a  # HOME A only
```

Videos are read from:

- `public/Trening A/*.mp4` → `workout-demos/gym/a/…`
- `public/Trening B/*.mp4` → `workout-demos/gym/b/…`
- `public/Trening C/*.mp4` → `workout-demos/gym/c/…` (some exercises have V1 + V2)
- `public/Home A/*.mp4`    → `workout-demos/home/a/…`
- `public/Home B/*.mp4`    → `workout-demos/home/b/…` (some exercises have V1 + V2)
- `public/Home C/*.mp4`    → `workout-demos/home/c/…`

## Member app

Dashboard → Training → **GYM** → **Training A / B / C** or **HOME** → **HOME A / B / C** → tap an exercise → **Play video**.

Exercises with two variations show **V1** / **V2** buttons in the player.

Only users with `member_access.has_access = true` (or admins) can load signed URLs.
