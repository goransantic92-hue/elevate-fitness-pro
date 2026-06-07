import { useTranslation } from "react-i18next";
import { getPricing, type PricingSet } from "@/lib/pricing";

export function usePricing(): PricingSet {
  const { i18n } = useTranslation();
  return getPricing(i18n.language);
}
