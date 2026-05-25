# Testimonial videos on Supabase Storage

## 1. Create the public bucket (once)

In [Supabase SQL Editor](https://supabase.com/dashboard/project/pfxfydhkoqcpomfrlgjg/sql/new), run:

`supabase/migrations/20260525120000_testimonials_storage.sql`

## 2. Upload files

Add to `.env.local` (do not commit):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
```

Then:

```powershell
npm run upload:testimonials
```

## 3. Switch the site to Storage URLs

Remove from `.env` (and Vercel env if set):

```
VITE_TESTIMONIAL_VIDEO_SOURCE=local
```

Videos will load from:

`https://pfxfydhkoqcpomfrlgjg.supabase.co/storage/v1/object/public/testimonials/videos/{name}.mp4`
