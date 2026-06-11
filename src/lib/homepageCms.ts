import type { TFunction } from "i18next";
import arHome from "@/i18n/locales/ar/home";
import enHome from "@/i18n/locales/en/home";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  HomepageCoachContent,
  HomepageCmsPayload,
  HomepageContentRow,
  HomepageHeroContent,
  HomepageLocale,
  HomepageReviewStatus,
} from "@/types/homepageCms";

type StatItem = { value: string; label: string };

function homeBundle(locale: HomepageLocale) {
  return locale === "ar" ? arHome : enHome;
}

export function getDefaultHomepageCms(locale: HomepageLocale): HomepageCmsPayload {
  const home = homeBundle(locale);
  const heroTrust = [...home.hero.trust];
  const coachParagraphs = [...home.coach.paragraphs];
  const coachStats = home.coach.stats.map((s) => ({ ...s }));

  return {
    hero: {
      eyebrow: home.hero.eyebrow,
      headline: home.hero.headline,
      headlineEnergy: home.hero.headlineEnergy,
      headlineSuffix: home.hero.headlineSuffix,
      subhead: home.hero.subhead,
      pills: [...home.hero.pills],
      trust: heroTrust,
      imagePath: null,
      imageAlt: locale === "ar" ? "Coach Milos — تدريب في الصالة" : "Coach Milos — cable training in the gym",
    },
    coach: {
      eyebrow: home.coach.eyebrow,
      headline: home.coach.headline,
      headlineHighlight: home.coach.headlineHighlight,
      paragraphs: coachParagraphs,
      highlight: home.coach.highlight,
      stats: coachStats,
      imagePath: null,
      imageAlt: "Coach Milos",
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

function asStats(value: unknown, fallback: StatItem[]): StatItem[] {
  if (!Array.isArray(value)) return fallback;
  const stats = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const statValue = asString(item.value, "").trim();
      const label = asString(item.label, "").trim();
      if (!statValue || !label) return null;
      return { value: statValue, label };
    })
    .filter((item): item is StatItem => item !== null);
  return stats.length > 0 ? stats : fallback;
}

function parseHero(raw: unknown, defaults: HomepageHeroContent): HomepageHeroContent {
  if (!isRecord(raw)) return defaults;
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headline: asString(raw.headline, defaults.headline),
    headlineEnergy: asString(raw.headlineEnergy, defaults.headlineEnergy),
    headlineSuffix: asString(raw.headlineSuffix, defaults.headlineSuffix),
    subhead: asString(raw.subhead, defaults.subhead),
    pills: asStringArray(raw.pills, defaults.pills),
    trust: asStringArray(raw.trust, defaults.trust),
    imagePath: typeof raw.imagePath === "string" ? raw.imagePath : raw.imagePath === null ? null : defaults.imagePath,
    imageAlt: asString(raw.imageAlt, defaults.imageAlt),
  };
}

function parseCoach(raw: unknown, defaults: HomepageCoachContent): HomepageCoachContent {
  if (!isRecord(raw)) return defaults;
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headline: asString(raw.headline, defaults.headline),
    headlineHighlight: asString(raw.headlineHighlight, defaults.headlineHighlight),
    paragraphs: asStringArray(raw.paragraphs, defaults.paragraphs),
    highlight: asString(raw.highlight, defaults.highlight),
    stats: asStats(raw.stats, defaults.stats),
    imagePath: typeof raw.imagePath === "string" ? raw.imagePath : raw.imagePath === null ? null : defaults.imagePath,
    imageAlt: asString(raw.imageAlt, defaults.imageAlt),
  };
}

export function parseHomepageCmsPayload(raw: unknown, locale: HomepageLocale): HomepageCmsPayload {
  const defaults = getDefaultHomepageCms(locale);
  if (!isRecord(raw)) return defaults;
  return {
    hero: parseHero(raw.hero, defaults.hero),
    coach: parseCoach(raw.coach, defaults.coach),
  };
}

function rowFromDb(data: Record<string, unknown>, locale: HomepageLocale): HomepageContentRow {
  const defaults = getDefaultHomepageCms(locale);
  return {
    locale,
    draft: parseHomepageCmsPayload(data.draft, locale),
    published: parseHomepageCmsPayload(data.published, locale),
    review_status: (data.review_status as HomepageReviewStatus) ?? "draft",
    review_requested_at: typeof data.review_requested_at === "string" ? data.review_requested_at : null,
    published_at: typeof data.published_at === "string" ? data.published_at : null,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : new Date().toISOString(),
    updated_by: typeof data.updated_by === "string" ? data.updated_by : null,
  };
}

export async function fetchPublishedHomepageCms(locale: HomepageLocale): Promise<HomepageCmsPayload | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc("get_published_homepage", { p_locale: locale });
  if (error || !data) return null;
  const parsed = parseHomepageCmsPayload(data, locale);
  const defaults = getDefaultHomepageCms(locale);
  const hasHero = isRecord(data) && isRecord(data.hero) && Object.keys(data.hero).length > 0;
  const hasCoach = isRecord(data) && isRecord(data.coach) && Object.keys(data.coach).length > 0;
  if (!hasHero && !hasCoach) return null;
  return parsed;
}

export async function fetchHomepageContentRow(locale: HomepageLocale): Promise<HomepageContentRow> {
  const defaults = getDefaultHomepageCms(locale);
  if (!isSupabaseConfigured) {
    return {
      locale,
      draft: defaults,
      published: defaults,
      review_status: "draft",
      review_requested_at: null,
      published_at: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
    };
  }

  const { data, error } = await supabase.from("homepage_content").select("*").eq("locale", locale).maybeSingle();
  if (error) throw error;
  if (!data) {
    return {
      locale,
      draft: defaults,
      published: defaults,
      review_status: "draft",
      review_requested_at: null,
      published_at: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
    };
  }
  return rowFromDb(data as Record<string, unknown>, locale);
}

export async function saveHomepageDraft(locale: HomepageLocale, draft: HomepageCmsPayload, userId: string | undefined) {
  const { error } = await supabase.from("homepage_content").upsert(
    {
      locale,
      draft,
      review_status: "draft",
      updated_by: userId ?? null,
    },
    { onConflict: "locale" }
  );
  if (error) throw error;
}

export async function requestHomepageReview(locale: HomepageLocale, draft: HomepageCmsPayload, userId: string | undefined) {
  const { error } = await supabase.from("homepage_content").upsert(
    {
      locale,
      draft,
      review_status: "pending_review",
      review_requested_at: new Date().toISOString(),
      updated_by: userId ?? null,
    },
    { onConflict: "locale" }
  );
  if (error) throw error;
}

export async function publishHomepageContent(locale: HomepageLocale, draft: HomepageCmsPayload, userId: string | undefined) {
  const now = new Date().toISOString();
  const { error } = await supabase.from("homepage_content").upsert(
    {
      locale,
      draft,
      published: draft,
      review_status: "published",
      published_at: now,
      updated_by: userId ?? null,
    },
    { onConflict: "locale" }
  );
  if (error) throw error;
}

export async function uploadHomepageImage(file: File, locale: HomepageLocale, slot: "hero" | "coach"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const safeExt = ["jpeg", "jpg", "png", "webp"].includes(ext) ? ext.replace("jpg", "jpeg") : "webp";
  const path = `${locale}/${slot}-${Date.now()}.${safeExt === "jpeg" ? "jpg" : safeExt}`;
  const { error } = await supabase.storage.from("homepage").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}

export type ResolvedHomepageHero = HomepageHeroContent;
export type ResolvedHomepageCoach = HomepageCoachContent;

export function resolveHomepageHero(
  cms: HomepageHeroContent | null | undefined,
  t: TFunction<"home">,
  fallbackImageAlt: string
): ResolvedHomepageHero {
  const pills = t("hero.pills", { returnObjects: true }) as string[];
  const trust = t("hero.trust", { returnObjects: true }) as string[];

  return {
    eyebrow: cms?.eyebrow || t("hero.eyebrow"),
    headline: cms?.headline || t("hero.headline"),
    headlineEnergy: cms?.headlineEnergy || t("hero.headlineEnergy"),
    headlineSuffix: cms?.headlineSuffix || t("hero.headlineSuffix"),
    subhead: cms?.subhead || t("hero.subhead"),
    pills: cms?.pills?.length ? cms.pills : pills,
    trust: cms?.trust?.length ? cms.trust : trust,
    imagePath: cms?.imagePath ?? null,
    imageAlt: cms?.imageAlt || fallbackImageAlt,
  };
}

export function resolveHomepageCoach(
  cms: HomepageCoachContent | null | undefined,
  t: TFunction<"home">
): ResolvedHomepageCoach {
  const paragraphs = t("coach.paragraphs", { returnObjects: true }) as string[];
  const stats = t("coach.stats", { returnObjects: true }) as StatItem[];

  return {
    eyebrow: cms?.eyebrow || t("coach.eyebrow"),
    headline: cms?.headline || t("coach.headline"),
    headlineHighlight: cms?.headlineHighlight || t("coach.headlineHighlight"),
    paragraphs: cms?.paragraphs?.length ? cms.paragraphs : paragraphs,
    highlight: cms?.highlight || t("coach.highlight"),
    stats: cms?.stats?.length ? cms.stats : stats,
    imagePath: cms?.imagePath ?? null,
    imageAlt: cms?.imageAlt || "Coach Milos",
  };
}

export function hasPublishedHomepageOverrides(payload: HomepageCmsPayload | null | undefined): boolean {
  if (!payload) return false;
  return Boolean(
    payload.hero.eyebrow ||
      payload.hero.headline ||
      payload.hero.imagePath ||
      payload.coach.eyebrow ||
      payload.coach.headline ||
      payload.coach.imagePath
  );
}
