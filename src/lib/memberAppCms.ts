import type { TFunction } from "i18next";
import arDashboard from "@/i18n/locales/ar/dashboard";
import arNutrition from "@/i18n/locales/ar/nutrition";
import arProgram from "@/i18n/locales/ar/program";
import enDashboard from "@/i18n/locales/en/dashboard";
import enNutrition from "@/i18n/locales/en/nutrition";
import enProgram from "@/i18n/locales/en/program";
import { testimonialVideos } from "@/data/testimonials";
import { asNullableString, asString, asStringArray, isRecord } from "@/lib/cmsUtils";
import { supabase } from "@/lib/supabase";
import type { TestimonialVideo } from "@/data/testimonials";
import type { HomepageLocale } from "@/types/homepageCms";
import type {
  MemberDashboardCmsPayload,
  MemberMeal,
  MemberNutritionCmsPayload,
  MemberRoadmapCmsPayload,
  NutritionRule,
  ProgramPhase,
  ProgramScheduleDay,
  SupplementItem,
  SupplementWasteItem,
  TestimonialCmsItem,
  TestimonialsCmsPayload,
} from "@/types/siteCms";

export function getDefaultMemberDashboard(locale: HomepageLocale): MemberDashboardCmsPayload {
  const d = locale === "ar" ? arDashboard : enDashboard;
  return {
    gate: { title: d.gate.title, description: d.gate.description },
    home: { headline: d.home.headline, subhead: d.home.subhead },
    training: { title: d.training.title, subhead: d.training.subhead },
    roadmap: {
      title: d.roadmap.title,
      subhead: d.roadmap.subhead,
      scheduleTitle: d.roadmap.scheduleTitle,
      scheduleSubhead: d.roadmap.scheduleSubhead,
    },
    progress: {
      title: d.progress.title,
      headline: d.progress.headline,
      body: d.progress.body,
      expectationsTitle: d.progress.expectationsTitle,
      expectationsSubhead: d.progress.expectationsSubhead,
    },
  };
}

export function getDefaultMemberNutrition(locale: HomepageLocale): MemberNutritionCmsPayload {
  const n = locale === "ar" ? arNutrition : enNutrition;
  return {
    title: n.member.title,
    subhead: n.member.subhead,
    rulesTitle: n.member.rulesTitle,
    mealPlanTitle: n.member.mealPlanTitle,
    mealPlanSubhead: n.member.mealPlanSubhead,
    eatAnywhereTitle: n.member.eatAnywhereTitle,
    supplementsTitle: n.member.supplementsTitle,
    supplementsSubhead: n.member.supplementsSubhead,
    essentialTitle: n.member.essentialTitle,
    optionalTitle: n.member.optionalTitle,
    wasteTitle: n.member.wasteTitle,
    rules: n.rules.items.map((r) => ({ ...r })),
    meals: n.meals.items.map((m) => ({ ...m })),
    eatAnywhere: n.eatAnywhere.items.map((item) => ({ place: item.place, tips: [...item.tips] })),
    rule9010: { ...n.eatAnywhere.rule9010 },
    essential: n.supplements.essential.map((s) => ({ ...s })),
    optional: n.supplements.optional.map((s) => ({ ...s })),
    waste: n.supplements.waste.map((s) => ({ ...s })),
  };
}

export function getDefaultMemberRoadmap(locale: HomepageLocale): MemberRoadmapCmsPayload {
  const d = locale === "ar" ? arDashboard : enDashboard;
  const p = locale === "ar" ? arProgram : enProgram;
  return {
    title: d.roadmap.title,
    subhead: d.roadmap.subhead,
    scheduleTitle: d.roadmap.scheduleTitle,
    scheduleSubhead: d.roadmap.scheduleSubhead,
    phases: p.phases.map((phase) => ({ ...phase, focus: [...phase.focus] })),
    schedule: p.schedule.items.map((item) => ({ ...item })),
  };
}

export function getDefaultTestimonials(): TestimonialsCmsPayload {
  return {
    items: testimonialVideos.map((t) => ({
      id: t.id,
      name: t.name,
      videoPath: t.videoPath,
      posterPath: t.posterPath,
      enabled: true,
    })),
  };
}

function parseNutritionRules(raw: unknown, fallback: NutritionRule[]): NutritionRule[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const number = asString(item.number, "").trim();
      const title = asString(item.title, "").trim();
      if (!number || !title) return null;
      return { number, title, body: asString(item.body, "") };
    })
    .filter((item): item is NutritionRule => item !== null);
  return items.length > 0 ? items : fallback;
}

function parsePhases(raw: unknown, fallback: ProgramPhase[]): ProgramPhase[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const number = asString(item.number, "").trim();
      const name = asString(item.name, "").trim();
      if (!number || !name) return null;
      return {
        number,
        name,
        weeks: asString(item.weeks, ""),
        description: asString(item.description, ""),
        focus: asStringArray(item.focus, []),
      };
    })
    .filter((item): item is ProgramPhase => item !== null);
  return items.length > 0 ? items : fallback;
}

function parseSchedule(raw: unknown, fallback: ProgramScheduleDay[]): ProgramScheduleDay[] {
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

function parseMeals(raw: unknown, fallback: MemberMeal[]): MemberMeal[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const name = asString(item.name, "").trim();
      if (!name) return null;
      return {
        time: asString(item.time, ""),
        name,
        meal: asString(item.meal, ""),
        macros: asString(item.macros, ""),
        tip: asString(item.tip, ""),
      };
    })
    .filter((item): item is MemberMeal => item !== null);
  return items.length > 0 ? items : fallback;
}

function parseSupplements(raw: unknown, fallback: SupplementItem[]): SupplementItem[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const name = asString(item.name, "").trim();
      if (!name) return null;
      return { name, dose: asString(item.dose, ""), note: asString(item.note, "") };
    })
    .filter((item): item is SupplementItem => item !== null);
  return items.length > 0 ? items : fallback;
}

function parseWaste(raw: unknown, fallback: SupplementWasteItem[]): SupplementWasteItem[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const name = asString(item.name, "").trim();
      if (!name) return null;
      return { name, reason: asString(item.reason, "") };
    })
    .filter((item): item is SupplementWasteItem => item !== null);
  return items.length > 0 ? items : fallback;
}

export function parseMemberDashboard(raw: unknown, locale: HomepageLocale): MemberDashboardCmsPayload {
  const d = getDefaultMemberDashboard(locale);
  if (!isRecord(raw)) return d;
  const gate = isRecord(raw.gate) ? raw.gate : {};
  const home = isRecord(raw.home) ? raw.home : {};
  const training = isRecord(raw.training) ? raw.training : {};
  const roadmap = isRecord(raw.roadmap) ? raw.roadmap : {};
  const progress = isRecord(raw.progress) ? raw.progress : {};
  return {
    gate: {
      title: asString(gate.title, d.gate.title),
      description: asString(gate.description, d.gate.description),
    },
    home: {
      headline: asString(home.headline, d.home.headline),
      subhead: asString(home.subhead, d.home.subhead),
    },
    training: {
      title: asString(training.title, d.training.title),
      subhead: asString(training.subhead, d.training.subhead),
    },
    roadmap: {
      title: asString(roadmap.title, d.roadmap.title),
      subhead: asString(roadmap.subhead, d.roadmap.subhead),
      scheduleTitle: asString(roadmap.scheduleTitle, d.roadmap.scheduleTitle),
      scheduleSubhead: asString(roadmap.scheduleSubhead, d.roadmap.scheduleSubhead),
    },
    progress: {
      title: asString(progress.title, d.progress.title),
      headline: asString(progress.headline, d.progress.headline),
      body: asString(progress.body, d.progress.body),
      expectationsTitle: asString(progress.expectationsTitle, d.progress.expectationsTitle),
      expectationsSubhead: asString(progress.expectationsSubhead, d.progress.expectationsSubhead),
    },
  };
}

export function parseMemberNutrition(raw: unknown, locale: HomepageLocale): MemberNutritionCmsPayload {
  const d = getDefaultMemberNutrition(locale);
  if (!isRecord(raw)) return d;
  const rule9010 = isRecord(raw.rule9010) ? raw.rule9010 : {};
  return {
    title: asString(raw.title, d.title),
    subhead: asString(raw.subhead, d.subhead),
    rulesTitle: asString(raw.rulesTitle, d.rulesTitle),
    mealPlanTitle: asString(raw.mealPlanTitle, d.mealPlanTitle),
    mealPlanSubhead: asString(raw.mealPlanSubhead, d.mealPlanSubhead),
    eatAnywhereTitle: asString(raw.eatAnywhereTitle, d.eatAnywhereTitle),
    supplementsTitle: asString(raw.supplementsTitle, d.supplementsTitle),
    supplementsSubhead: asString(raw.supplementsSubhead, d.supplementsSubhead),
    essentialTitle: asString(raw.essentialTitle, d.essentialTitle),
    optionalTitle: asString(raw.optionalTitle, d.optionalTitle),
    wasteTitle: asString(raw.wasteTitle, d.wasteTitle),
    rules: parseNutritionRules(raw.rules, d.rules),
    meals: parseMeals(raw.meals, d.meals),
    eatAnywhere: Array.isArray(raw.eatAnywhere)
      ? (raw.eatAnywhere as unknown[])
          .map((item) => {
            if (!isRecord(item)) return null;
            const place = asString(item.place, "").trim();
            if (!place) return null;
            return { place, tips: asStringArray(item.tips, []) };
          })
          .filter((x): x is { place: string; tips: string[] } => x !== null)
      : d.eatAnywhere,
    rule9010: {
      title: asString(rule9010.title, d.rule9010.title),
      body: asString(rule9010.body, d.rule9010.body),
      quote: asString(rule9010.quote, d.rule9010.quote),
    },
    essential: parseSupplements(raw.essential, d.essential),
    optional: parseSupplements(raw.optional, d.optional),
    waste: parseWaste(raw.waste, d.waste),
  };
}

export function parseMemberRoadmap(raw: unknown, locale: HomepageLocale): MemberRoadmapCmsPayload {
  const d = getDefaultMemberRoadmap(locale);
  if (!isRecord(raw)) return d;
  return {
    title: asString(raw.title, d.title),
    subhead: asString(raw.subhead, d.subhead),
    scheduleTitle: asString(raw.scheduleTitle, d.scheduleTitle),
    scheduleSubhead: asString(raw.scheduleSubhead, d.scheduleSubhead),
    phases: parsePhases(raw.phases, d.phases),
    schedule: parseSchedule(raw.schedule, d.schedule),
  };
}

export function parseTestimonialsCms(raw: unknown): TestimonialsCmsPayload {
  const d = getDefaultTestimonials();
  if (!isRecord(raw) || !Array.isArray(raw.items)) return d;
  const items = raw.items
    .map((item) => {
      if (!isRecord(item)) return null;
      const id = asString(item.id, "").trim();
      const name = asString(item.name, "").trim();
      if (!id || !name) return null;
      return {
        id,
        name,
        videoPath: asNullableString(item.videoPath, null),
        posterPath: asNullableString(item.posterPath, null),
        enabled: item.enabled !== false,
      };
    })
    .filter((item): item is TestimonialCmsItem => item !== null);
  return { items: items.length > 0 ? items : d.items };
}

function overlayText(value: string, fallback: string): string {
  return value.trim() || fallback;
}

export function resolveMemberDashboardCms(
  cms: MemberDashboardCmsPayload | null | undefined,
  locale: HomepageLocale
): MemberDashboardCmsPayload {
  const d = getDefaultMemberDashboard(locale);
  if (!cms) return d;
  return {
    gate: {
      title: overlayText(cms.gate.title, d.gate.title),
      description: overlayText(cms.gate.description, d.gate.description),
    },
    home: {
      headline: overlayText(cms.home.headline, d.home.headline),
      subhead: overlayText(cms.home.subhead, d.home.subhead),
    },
    training: {
      title: overlayText(cms.training.title, d.training.title),
      subhead: overlayText(cms.training.subhead, d.training.subhead),
    },
    roadmap: {
      title: overlayText(cms.roadmap.title, d.roadmap.title),
      subhead: overlayText(cms.roadmap.subhead, d.roadmap.subhead),
      scheduleTitle: overlayText(cms.roadmap.scheduleTitle, d.roadmap.scheduleTitle),
      scheduleSubhead: overlayText(cms.roadmap.scheduleSubhead, d.roadmap.scheduleSubhead),
    },
    progress: {
      title: overlayText(cms.progress.title, d.progress.title),
      headline: overlayText(cms.progress.headline, d.progress.headline),
      body: overlayText(cms.progress.body, d.progress.body),
      expectationsTitle: overlayText(cms.progress.expectationsTitle, d.progress.expectationsTitle),
      expectationsSubhead: overlayText(cms.progress.expectationsSubhead, d.progress.expectationsSubhead),
    },
  };
}

export function resolveMemberNutritionCms(
  cms: MemberNutritionCmsPayload | null | undefined,
  locale: HomepageLocale
): MemberNutritionCmsPayload {
  const d = getDefaultMemberNutrition(locale);
  if (!cms) return d;
  return {
    title: overlayText(cms.title, d.title),
    subhead: overlayText(cms.subhead, d.subhead),
    rulesTitle: overlayText(cms.rulesTitle, d.rulesTitle),
    mealPlanTitle: overlayText(cms.mealPlanTitle, d.mealPlanTitle),
    mealPlanSubhead: overlayText(cms.mealPlanSubhead, d.mealPlanSubhead),
    eatAnywhereTitle: overlayText(cms.eatAnywhereTitle, d.eatAnywhereTitle),
    supplementsTitle: overlayText(cms.supplementsTitle, d.supplementsTitle),
    supplementsSubhead: overlayText(cms.supplementsSubhead, d.supplementsSubhead),
    essentialTitle: overlayText(cms.essentialTitle, d.essentialTitle),
    optionalTitle: overlayText(cms.optionalTitle, d.optionalTitle),
    wasteTitle: overlayText(cms.wasteTitle, d.wasteTitle),
    rules: cms.rules.length ? cms.rules : d.rules,
    meals: cms.meals.length ? cms.meals : d.meals,
    eatAnywhere: cms.eatAnywhere.length ? cms.eatAnywhere : d.eatAnywhere,
    rule9010: {
      title: overlayText(cms.rule9010.title, d.rule9010.title),
      body: overlayText(cms.rule9010.body, d.rule9010.body),
      quote: overlayText(cms.rule9010.quote, d.rule9010.quote),
    },
    essential: cms.essential.length ? cms.essential : d.essential,
    optional: cms.optional.length ? cms.optional : d.optional,
    waste: cms.waste.length ? cms.waste : d.waste,
  };
}

export function resolveMemberRoadmapCms(
  cms: MemberRoadmapCmsPayload | null | undefined,
  locale: HomepageLocale
): MemberRoadmapCmsPayload {
  const d = getDefaultMemberRoadmap(locale);
  if (!cms) return d;
  return {
    title: overlayText(cms.title, d.title),
    subhead: overlayText(cms.subhead, d.subhead),
    scheduleTitle: overlayText(cms.scheduleTitle, d.scheduleTitle),
    scheduleSubhead: overlayText(cms.scheduleSubhead, d.scheduleSubhead),
    phases: cms.phases.length ? cms.phases : d.phases,
    schedule: cms.schedule.length ? cms.schedule : d.schedule,
  };
}

export function resolveTestimonialsCms(cms: TestimonialsCmsPayload | null | undefined): TestimonialVideo[] {
  const defaults = testimonialVideos;
  if (!cms?.items.length) return defaults;
  const enabled = cms.items.filter((item) => item.enabled);
  if (!enabled.length) return defaults;
  return enabled.map((item) => {
    const fallback = defaults.find((t) => t.id === item.id);
    return {
      id: item.id,
      name: item.name,
      videoPath: item.videoPath ?? fallback?.videoPath ?? `videos/${item.id}.mp4`,
      posterPath: item.posterPath ?? fallback?.posterPath ?? `posters/${item.id}.jpg`,
    };
  });
}

export async function uploadTestimonialFile(
  file: File,
  folder: "videos" | "posters",
  itemId: string
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || (folder === "videos" ? "mp4" : "jpg");
  const safeExt =
    folder === "videos"
      ? ["mp4", "webm", "mov"].includes(ext)
        ? ext
        : "mp4"
      : ["jpeg", "jpg", "png", "webp"].includes(ext)
        ? ext.replace("jpg", "jpeg")
        : "jpg";
  const path = `${folder}/${itemId}-${Date.now()}.${safeExt === "jpeg" ? "jpg" : safeExt}`;
  const { error } = await supabase.storage.from("testimonials").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}
