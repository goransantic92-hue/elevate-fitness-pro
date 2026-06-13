# Site CMS setup

Run both migrations in Supabase SQL Editor (or via `supabase db push`):

1. `20260611120000_homepage_content.sql` — homepage hero/coach and extended sections
2. `20260612120000_site_content.sql` — Pricing, FAQ, Handbooks, Program, Nutrition, Coaching

## Admin URLs

- `/admin/homepage` — full homepage (hero, coach, stats, tiers, pillars, CTA…)
- `/admin/pages` — other marketing pages (dropdown to pick page)

## Workflow

Save draft → Ready for review → Publish now (live without deploy).
