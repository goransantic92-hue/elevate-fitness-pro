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
    price: "€299 / month",
    emailLabel: "Coached Strong 90 — Core Coaching (€299/mo)",
  },
  "private-transformation": {
    name: "Private Transformation",
    tier: "Elite",
    price: "€699 / month",
    emailLabel: "Private Transformation — Elite (€699/mo)",
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
