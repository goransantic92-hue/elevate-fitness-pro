import { testimonialStorageUrl } from "@/lib/testimonialMedia";

export type TestimonialVideo = {
  id: string;
  name: string;
  videoPath: string;
  posterPath: string;
};

const entries = [
  { id: "nupur", name: "Nupur", file: "nupur" },
  { id: "george", name: "George", file: "george" },
  { id: "seph", name: "Seph", file: "seph" },
  { id: "palav-patel", name: "Palav Patel", file: "palav-patel" },
] as const;

export const testimonialVideos: TestimonialVideo[] = entries.map((e) => ({
  id: e.id,
  name: e.name,
  videoPath: `videos/${e.file}.mp4`,
  posterPath: `posters/${e.file}.jpg`,
}));

export function testimonialVideoSrc(t: TestimonialVideo): string {
  if (import.meta.env.VITE_TESTIMONIAL_VIDEO_SOURCE === "local") {
    return `/testimonials/videos/${t.id}.mp4`;
  }
  return testimonialStorageUrl(t.videoPath);
}

/** Posters extracted from video frames (served from /public/testimonials). */
export function testimonialPosterSrc(t: TestimonialVideo): string {
  return `/testimonials/${t.id}.jpg`;
}
