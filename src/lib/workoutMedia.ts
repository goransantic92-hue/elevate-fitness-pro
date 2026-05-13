/**
 * Workout demo clips: prefer Supabase Storage (public bucket). Fallback `/videos/` for local dev.
 *
 * VITE_WORKOUT_VIDEOS_BASE_URL — no trailing slash, e.g.
 * https://YOUR_PROJECT.supabase.co/storage/v1/object/public/workout-demos
 */
export function getWorkoutVideoUrl(filename: string): string {
  const base = import.meta.env.VITE_WORKOUT_VIDEOS_BASE_URL?.trim().replace(/\/$/, "");
  if (base) return `${base}/${filename}`;
  return `/videos/${filename}`;
}
