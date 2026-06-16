import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { resolveHomepageLocale } from "@/i18n/constants";
import { fetchPublishedHomepageCms } from "@/lib/homepageCms";

export function usePublishedHomepageCms() {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);

  return useQuery({
    queryKey: ["homepage-cms", locale],
    queryFn: () => fetchPublishedHomepageCms(locale),
    staleTime: 60_000,
  });
}
