const LOCALE_MAP: Record<string, string> = {
  en: "en-GB",
  ar: "ar-AE",
};

export function formatBlogDate(isoDate: string, locale?: string): string {
  const lang = locale?.split("-")[0] ?? "en";
  const dateLocale = LOCALE_MAP[lang] ?? "en-GB";
  return new Date(isoDate).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
