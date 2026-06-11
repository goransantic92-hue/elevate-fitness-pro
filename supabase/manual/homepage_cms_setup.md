# Homepage CMS setup

Run the migration `20260611120000_homepage_content.sql` in the Supabase SQL Editor (or via `supabase db push`).

This creates:

- `homepage_content` table (draft / published JSON per locale)
- `get_published_homepage(locale)` RPC for the public site
- `homepage` storage bucket for hero and coach images

After migration, admins can edit content at `/admin/homepage` on the live site.
