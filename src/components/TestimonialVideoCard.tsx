import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { TestimonialVideo } from "@/data/testimonials";
import { testimonialPosterSrc, testimonialVideoSrc } from "@/data/testimonials";

type Props = {
  testimonial: TestimonialVideo;
};

export function TestimonialVideoCard({ testimonial }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = testimonialVideoSrc(testimonial);
  const poster = testimonialPosterSrc(testimonial);

  const startPlayback = () => {
    const el = videoRef.current;
    if (!el || !src) return;
    setPlaying(true);
    void el.play();
  };

  return (
    <article className="flex flex-col">
      <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-[#111]">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={src || undefined}
            poster={poster}
            controls={playing}
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <button
              type="button"
              onClick={startPlayback}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
              aria-label={`Play ${testimonial.name}'s story`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Play className="h-7 w-7 fill-current pl-0.5" aria-hidden />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">Watch story</span>
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-center font-sans text-sm font-bold text-foreground">{testimonial.name}</p>
    </article>
  );
}
