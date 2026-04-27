import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export default gsap;

/**
 * U React komponenti koristi `useLayoutEffect` (ne `useEffect`) da izbegneš treperenje,
 * i uvek ubij animacije pri unmount-u:
 *
 * ```tsx
 * import { useLayoutEffect, useRef } from "react";
 * import { gsap } from "@/lib/gsap";
 *
 * function Hero() {
 *   const root = useRef<HTMLDivElement>(null);
 *   useLayoutEffect(() => {
 *     const ctx = gsap.context(() => {
 *       gsap.from(".hero-title", { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" });
 *     }, root);
 *     return () => ctx.revert();
 *   }, []);
 *   return <div ref={root}>...</div>;
 * }
 * ```
 *
 * Club plugini (npr. SplitText) se uvaze posebno ako imaš licencu.
 */
