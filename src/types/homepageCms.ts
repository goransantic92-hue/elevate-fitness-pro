export type HomepageStat = { value: string; label: string };

export type HomepageHeroContent = {
  eyebrow: string;
  headline: string;
  headlineEnergy: string;
  headlineSuffix: string;
  subhead: string;
  pills: string[];
  trust: string[];
  imagePath: string | null;
  imageAlt: string;
};

export type HomepageCoachContent = {
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  paragraphs: string[];
  highlight: string;
  stats: HomepageStat[];
  imagePath: string | null;
  imageAlt: string;
};

export type HomepageCmsPayload = {
  hero: HomepageHeroContent;
  coach: HomepageCoachContent;
};

export type HomepageLocale = "en" | "ar";

export type HomepageReviewStatus = "draft" | "pending_review" | "published";

export type HomepageContentRow = {
  locale: HomepageLocale;
  draft: HomepageCmsPayload;
  published: HomepageCmsPayload;
  review_status: HomepageReviewStatus;
  review_requested_at: string | null;
  published_at: string | null;
  updated_at: string;
  updated_by: string | null;
};
