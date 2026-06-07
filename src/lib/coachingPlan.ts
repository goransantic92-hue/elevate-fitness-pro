import { PRICING } from "@/lib/pricing";

/** Query value `?plan=` on /coaching-apply — must match Home pricing CTAs. */
export const COACHING_PLAN_SLUGS = ["coached-strong-90", "private-transformation"] as const;
export type CoachingPlanSlug = (typeof COACHING_PLAN_SLUGS)[number];

/** UI + emails: keep wording aligned with `api/coaching-apply.ts` (COACHING_PLAN_LABEL). */
export const COACHING_PLAN_DISPLAY: Record<
  CoachingPlanSlug,
  { name: string; tier: string; price: string; emailLabel: string }
> = {
  "coached-strong-90": {
    name: "Coached Strong 90",
    tier: "Core Coaching",
    price: `${PRICING.coachedStrong90.labelMonthly}`,
    emailLabel: `Coached Strong 90 — Core Coaching (${PRICING.coachedStrong90.labelMonthly})`,
  },
  "private-transformation": {
    name: "Private Transformation",
    tier: "Elite",
    price: `${PRICING.privateTransformation.labelMonthly}`,
    emailLabel: `Private Transformation — Elite (${PRICING.privateTransformation.labelMonthly})`,
  },
};

export const COACHING_PLAN_LABEL: Record<CoachingPlanSlug, string> = {
  "coached-strong-90": COACHING_PLAN_DISPLAY["coached-strong-90"].emailLabel,
  "private-transformation": COACHING_PLAN_DISPLAY["private-transformation"].emailLabel,
};

export function parseCoachingPlanParam(value: string | null): CoachingPlanSlug | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return (COACHING_PLAN_SLUGS as readonly string[]).includes(v) ? (v as CoachingPlanSlug) : null;
}
