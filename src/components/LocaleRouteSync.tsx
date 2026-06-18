import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/i18n/constants";

type Props = {
  locale: AppLanguage;
};

/** Keeps i18n in sync with the locale segment in the URL (/sr, /ar, or English at root). */
export function LocaleRouteSync({ locale }: Props) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const current = i18n.language?.split("-")[0];
    if (current !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return <Outlet />;
}
