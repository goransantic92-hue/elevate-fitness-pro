/** Query value `?plan=` on /coaching-apply — must match Home pricing CTAs. */
export const COACHING_PLAN_SLUGS = ["coached-strong-90", "private-transformation"] as const;
export type CoachingPlanSlug = (typeof COACHING_PLAN_SLUGS)[number];

export const COACHING_PLAN_LABEL: Record<CoachingPlanSlug, string> = {
  "coached-strong-90": "Coached Strong 90 — Core Coaching (€299/mo)",
  "private-transformation": "Private Transformation — Elite (€699/mo)",
};

export function parseCoachingPlanParam(value: string | null): CoachingPlanSlug | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return (COACHING_PLAN_SLUGS as readonly string[]).includes(v) ? (v as CoachingPlanSlug) : null;
}
