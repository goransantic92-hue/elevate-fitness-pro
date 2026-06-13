import { useTranslation } from "react-i18next";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveMemberWorkouts } from "@/lib/workoutCms";
import type { HomepageLocale } from "@/types/homepageCms";

export function useMemberWorkoutsCms() {
  const { i18n } = useTranslation();
  const locale: HomepageLocale = i18n.language.startsWith("ar") ? "ar" : "en";
  const { data, isLoading } = usePublishedSiteCms("member_workouts");
  const content = resolveMemberWorkouts(data ?? null, locale);
  return {
    gymWorkouts: content.gym,
    homeWorkouts: content.home,
    emergencyWorkouts: content.emergency,
    isLoading,
    locale,
  };
}
