import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchPublishedSiteCms } from "@/lib/siteCms";
import type { HomepageLocale } from "@/types/homepageCms";
import type { SitePageKey } from "@/types/siteCms";

export function usePublishedSiteCms<K extends SitePageKey>(pageKey: K) {
  const { i18n } = useTranslation();
  const locale: HomepageLocale = i18n.language.startsWith("ar") ? "ar" : "en";

  return useQuery({
    queryKey: ["site-cms", pageKey, locale],
    queryFn: () => fetchPublishedSiteCms(pageKey, locale),
    staleTime: 60_000,
  });
}
