import { useQuery } from "@tanstack/react-query";
import { fetchPublishedSiteCms } from "@/lib/siteCms";

/** Testimonials are locale-agnostic; always fetch the English published row. */
export function usePublishedTestimonials() {
  return useQuery({
    queryKey: ["site-cms", "testimonials", "en"],
    queryFn: () => fetchPublishedSiteCms("testimonials", "en"),
    staleTime: 60_000,
  });
}
