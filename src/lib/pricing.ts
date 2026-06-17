import { resolveHomepageLocale } from "@/i18n/constants";
import type { AppLanguage } from "@/i18n/constants";

export type PricingTier = {
  amount: number;
  label: string;
  labelOneTime?: string;
  labelMonthly?: string;
  stripeAmountFils?: number;
};

export type PricingSet = {
  currency: "EUR" | "AED" | "RSD";
  selfGuided: PricingTier & { labelOneTime: string; stripeAmountFils: number };
  coachedStrong90: PricingTier & { labelMonthly: string };
  privateTransformation: PricingTier & { labelMonthly: string };
};

/** Display + Stripe checkout (AED). */
export const PRICING_AED: PricingSet = {
  currency: "AED",
  selfGuided: {
    amount: 169,
    label: "169 AED",
    labelOneTime: "169 AED one-time",
    stripeAmountFils: 16900,
  },
  coachedStrong90: {
    amount: 1299,
    label: "1,299 AED",
    labelMonthly: "1,299 AED / month",
  },
  privateTransformation: {
    amount: 2999,
    label: "2,999 AED",
    labelMonthly: "2,999 AED / month",
  },
};

/** English UI list prices (EUR). Checkout still uses AED via Stripe. */
export const PRICING_EUR: PricingSet = {
  currency: "EUR",
  selfGuided: {
    amount: 39,
    label: "€39",
    labelOneTime: "€39 one-time",
    stripeAmountFils: PRICING_AED.selfGuided.stripeAmountFils,
  },
  coachedStrong90: {
    amount: 299,
    label: "€299",
    labelMonthly: "€299 / month",
  },
  privateTransformation: {
    amount: 699,
    label: "€699",
    labelMonthly: "€699 / month",
  },
};

/** Serbian UI list prices (RSD). Checkout still uses AED via Stripe. */
export const PRICING_RSD: PricingSet = {
  currency: "RSD",
  selfGuided: {
    amount: 4590,
    label: "4.590 RSD",
    labelOneTime: "4.590 RSD jednokratno",
    stripeAmountFils: PRICING_AED.selfGuided.stripeAmountFils,
  },
  coachedStrong90: {
    amount: 34990,
    label: "34.990 RSD",
    labelMonthly: "34.990 RSD / mesec",
  },
  privateTransformation: {
    amount: 81990,
    label: "81.990 RSD",
    labelMonthly: "81.990 RSD / mesec",
  },
};

export function getPricing(lang: string): PricingSet {
  const locale = resolveHomepageLocale(lang);
  if (locale === "ar") return PRICING_AED;
  if (locale === "sr") return PRICING_RSD;
  return PRICING_EUR;
}

export function getPricingForLanguage(lang: AppLanguage): PricingSet {
  if (lang === "ar") return PRICING_AED;
  if (lang === "sr") return PRICING_RSD;
  return PRICING_EUR;
}

/** Stripe + legacy imports — always AED amounts for payment processing. */
export const PRICING = PRICING_AED;

export const CALENDLY_FREE_CALL_URL = "https://calendly.com/ptmilosilic/quick-consultation-";
