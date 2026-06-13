import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";

export type SitePageKey = "pricing" | "faq" | "handbooks" | "program" | "nutrition" | "coaching";

export type FaqItem = { q: string; a: string };

export type PricingTestimonial = { quote: string; name: string; sub: string };

export type PricingCmsPayload = {
  hero: {
    eyebrow: string;
    headline: string;
    headlineHighlight: string;
    subhead: string;
  };
  launchBadge: string;
  features: string[];
  testimonials: PricingTestimonial[];
  coachQuote: { text: string; attribution: string };
};

export type FaqCmsPayload = {
  page: {
    eyebrow: string;
    headline: string;
    headlineHighlight: string;
    subhead: string;
  };
  items: FaqItem[];
};

export type HandbookItemCms = {
  title: string;
  description: string;
  imageAlt: string;
  imagePath: string | null;
};

export type HandbooksCmsPayload = {
  eyebrow: string;
  title: string;
  subhead: string;
  items: Record<string, HandbookItemCms>;
};

export type ProgramPhase = {
  number: string;
  name: string;
  weeks: string;
  description: string;
  focus: string[];
};

export type ProgramScheduleDay = {
  day: string;
  session: string;
  duration: string;
  focus: string;
  note: string;
};

export type ProgramCmsPayload = {
  hero: {
    eyebrow: string;
    headline: string;
    headlineHighlight: string;
    subhead: string;
  };
  phases: ProgramPhase[];
  schedule: {
    title: string;
    titleHighlight: string;
    subhead: string;
    items: ProgramScheduleDay[];
  };
  included: {
    title: string;
    titleHighlight: string;
    items: string[];
    cta: string;
  };
};

export type NutritionRule = { number: string; title: string; body: string };

export type NutritionCmsPayload = {
  hero: {
    eyebrow: string;
    headline: string;
    headlineHighlight: string;
    subhead: string;
  };
  rules: {
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    items: NutritionRule[];
  };
};

export type CoachingCmsPayload = {
  heading: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    body: string;
  };
  trust: string[];
};

export type SiteCmsPayloadMap = {
  pricing: PricingCmsPayload;
  faq: FaqCmsPayload;
  handbooks: HandbooksCmsPayload;
  program: ProgramCmsPayload;
  nutrition: NutritionCmsPayload;
  coaching: CoachingCmsPayload;
};

export type SiteContentRow<K extends SitePageKey = SitePageKey> = {
  page_key: K;
  locale: HomepageLocale;
  draft: SiteCmsPayloadMap[K];
  published: SiteCmsPayloadMap[K];
  review_status: HomepageReviewStatus;
  review_requested_at: string | null;
  published_at: string | null;
  updated_at: string;
  updated_by: string | null;
};

export const SITE_PAGE_LABELS: Record<SitePageKey, string> = {
  pricing: "Pricing",
  faq: "FAQ",
  handbooks: "Free handbooks",
  program: "Program",
  nutrition: "Nutrition",
  coaching: "Coaching apply",
};
