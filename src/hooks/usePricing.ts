import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDisplayCurrency } from "@/context/CurrencyContext";
import { buildPricing, type PricingSet } from "@/lib/pricing";

export function usePricing(): PricingSet {
  const { currency } = useDisplayCurrency();
  const { t, i18n } = useTranslation();

  return useMemo(
    () =>
      buildPricing(currency, {
        oneTime: t("misc.oneTime"),
        perMonth: t("misc.perMonth"),
      }),
    [currency, i18n.language, t],
  );
}
