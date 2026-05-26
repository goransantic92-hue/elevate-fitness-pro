import { supabase } from "@/lib/supabase";

export const WORKOUT_DEMOS_BUCKET = "workout-demos";

/** Signed URL valid 1 hour — requires logged-in member with program access. */
export async function getWorkoutDemoSignedUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(WORKOUT_DEMOS_BUCKET).createSignedUrl(storagePath, 3600);
  if (error) {
    console.error("workout demo signed URL:", error.message);
    return null;
  }
  return data.signedUrl;
}
