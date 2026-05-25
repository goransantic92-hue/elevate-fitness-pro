const BUCKET = "testimonials";

/** Public Supabase Storage URL for a file in the testimonials bucket. */
export function testimonialStorageUrl(objectPath: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  const path = objectPath.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}
