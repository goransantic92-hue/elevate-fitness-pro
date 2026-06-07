import type { HandbookId } from "@/lib/handbooks";
import eatNutrition from "@/assets/handbooks/eat-nutrition.jpg";
import fuelSupplements from "@/assets/handbooks/fuel-supplements.jpg";
import muscleHandbook from "@/assets/handbooks/muscle-handbook.jpg";
import busyStrong7day from "@/assets/handbooks/busy-strong-7day.jpg";

export const HANDBOOK_IMAGES: Record<HandbookId, string> = {
  "eat-nutrition": eatNutrition,
  "fuel-supplements": fuelSupplements,
  "muscle-handbook": muscleHandbook,
  "busy-strong-7day": busyStrong7day,
};
