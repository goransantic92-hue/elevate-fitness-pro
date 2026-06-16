import type { HomepageLocale } from "@/types/homepageCms";

export const SUPPORTED_LANGUAGES = ["en", "ar", "sr"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: AppLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "bs90-lang";

export function isRtlLanguage(lang: string): boolean {
  return lang.startsWith("ar");
}

export function resolveHomepageLocale(lang: string): HomepageLocale {
  const base = lang.split("-")[0];
  if (base === "ar") return "ar";
  if (base === "sr") return "sr";
  return "en";
}
