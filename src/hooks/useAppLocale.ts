import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  isPublicPath,
  localeFromPathname,
  localePath,
  splitLocalePath,
} from "@/i18n/localePaths";
import { DEFAULT_LANGUAGE, type AppLanguage } from "@/i18n/constants";

export function useAppLocale() {
  const location = useLocation();
  const { i18n } = useTranslation();

  return useMemo(() => {
    const fromUrl = splitLocalePath(location.pathname);
    const i18nLocale = (i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE) as AppLanguage;
    const locale =
      isPublicPath(fromUrl.path) || isPublicPath(location.pathname)
        ? fromUrl.locale
        : i18nLocale;

    const to = (path: string, targetLocale: AppLanguage = locale) => localePath(path, targetLocale);

    const switchLocalePath = (targetLocale: AppLanguage) =>
      `${localePath(fromUrl.path, targetLocale)}${location.search}${location.hash}`;

    return {
      locale,
      path: fromUrl.path,
      to,
      switchLocalePath,
      localeFromUrl: localeFromPathname(location.pathname),
    };
  }, [location.pathname, location.search, location.hash, i18n.language]);
}
