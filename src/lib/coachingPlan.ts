import type { PricingSet } from "@/lib/pricing";

/** Query value `?plan=` on /coaching-apply — must match Home pricing CTAs. */
export const COACHING_PLAN_SLUGS = ["coached-strong-90", "private-transformation"] as const;
export type CoachingPlanSlug = (typeof COACHING_PLAN_SLUGS)[number];

export type CoachingPlanDisplay = {
  name: string;
  tier: string;
  price: string;
  emailLabel: string;
};

/** UI + emails: keep wording aligned with `api/coaching-apply.ts` when no client label is sent. */
export function getCoachingPlanDisplay(pricing: PricingSet): Record<CoachingPlanSlug, CoachingPlanDisplay> {
  return {
    "coached-strong-90": {
      name: "Coached Strong 90",
      tier: "Core Coaching",
      price: pricing.coachedStrong90.labelMonthly,
      emailLabel: `Coached Strong 90 — Core Coaching (${pricing.coachedStrong90.labelMonthly})`,
    },
    "private-transformation": {
      name: "Private Transformation",
      tier: "Elite",
      price: pricing.privateTransformation.labelMonthly,
      emailLabel: `Private Transformation — Elite (${pricing.privateTransformation.labelMonthly})`,
    },
  };
}

export function parseCoachingPlanParam(value: string | null): CoachingPlanSlug | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return (COACHING_PLAN_SLUGS as readonly string[]).includes(v) ? (v as CoachingPlanSlug) : null;
}
