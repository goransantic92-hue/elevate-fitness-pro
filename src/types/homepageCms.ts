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

export type HomepageWhoCard = { title: string; text: string };

export type HomepageWhoContent = {
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  headlineSuffix: string;
  body: string;
  mostCommon: string;
  cards: {
    fathers: HomepageWhoCard;
    founders: HomepageWhoCard;
    professionals: HomepageWhoCard;
  };
};

export type HomepageTierCard = {
  tier: string;
  name: string;
  benefits: string[];
  cta: string;
  recommended?: string;
  recommendedNote?: string;
};

export type HomepageTiersContent = {
  eyebrow: string;
  headlinePrefix: string;
  headlineProgram: string;
  headlineMiddle: string;
  headlineCoach: string;
  subhead: string;
  selfGuided: HomepageTierCard;
  coached: HomepageTierCard;
  elite: HomepageTierCard;
};

export type HomepagePillar = { num: string; title: string; text: string };

export type HomepagePillarsContent = {
  eyebrow: string;
  headlinePrefix: string;
  headlineBrand: string;
  subhead: string;
  items: HomepagePillar[];
};

export type HomepageSectionHeaders = {
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  subhead: string;
};

export type HomepageFinalCtaContent = {
  headline: string;
  headlineHighlight: string;
  body: string;
};

export type HomepageCmsPayload = {
  hero: HomepageHeroContent;
  stats: HomepageStat[];
  who: HomepageWhoContent;
  tiers: HomepageTiersContent;
  pillars: HomepagePillarsContent;
  coach: HomepageCoachContent;
  testimonials: HomepageSectionHeaders;
  faq: HomepageSectionHeaders;
  finalCta: HomepageFinalCtaContent;
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
