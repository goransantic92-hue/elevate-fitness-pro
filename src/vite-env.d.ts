/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  /** Public Storage bucket base for workout demo MP4s (no trailing slash). */
  readonly VITE_WORKOUT_VIDEOS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
