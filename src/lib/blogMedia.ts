const BUCKET = "blog";

/** Public URL for a blog cover — storage path, absolute URL, or site-relative path. */
export function blogCoverUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const objectPath = path.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

export const BLOG_IMAGE_BUCKET = BUCKET;
