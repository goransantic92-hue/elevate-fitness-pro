import type { PricingSet } from "@/lib/pricing";

/** Replace {{coachingPrice}}, {{selfGuidedOneTime}}, etc. in CMS / locale copy. */
export function applyPricingTokens(text: string, pricing: PricingSet): string {
  return text
    .replace(/\{\{coachingPrice\}\}/g, pricing.coachedStrong90.labelMonthly)
    .replace(/\{\{selfGuidedOneTime\}\}/g, pricing.selfGuided.labelOneTime)
    .replace(/\{\{selfGuidedPrice\}\}/g, pricing.selfGuided.label)
    .replace(/\{\{coachedMonthly\}\}/g, pricing.coachedStrong90.labelMonthly)
    .replace(/\{\{priceOneTime\}\}/g, pricing.selfGuided.labelOneTime);
}
