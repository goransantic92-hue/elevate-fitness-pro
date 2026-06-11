import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchPublishedHomepageCms } from "@/lib/homepageCms";
import type { HomepageLocale } from "@/types/homepageCms";

export function usePublishedHomepageCms() {
  const { i18n } = useTranslation();
  const locale: HomepageLocale = i18n.language.startsWith("ar") ? "ar" : "en";

  return useQuery({
    queryKey: ["homepage-cms", locale],
    queryFn: () => fetchPublishedHomepageCms(locale),
    staleTime: 60_000,
  });
}
