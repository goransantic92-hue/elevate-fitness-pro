import { useTranslation } from "react-i18next";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveHomepageLocale } from "@/i18n/constants";
import { resolveMemberWorkouts } from "@/lib/workoutCms";

export function useMemberWorkoutsCms() {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);
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
