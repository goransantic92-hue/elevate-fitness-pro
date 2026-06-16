import { useTranslation } from "react-i18next";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveHomepageLocale } from "@/i18n/constants";
import {
  resolveMemberDashboardCms,
  resolveMemberNutritionCms,
  resolveMemberRoadmapCms,
} from "@/lib/memberAppCms";

export function useMemberDashboardCms() {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);
  const { data, isLoading } = usePublishedSiteCms("member_dashboard");
  return { content: resolveMemberDashboardCms(data ?? null, locale), isLoading, locale };
}

export function useMemberNutritionCms() {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);
  const { data, isLoading } = usePublishedSiteCms("member_nutrition");
  return { content: resolveMemberNutritionCms(data ?? null, locale), isLoading, locale };
}

export function useMemberRoadmapCms() {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);
  const { data, isLoading } = usePublishedSiteCms("member_roadmap");
  return { content: resolveMemberRoadmapCms(data ?? null, locale), isLoading, locale };
}
