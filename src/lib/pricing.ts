/** Site-wide pricing (AED). Psychological rounding from EUR list prices. */
export const PRICING = {
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
} as const;

export const CALENDLY_FREE_CALL_URL = "https://calendly.com/ptmilosilic/quick-consultation-";
