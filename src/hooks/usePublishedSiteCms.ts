import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { resolveHomepageLocale } from "@/i18n/constants";
import { fetchPublishedSiteCms } from "@/lib/siteCms";

export function usePublishedSiteCms<K extends SitePageKey>(pageKey: K) {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);

  return useQuery({
    queryKey: ["site-cms", pageKey, locale],
    queryFn: () => fetchPublishedSiteCms(pageKey, locale),
    staleTime: 60_000,
  });
}
