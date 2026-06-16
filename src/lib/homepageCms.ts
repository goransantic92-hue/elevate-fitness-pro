import type { TFunction } from "i18next";
import arHome from "@/i18n/locales/ar/home";
import enHome from "@/i18n/locales/en/home";
import srHome from "@/i18n/locales/sr/home";
import {
  arrayToLines,
  asNullableString,
  asStats,
  asString,
  asStringArray,
  hasPublishedPayload,
  isRecord,
  linesToArray,
  type StatItem,
} from "@/lib/cmsUtils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  HomepageCoachContent,
  HomepageCmsPayload,
  HomepageContentRow,
  HomepageFinalCtaContent,
  HomepageHeroContent,
  HomepageLocale,
  HomepagePillar,
  HomepagePillarsContent,
  HomepageReviewStatus,
  HomepageSectionHeaders,
  HomepageTierCard,
  HomepageTiersContent,
  HomepageWhoCard,
  HomepageWhoContent,
} from "@/types/homepageCms";

export { arrayToLines, linesToArray } from "@/lib/cmsUtils";

function homeBundle(locale: HomepageLocale) {
  if (locale === "ar") return arHome;
  if (locale === "sr") return srHome;
  return enHome;
}

function cloneTierCard(card: HomepageTierCard): HomepageTierCard {
  return {
    ...card,
    benefits: [...card.benefits],
    ...(card.recommended ? { recommended: card.recommended } : {}),
    ...(card.recommendedNote ? { recommendedNote: card.recommendedNote } : {}),
  };
}

export function getDefaultHomepageCms(locale: HomepageLocale): HomepageCmsPayload {
  const home = homeBundle(locale);

  return {
    hero: {
      eyebrow: home.hero.eyebrow,
      headline: home.hero.headline,
      headlineEnergy: home.hero.headlineEnergy,
      headlineSuffix: home.hero.headlineSuffix,
      subhead: home.hero.subhead,
      pills: [...home.hero.pills],
      trust: [...home.hero.trust],
      imagePath: null,
      imageAlt:
        locale === "ar"
          ? "Coach Milos — تدريب في الصالة"
          : locale === "sr"
            ? "Coach Milos — trening u teretani"
            : "Coach Milos — cable training in the gym",
    },
    stats: home.stats.map((s) => ({ ...s })),
    who: {
      eyebrow: home.who.eyebrow,
      headline: home.who.headline,
      headlineHighlight: home.who.headlineHighlight,
      headlineSuffix: home.who.headlineSuffix,
      body: home.who.body,
      mostCommon: home.who.mostCommon,
      cards: {
        fathers: { ...home.who.cards.fathers },
        founders: { ...home.who.cards.founders },
        professionals: { ...home.who.cards.professionals },
      },
    },
    tiers: {
      eyebrow: home.tiers.eyebrow,
      headlinePrefix: home.tiers.headlinePrefix,
      headlineProgram: home.tiers.headlineProgram,
      headlineMiddle: home.tiers.headlineMiddle,
      headlineCoach: home.tiers.headlineCoach,
      subhead: home.tiers.subhead,
      selfGuided: cloneTierCard(home.tiers.selfGuided),
      coached: cloneTierCard(home.tiers.coached),
      elite: cloneTierCard(home.tiers.elite),
    },
    pillars: {
      eyebrow: home.pillars.eyebrow,
      headlinePrefix: home.pillars.headlinePrefix,
      headlineBrand: home.pillars.headlineBrand,
      subhead: home.pillars.subhead,
      items: home.pillars.items.map((p) => ({ ...p })),
    },
    coach: {
      eyebrow: home.coach.eyebrow,
      headline: home.coach.headline,
      headlineHighlight: home.coach.headlineHighlight,
      paragraphs: [...home.coach.paragraphs],
      highlight: home.coach.highlight,
      stats: home.coach.stats.map((s) => ({ ...s })),
      imagePath: null,
      imageAlt: "Coach Milos",
    },
    testimonials: { ...home.testimonials },
    faq: { ...home.faq },
    finalCta: { ...home.finalCta },
  };
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
    imagePath: asNullableString(raw.imagePath, defaults.imagePath),
    imageAlt: asString(raw.imageAlt, defaults.imageAlt),
  };
}

function parseWhoCard(raw: unknown, defaults: HomepageWhoCard): HomepageWhoCard {
  if (!isRecord(raw)) return defaults;
  return {
    title: asString(raw.title, defaults.title),
    text: asString(raw.text, defaults.text),
  };
}

function parseWho(raw: unknown, defaults: HomepageWhoContent): HomepageWhoContent {
  if (!isRecord(raw)) return defaults;
  const cards = isRecord(raw.cards) ? raw.cards : {};
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headline: asString(raw.headline, defaults.headline),
    headlineHighlight: asString(raw.headlineHighlight, defaults.headlineHighlight),
    headlineSuffix: asString(raw.headlineSuffix, defaults.headlineSuffix),
    body: asString(raw.body, defaults.body),
    mostCommon: asString(raw.mostCommon, defaults.mostCommon),
    cards: {
      fathers: parseWhoCard(cards.fathers, defaults.cards.fathers),
      founders: parseWhoCard(cards.founders, defaults.cards.founders),
      professionals: parseWhoCard(cards.professionals, defaults.cards.professionals),
    },
  };
}

function parseTierCard(raw: unknown, defaults: HomepageTierCard): HomepageTierCard {
  if (!isRecord(raw)) return defaults;
  return {
    tier: asString(raw.tier, defaults.tier),
    name: asString(raw.name, defaults.name),
    benefits: asStringArray(raw.benefits, defaults.benefits),
    cta: asString(raw.cta, defaults.cta),
    ...(defaults.recommended || raw.recommended
      ? { recommended: asString(raw.recommended, defaults.recommended ?? "") }
      : {}),
    ...(defaults.recommendedNote || raw.recommendedNote
      ? { recommendedNote: asString(raw.recommendedNote, defaults.recommendedNote ?? "") }
      : {}),
  };
}

function parseTiers(raw: unknown, defaults: HomepageTiersContent): HomepageTiersContent {
  if (!isRecord(raw)) return defaults;
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headlinePrefix: asString(raw.headlinePrefix, defaults.headlinePrefix),
    headlineProgram: asString(raw.headlineProgram, defaults.headlineProgram),
    headlineMiddle: asString(raw.headlineMiddle, defaults.headlineMiddle),
    headlineCoach: asString(raw.headlineCoach, defaults.headlineCoach),
    subhead: asString(raw.subhead, defaults.subhead),
    selfGuided: parseTierCard(raw.selfGuided, defaults.selfGuided),
    coached: parseTierCard(raw.coached, defaults.coached),
    elite: parseTierCard(raw.elite, defaults.elite),
  };
}

function parsePillars(raw: unknown, defaults: HomepagePillarsContent): HomepagePillarsContent {
  if (!isRecord(raw)) return defaults;
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((item) => {
          if (!isRecord(item)) return null;
          const num = asString(item.num, "").trim();
          const title = asString(item.title, "").trim();
          const text = asString(item.text, "").trim();
          if (!num || !title) return null;
          return { num, title, text };
        })
        .filter((item): item is HomepagePillar => item !== null)
    : defaults.items;
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headlinePrefix: asString(raw.headlinePrefix, defaults.headlinePrefix),
    headlineBrand: asString(raw.headlineBrand, defaults.headlineBrand),
    subhead: asString(raw.subhead, defaults.subhead),
    items: items.length > 0 ? items : defaults.items,
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
    imagePath: asNullableString(raw.imagePath, defaults.imagePath),
    imageAlt: asString(raw.imageAlt, defaults.imageAlt),
  };
}

function parseSectionHeaders(raw: unknown, defaults: HomepageSectionHeaders): HomepageSectionHeaders {
  if (!isRecord(raw)) return defaults;
  return {
    eyebrow: asString(raw.eyebrow, defaults.eyebrow),
    headline: asString(raw.headline, defaults.headline),
    headlineHighlight: asString(raw.headlineHighlight, defaults.headlineHighlight),
    subhead: asString(raw.subhead, defaults.subhead),
  };
}

function parseFinalCta(raw: unknown, defaults: HomepageFinalCtaContent): HomepageFinalCtaContent {
  if (!isRecord(raw)) return defaults;
  return {
    headline: asString(raw.headline, defaults.headline),
    headlineHighlight: asString(raw.headlineHighlight, defaults.headlineHighlight),
    body: asString(raw.body, defaults.body),
  };
}

export function parseHomepageCmsPayload(raw: unknown, locale: HomepageLocale): HomepageCmsPayload {
  const defaults = getDefaultHomepageCms(locale);
  if (!isRecord(raw)) return defaults;
  return {
    hero: parseHero(raw.hero, defaults.hero),
    stats: asStats(raw.stats, defaults.stats),
    who: parseWho(raw.who, defaults.who),
    tiers: parseTiers(raw.tiers, defaults.tiers),
    pillars: parsePillars(raw.pillars, defaults.pillars),
    coach: parseCoach(raw.coach, defaults.coach),
    testimonials: parseSectionHeaders(raw.testimonials, defaults.testimonials),
    faq: parseSectionHeaders(raw.faq, defaults.faq),
    finalCta: parseFinalCta(raw.finalCta, defaults.finalCta),
  };
}

function rowFromDb(data: Record<string, unknown>, locale: HomepageLocale): HomepageContentRow {
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
  if (error || !data || !hasPublishedPayload(data)) return null;
  return parseHomepageCmsPayload(data, locale);
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

export async function uploadHomepageImage(
  file: File,
  locale: HomepageLocale,
  slot: "hero" | "coach" | `handbooks/${string}`
): Promise<string> {
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

export function resolveHomepageHero(
  cms: HomepageHeroContent | null | undefined,
  t: TFunction<"home">,
  fallbackImageAlt: string
): HomepageHeroContent {
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
): HomepageCoachContent {
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

export function resolveHomepageStats(cms: StatItem[] | null | undefined, t: TFunction<"home">): StatItem[] {
  const defaults = t("stats", { returnObjects: true }) as StatItem[];
  return cms?.length ? cms : defaults;
}

export function resolveHomepageWho(cms: HomepageWhoContent | null | undefined, t: TFunction<"home">): HomepageWhoContent {
  const defaults = getDefaultHomepageCms("en");
  const who = t("who", { returnObjects: true }) as typeof defaults.who;
  if (!cms) {
    return {
      eyebrow: who.eyebrow,
      headline: who.headline,
      headlineHighlight: who.headlineHighlight,
      headlineSuffix: who.headlineSuffix,
      body: who.body,
      mostCommon: who.mostCommon,
      cards: {
        fathers: who.cards.fathers,
        founders: who.cards.founders,
        professionals: who.cards.professionals,
      },
    };
  }
  return {
    eyebrow: cms.eyebrow || who.eyebrow,
    headline: cms.headline || who.headline,
    headlineHighlight: cms.headlineHighlight || who.headlineHighlight,
    headlineSuffix: cms.headlineSuffix || who.headlineSuffix,
    body: cms.body || who.body,
    mostCommon: cms.mostCommon || who.mostCommon,
    cards: {
      fathers: cms.cards.fathers.title ? cms.cards.fathers : who.cards.fathers,
      founders: cms.cards.founders.title ? cms.cards.founders : who.cards.founders,
      professionals: cms.cards.professionals.title ? cms.cards.professionals : who.cards.professionals,
    },
  };
}

export function resolveHomepageTiers(cms: HomepageTiersContent | null | undefined, t: TFunction<"home">): HomepageTiersContent {
  const defaults = getDefaultHomepageCms("en");
  const tiers = t("tiers", { returnObjects: true }) as typeof defaults.tiers;
  if (!cms) return tiers;
  return {
    eyebrow: cms.eyebrow || tiers.eyebrow,
    headlinePrefix: cms.headlinePrefix || tiers.headlinePrefix,
    headlineProgram: cms.headlineProgram || tiers.headlineProgram,
    headlineMiddle: cms.headlineMiddle || tiers.headlineMiddle,
    headlineCoach: cms.headlineCoach || tiers.headlineCoach,
    subhead: cms.subhead || tiers.subhead,
    selfGuided: cms.selfGuided.name ? cms.selfGuided : tiers.selfGuided,
    coached: cms.coached.name ? cms.coached : tiers.coached,
    elite: cms.elite.name ? cms.elite : tiers.elite,
  };
}

export function resolveHomepagePillars(cms: HomepagePillarsContent | null | undefined, t: TFunction<"home">): HomepagePillarsContent {
  const defaults = getDefaultHomepageCms("en");
  const pillars = t("pillars", { returnObjects: true }) as typeof defaults.pillars;
  if (!cms) return pillars;
  return {
    eyebrow: cms.eyebrow || pillars.eyebrow,
    headlinePrefix: cms.headlinePrefix || pillars.headlinePrefix,
    headlineBrand: cms.headlineBrand || pillars.headlineBrand,
    subhead: cms.subhead || pillars.subhead,
    items: cms.items.length ? cms.items : pillars.items,
  };
}

export function resolveSectionHeaders(
  cms: HomepageSectionHeaders | null | undefined,
  t: TFunction<"home">,
  key: "testimonials" | "faq"
): HomepageSectionHeaders {
  const defaults = t(key, { returnObjects: true }) as HomepageSectionHeaders;
  if (!cms) return defaults;
  return {
    eyebrow: cms.eyebrow || defaults.eyebrow,
    headline: cms.headline || defaults.headline,
    headlineHighlight: cms.headlineHighlight || defaults.headlineHighlight,
    subhead: cms.subhead || defaults.subhead,
  };
}

export function resolveHomepageFinalCta(
  cms: HomepageFinalCtaContent | null | undefined,
  t: TFunction<"home">
): HomepageFinalCtaContent {
  const defaults = t("finalCta", { returnObjects: true }) as HomepageFinalCtaContent;
  if (!cms) return defaults;
  return {
    headline: cms.headline || defaults.headline,
    headlineHighlight: cms.headlineHighlight || defaults.headlineHighlight,
    body: cms.body || defaults.body,
  };
}
