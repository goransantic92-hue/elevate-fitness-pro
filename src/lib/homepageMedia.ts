const BUCKET = "homepage";

/** Public Supabase Storage URL for a file in the homepage bucket. */
export function homepageStorageUrl(objectPath: string | null | undefined): string | null {
  if (!objectPath) return null;
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const path = objectPath.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export const HOMEPAGE_IMAGE_BUCKET = BUCKET;
