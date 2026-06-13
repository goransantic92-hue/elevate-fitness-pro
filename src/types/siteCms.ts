import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";

export type SitePageKey =
  | "pricing"
  | "faq"
  | "handbooks"
  | "program"
  | "nutrition"
  | "coaching"
  | "member_dashboard"
  | "member_nutrition"
  | "member_roadmap"
  | "testimonials"
  | "member_workouts";

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

export type MemberDashboardCmsPayload = {
  gate: { title: string; description: string };
  home: { headline: string; subhead: string };
  training: { title: string; subhead: string };
  roadmap: { title: string; subhead: string; scheduleTitle: string; scheduleSubhead: string };
  progress: { title: string; headline: string; body: string; expectationsTitle: string; expectationsSubhead: string };
};

export type MemberMeal = { time: string; name: string; meal: string; macros: string; tip: string };
export type EatAnywherePlace = { place: string; tips: string[] };
export type SupplementItem = { name: string; dose: string; note: string };
export type SupplementWasteItem = { name: string; reason: string };

export type MemberNutritionCmsPayload = {
  title: string;
  subhead: string;
  rulesTitle: string;
  mealPlanTitle: string;
  mealPlanSubhead: string;
  eatAnywhereTitle: string;
  supplementsTitle: string;
  supplementsSubhead: string;
  essentialTitle: string;
  optionalTitle: string;
  wasteTitle: string;
  rules: NutritionRule[];
  meals: MemberMeal[];
  eatAnywhere: EatAnywherePlace[];
  rule9010: { title: string; body: string; quote: string };
  essential: SupplementItem[];
  optional: SupplementItem[];
  waste: SupplementWasteItem[];
};

export type MemberRoadmapCmsPayload = {
  title: string;
  subhead: string;
  scheduleTitle: string;
  scheduleSubhead: string;
  phases: ProgramPhase[];
  schedule: ProgramScheduleDay[];
};

export type TestimonialCmsItem = {
  id: string;
  name: string;
  videoPath: string | null;
  posterPath: string | null;
  enabled: boolean;
};

export type TestimonialsCmsPayload = {
  items: TestimonialCmsItem[];
};

export type WorkoutDemoClipCms = { label: string; path: string; startSec?: number };

export type ExerciseCms = {
  order: number;
  name: string;
  target: string;
  sets: string;
  reps: string;
  rest: string;
  tip: string;
  demoVideoPath?: string;
  demoVideoPaths?: WorkoutDemoClipCms[];
  demoVideoStartSec?: number;
};

export type WorkoutPlanCms = {
  id: "a" | "b" | "c";
  code: string;
  title: string;
  focus: string;
  warmup: string;
  exercises: ExerciseCms[];
  finisher: string;
};

export type EmergencyWorkoutRowCms = { exercise: string; sets: string; reps: string; rest: string };

export type EmergencyWorkoutCms = {
  id: string;
  name: string;
  time: string;
  rows: EmergencyWorkoutRowCms[];
};

export type MemberWorkoutsCmsPayload = {
  gym: Record<"a" | "b" | "c", WorkoutPlanCms>;
  home: Record<"a" | "b" | "c", WorkoutPlanCms>;
  emergency: EmergencyWorkoutCms[];
};

export type SiteCmsPayloadMap = {
  pricing: PricingCmsPayload;
  faq: FaqCmsPayload;
  handbooks: HandbooksCmsPayload;
  program: ProgramCmsPayload;
  nutrition: NutritionCmsPayload;
  coaching: CoachingCmsPayload;
  member_dashboard: MemberDashboardCmsPayload;
  member_nutrition: MemberNutritionCmsPayload;
  member_roadmap: MemberRoadmapCmsPayload;
  testimonials: TestimonialsCmsPayload;
  member_workouts: MemberWorkoutsCmsPayload;
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
  nutrition: "Nutrition (marketing)",
  coaching: "Coaching apply",
  member_dashboard: "Member app — dashboard copy",
  member_nutrition: "Member app — nutrition",
  member_roadmap: "Member app — roadmap",
  testimonials: "Testimonial videos",
  member_workouts: "Member app — workouts",
};

export const MEMBER_APP_PAGE_KEYS = ["member_dashboard", "member_nutrition", "member_roadmap"] as const;

export const MARKETING_SITE_PAGE_KEYS = [
  "pricing",
  "faq",
  "handbooks",
  "program",
  "nutrition",
  "coaching",
] as const satisfies readonly SitePageKey[];
