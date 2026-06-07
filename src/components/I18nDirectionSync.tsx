import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRtlLanguage } from "@/i18n/constants";

/** Syncs document lang/dir and body font when locale changes. */
export function I18nDirectionSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language?.split("-")[0] ?? "en";
    const rtl = isRtlLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", rtl);
  }, [i18n.language]);

  return null;
}
