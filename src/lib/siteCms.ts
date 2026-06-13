import type { TFunction } from "i18next";
import arCoaching from "@/i18n/locales/ar/coaching";
import arFaq from "@/i18n/locales/ar/faq";
import arHandbooks from "@/i18n/locales/ar/handbooks";
import arNutrition from "@/i18n/locales/ar/nutrition";
import arPricing from "@/i18n/locales/ar/pricing";
import arProgram from "@/i18n/locales/ar/program";
import enCoaching from "@/i18n/locales/en/coaching";
import enFaq from "@/i18n/locales/en/faq";
import enHandbooks from "@/i18n/locales/en/handbooks";
import enNutrition from "@/i18n/locales/en/nutrition";
import enPricing from "@/i18n/locales/en/pricing";
import enProgram from "@/i18n/locales/en/program";
import { HANDBOOK_IDS } from "@/lib/handbooks";
import {
  asNullableString,
  asString,
  asStringArray,
  hasPublishedPayload,
  isRecord,
} from "@/lib/cmsUtils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";
import type {
  CoachingCmsPayload,
  FaqCmsPayload,
  FaqItem,
  HandbooksCmsPayload,
  NutritionCmsPayload,
  PricingCmsPayload,
  PricingTestimonial,
  ProgramCmsPayload,
  ProgramPhase,
  ProgramScheduleDay,
  SiteContentRow,
  SiteCmsPayloadMap,
  SitePageKey,
} from "@/types/siteCms";

export function getDefaultSiteCms<K extends SitePageKey>(pageKey: K, locale: HomepageLocale): SiteCmsPayloadMap[K] {
  const isAr = locale === "ar";

  if (pageKey === "pricing") {
    const p = isAr ? arPricing : enPricing;
    return {
      hero: { ...p.hero },
      launchBadge: p.launchBadge,
      features: [...p.features],
      testimonials: p.testimonials.map((t) => ({ ...t })),
      coachQuote: { ...p.coachQuote },
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "faq") {
    const f = isAr ? arFaq : enFaq;
    return {
      page: { ...f.page },
      items: f.items.map((item) => ({ ...item })),
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "handbooks") {
    const h = isAr ? arHandbooks : enHandbooks;
    const items: HandbooksCmsPayload["items"] = {};
    for (const id of HANDBOOK_IDS) {
      const item = h.items[id];
      items[id] = {
        title: item.title,
        description: item.description,
        imageAlt: item.imageAlt,
        imagePath: null,
      };
    }
    return {
      eyebrow: h.eyebrow,
      title: h.title,
      subhead: h.subhead,
      items,
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "program") {
    const p = isAr ? arProgram : enProgram;
    return {
      hero: { ...p.hero },
      phases: p.phases.map((phase) => ({ ...phase, focus: [...phase.focus] })),
      schedule: {
        title: p.schedule.title,
        titleHighlight: p.schedule.titleHighlight,
        subhead: p.schedule.subhead,
        items: p.schedule.items.map((item) => ({ ...item })),
      },
      included: {
        title: p.included.title,
        titleHighlight: p.included.titleHighlight,
        items: [...p.included.items],
        cta: p.included.cta,
      },
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "nutrition") {
    const n = isAr ? arNutrition : enNutrition;
    return {
      hero: { ...n.hero },
      rules: {
        title: n.rules.title,
        titleHighlight: n.rules.titleHighlight,
        titleSuffix: n.rules.titleSuffix,
        items: n.rules.items.map((item) => ({ ...item })),
      },
    } as SiteCmsPayloadMap[K];
  }

  const c = isAr ? arCoaching : enCoaching;
  return {
    heading: { ...c.heading },
    trust: [c.trust.limitedSpots, c.trust.noCommitment, c.trust.personalized],
  } as SiteCmsPayloadMap[K];
}

function parseFaqItems(raw: unknown, fallback: FaqItem[]): FaqItem[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const q = asString(item.q, "").trim();
      const a = asString(item.a, "").trim();
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is FaqItem => item !== null);
  return items.length > 0 ? items : fallback;
}

function parseTestimonials(raw: unknown, fallback: PricingTestimonial[]): PricingTestimonial[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const quote = asString(item.quote, "").trim();
      const name = asString(item.name, "").trim();
      const sub = asString(item.sub, "").trim();
      if (!quote || !name) return null;
      return { quote, name, sub };
    })
    .filter((item): item is PricingTestimonial => item !== null);
  return items.length > 0 ? items : fallback;
}

function parsePhases(raw: unknown, fallback: ProgramPhase[]): ProgramPhase[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const number = asString(item.number, "").trim();
      const name = asString(item.name, "").trim();
      const weeks = asString(item.weeks, "").trim();
      const description = asString(item.description, "").trim();
      const focus = asStringArray(item.focus, []);
      if (!number || !name) return null;
      return { number, name, weeks, description, focus };
    })
    .filter((item): item is ProgramPhase => item !== null);
  return items.length > 0 ? items : fallback;
}

function parseScheduleItems(raw: unknown, fallback: ProgramScheduleDay[]): ProgramScheduleDay[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const day = asString(item.day, "").trim();
      const session = asString(item.session, "").trim();
      if (!day || !session) return null;
      return {
        day,
        session,
        duration: asString(item.duration, ""),
        focus: asString(item.focus, ""),
        note: asString(item.note, ""),
      };
    })
    .filter((item): item is ProgramScheduleDay => item !== null);
  return items.length > 0 ? items : fallback;
}

export function parseSiteCmsPayload<K extends SitePageKey>(
  pageKey: K,
  raw: unknown,
  locale: HomepageLocale
): SiteCmsPayloadMap[K] {
  const defaults = getDefaultSiteCms(pageKey, locale);
  if (!isRecord(raw)) return defaults;

  if (pageKey === "pricing") {
    const d = defaults as PricingCmsPayload;
    const hero = isRecord(raw.hero) ? raw.hero : {};
    const coachQuote = isRecord(raw.coachQuote) ? raw.coachQuote : {};
    return {
      hero: {
        eyebrow: asString(hero.eyebrow, d.hero.eyebrow),
        headline: asString(hero.headline, d.hero.headline),
        headlineHighlight: asString(hero.headlineHighlight, d.hero.headlineHighlight),
        subhead: asString(hero.subhead, d.hero.subhead),
      },
      launchBadge: asString(raw.launchBadge, d.launchBadge),
      features: asStringArray(raw.features, d.features),
      testimonials: parseTestimonials(raw.testimonials, d.testimonials),
      coachQuote: {
        text: asString(coachQuote.text, d.coachQuote.text),
        attribution: asString(coachQuote.attribution, d.coachQuote.attribution),
      },
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "faq") {
    const d = defaults as FaqCmsPayload;
    const page = isRecord(raw.page) ? raw.page : {};
    return {
      page: {
        eyebrow: asString(page.eyebrow, d.page.eyebrow),
        headline: asString(page.headline, d.page.headline),
        headlineHighlight: asString(page.headlineHighlight, d.page.headlineHighlight),
        subhead: asString(page.subhead, d.page.subhead),
      },
      items: parseFaqItems(raw.items, d.items),
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "handbooks") {
    const d = defaults as HandbooksCmsPayload;
    const rawItems = isRecord(raw.items) ? raw.items : {};
    const items = { ...d.items };
    for (const id of HANDBOOK_IDS) {
      const item = rawItems[id];
      if (isRecord(item)) {
        items[id] = {
          title: asString(item.title, d.items[id]?.title ?? ""),
          description: asString(item.description, d.items[id]?.description ?? ""),
          imageAlt: asString(item.imageAlt, d.items[id]?.imageAlt ?? ""),
          imagePath: asNullableString(item.imagePath, d.items[id]?.imagePath ?? null),
        };
      }
    }
    return {
      eyebrow: asString(raw.eyebrow, d.eyebrow),
      title: asString(raw.title, d.title),
      subhead: asString(raw.subhead, d.subhead),
      items,
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "program") {
    const d = defaults as ProgramCmsPayload;
    const hero = isRecord(raw.hero) ? raw.hero : {};
    const schedule = isRecord(raw.schedule) ? raw.schedule : {};
    const included = isRecord(raw.included) ? raw.included : {};
    return {
      hero: {
        eyebrow: asString(hero.eyebrow, d.hero.eyebrow),
        headline: asString(hero.headline, d.hero.headline),
        headlineHighlight: asString(hero.headlineHighlight, d.hero.headlineHighlight),
        subhead: asString(hero.subhead, d.hero.subhead),
      },
      phases: parsePhases(raw.phases, d.phases),
      schedule: {
        title: asString(schedule.title, d.schedule.title),
        titleHighlight: asString(schedule.titleHighlight, d.schedule.titleHighlight),
        subhead: asString(schedule.subhead, d.schedule.subhead),
        items: parseScheduleItems(schedule.items, d.schedule.items),
      },
      included: {
        title: asString(included.title, d.included.title),
        titleHighlight: asString(included.titleHighlight, d.included.titleHighlight),
        items: asStringArray(included.items, d.included.items),
        cta: asString(included.cta, d.included.cta),
      },
    } as SiteCmsPayloadMap[K];
  }

  if (pageKey === "nutrition") {
    const d = defaults as NutritionCmsPayload;
    const hero = isRecord(raw.hero) ? raw.hero : {};
    const rules = isRecord(raw.rules) ? raw.rules : {};
    const ruleItems = Array.isArray(rules.items)
      ? rules.items
          .map((item) => {
            if (!isRecord(item)) return null;
            const number = asString(item.number, "").trim();
            const title = asString(item.title, "").trim();
            const body = asString(item.body, "").trim();
            if (!number || !title) return null;
            return { number, title, body };
          })
          .filter((item): item is NutritionCmsPayload["rules"]["items"][number] => item !== null)
      : d.rules.items;
    return {
      hero: {
        eyebrow: asString(hero.eyebrow, d.hero.eyebrow),
        headline: asString(hero.headline, d.hero.headline),
        headlineHighlight: asString(hero.headlineHighlight, d.hero.headlineHighlight),
        subhead: asString(hero.subhead, d.hero.subhead),
      },
      rules: {
        title: asString(rules.title, d.rules.title),
        titleHighlight: asString(rules.titleHighlight, d.rules.titleHighlight),
        titleSuffix: asString(rules.titleSuffix, d.rules.titleSuffix),
        items: ruleItems.length > 0 ? ruleItems : d.rules.items,
      },
    } as SiteCmsPayloadMap[K];
  }

  const d = defaults as CoachingCmsPayload;
  const heading = isRecord(raw.heading) ? raw.heading : {};
  return {
    heading: {
      eyebrow: asString(heading.eyebrow, d.heading.eyebrow),
      title: asString(heading.title, d.heading.title),
      titleHighlight: asString(heading.titleHighlight, d.heading.titleHighlight),
      body: asString(heading.body, d.heading.body),
    },
    trust: asStringArray(raw.trust, d.trust),
  } as SiteCmsPayloadMap[K];
}

function rowFromDb<K extends SitePageKey>(
  data: Record<string, unknown>,
  pageKey: K,
  locale: HomepageLocale
): SiteContentRow<K> {
  return {
    page_key: pageKey,
    locale,
    draft: parseSiteCmsPayload(pageKey, data.draft, locale),
    published: parseSiteCmsPayload(pageKey, data.published, locale),
    review_status: (data.review_status as HomepageReviewStatus) ?? "draft",
    review_requested_at: typeof data.review_requested_at === "string" ? data.review_requested_at : null,
    published_at: typeof data.published_at === "string" ? data.published_at : null,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : new Date().toISOString(),
    updated_by: typeof data.updated_by === "string" ? data.updated_by : null,
  };
}

export async function fetchPublishedSiteCms<K extends SitePageKey>(
  pageKey: K,
  locale: HomepageLocale
): Promise<SiteCmsPayloadMap[K] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc("get_published_site_content", {
    p_page_key: pageKey,
    p_locale: locale,
  });
  if (error || !data || !hasPublishedPayload(data)) return null;
  return parseSiteCmsPayload(pageKey, data, locale);
}

export async function fetchSiteContentRow<K extends SitePageKey>(
  pageKey: K,
  locale: HomepageLocale
): Promise<SiteContentRow<K>> {
  const defaults = getDefaultSiteCms(pageKey, locale);
  if (!isSupabaseConfigured) {
    return {
      page_key: pageKey,
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

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page_key", pageKey)
    .eq("locale", locale)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    return {
      page_key: pageKey,
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
  return rowFromDb(data as Record<string, unknown>, pageKey, locale);
}

export async function saveSiteDraft<K extends SitePageKey>(
  pageKey: K,
  locale: HomepageLocale,
  draft: SiteCmsPayloadMap[K],
  userId: string | undefined
) {
  const { error } = await supabase.from("site_content").upsert(
    {
      page_key: pageKey,
      locale,
      draft,
      review_status: "draft",
      updated_by: userId ?? null,
    },
    { onConflict: "page_key,locale" }
  );
  if (error) throw error;
}

export async function requestSiteReview<K extends SitePageKey>(
  pageKey: K,
  locale: HomepageLocale,
  draft: SiteCmsPayloadMap[K],
  userId: string | undefined
) {
  const { error } = await supabase.from("site_content").upsert(
    {
      page_key: pageKey,
      locale,
      draft,
      review_status: "pending_review",
      review_requested_at: new Date().toISOString(),
      updated_by: userId ?? null,
    },
    { onConflict: "page_key,locale" }
  );
  if (error) throw error;
}

export async function publishSiteContent<K extends SitePageKey>(
  pageKey: K,
  locale: HomepageLocale,
  draft: SiteCmsPayloadMap[K],
  userId: string | undefined
) {
  const now = new Date().toISOString();
  const { error } = await supabase.from("site_content").upsert(
    {
      page_key: pageKey,
      locale,
      draft,
      published: draft,
      review_status: "published",
      published_at: now,
      updated_by: userId ?? null,
    },
    { onConflict: "page_key,locale" }
  );
  if (error) throw error;
}

export async function uploadSiteImage(file: File, locale: HomepageLocale, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const safeExt = ["jpeg", "jpg", "png", "webp"].includes(ext) ? ext.replace("jpg", "jpeg") : "webp";
  const path = `${locale}/${folder}-${Date.now()}.${safeExt === "jpeg" ? "jpg" : safeExt}`;
  const { error } = await supabase.storage.from("homepage").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

export function resolvePricingCms(cms: PricingCmsPayload | null | undefined, t: TFunction<"pricing">): PricingCmsPayload {
  const hero = {
    eyebrow: t("hero.eyebrow"),
    headline: t("hero.headline"),
    headlineHighlight: t("hero.headlineHighlight"),
    subhead: t("hero.subhead"),
  };
  if (!cms) {
    return {
      hero,
      launchBadge: t("launchBadge"),
      features: t("features", { returnObjects: true }) as string[],
      testimonials: t("testimonials", { returnObjects: true }) as PricingTestimonial[],
      coachQuote: t("coachQuote", { returnObjects: true }) as PricingCmsPayload["coachQuote"],
    };
  }
  return {
    hero: { ...hero, ...cms.hero },
    launchBadge: cms.launchBadge || t("launchBadge"),
    features: cms.features.length ? cms.features : (t("features", { returnObjects: true }) as string[]),
    testimonials: cms.testimonials.length
      ? cms.testimonials
      : (t("testimonials", { returnObjects: true }) as PricingTestimonial[]),
    coachQuote: cms.coachQuote.text ? cms.coachQuote : (t("coachQuote", { returnObjects: true }) as PricingCmsPayload["coachQuote"]),
  };
}

export function resolveFaqCms(cms: FaqCmsPayload | null | undefined, t: TFunction<"faq">): FaqCmsPayload {
  const page = t("page", { returnObjects: true }) as FaqCmsPayload["page"];
  const items = t("items", { returnObjects: true }) as FaqItem[];
  if (!cms) return { page, items };
  return {
    page: {
      eyebrow: cms.page.eyebrow || page.eyebrow,
      headline: cms.page.headline || page.headline,
      headlineHighlight: cms.page.headlineHighlight || page.headlineHighlight,
      subhead: cms.page.subhead || page.subhead,
    },
    items: cms.items.length ? cms.items : items,
  };
}

export function resolveHandbooksCms(cms: HandbooksCmsPayload | null | undefined, t: TFunction<"handbooks">): HandbooksCmsPayload {
  const items: HandbooksCmsPayload["items"] = {};
  for (const id of HANDBOOK_IDS) {
    items[id] = {
      title: t(`items.${id}.title`),
      description: t(`items.${id}.description`),
      imageAlt: t(`items.${id}.imageAlt`),
      imagePath: cms?.items[id]?.imagePath ?? null,
    };
    if (cms?.items[id]?.title) {
      items[id] = { ...items[id], ...cms.items[id] };
    }
  }
  return {
    eyebrow: cms?.eyebrow || t("eyebrow"),
    title: cms?.title || t("title"),
    subhead: cms?.subhead || t("subhead"),
    items,
  };
}

export function resolveProgramCms(cms: ProgramCmsPayload | null | undefined, t: TFunction<"program">): ProgramCmsPayload {
  if (!cms) {
    return {
      hero: t("hero", { returnObjects: true }) as ProgramCmsPayload["hero"],
      phases: t("phases", { returnObjects: true }) as ProgramPhase[],
      schedule: {
        title: t("schedule.title"),
        titleHighlight: t("schedule.titleHighlight"),
        subhead: t("schedule.subhead"),
        items: t("schedule.items", { returnObjects: true }) as ProgramScheduleDay[],
      },
      included: {
        title: t("included.title"),
        titleHighlight: t("included.titleHighlight"),
        items: t("included.items", { returnObjects: true }) as string[],
        cta: t("included.cta"),
      },
    };
  }
  const d = getDefaultSiteCms("program", "en");
  return {
    hero: cms.hero.headline ? cms.hero : d.hero,
    phases: cms.phases.length ? cms.phases : d.phases,
    schedule: cms.schedule.items.length ? cms.schedule : d.schedule,
    included: cms.included.items.length ? cms.included : d.included,
  };
}

export function resolveNutritionCms(cms: NutritionCmsPayload | null | undefined, t: TFunction<"nutrition">): NutritionCmsPayload {
  if (!cms) {
    return {
      hero: t("hero", { returnObjects: true }) as NutritionCmsPayload["hero"],
      rules: {
        title: t("rules.title"),
        titleHighlight: t("rules.titleHighlight"),
        titleSuffix: t("rules.titleSuffix"),
        items: t("rules.items", { returnObjects: true }) as NutritionCmsPayload["rules"]["items"],
      },
    };
  }
  const d = getDefaultSiteCms("nutrition", "en") as NutritionCmsPayload;
  return {
    hero: cms.hero.headline ? cms.hero : d.hero,
    rules: cms.rules.items.length ? cms.rules : d.rules,
  };
}

export function resolveCoachingCms(cms: CoachingCmsPayload | null | undefined, t: TFunction<"coaching">): CoachingCmsPayload {
  if (!cms) {
    return {
      heading: t("heading", { returnObjects: true }) as CoachingCmsPayload["heading"],
      trust: [t("trust.limitedSpots"), t("trust.noCommitment"), t("trust.personalized")],
    };
  }
  const heading = t("heading", { returnObjects: true }) as CoachingCmsPayload["heading"];
  const trust = [t("trust.limitedSpots"), t("trust.noCommitment"), t("trust.personalized")];
  return {
    heading: {
      eyebrow: cms.heading.eyebrow || heading.eyebrow,
      title: cms.heading.title || heading.title,
      titleHighlight: cms.heading.titleHighlight || heading.titleHighlight,
      body: cms.heading.body || heading.body,
    },
    trust: cms.trust.length ? cms.trust : trust,
  };
}
