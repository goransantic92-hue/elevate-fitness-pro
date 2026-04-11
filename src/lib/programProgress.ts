import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { Database } from "@/types/database";

export const PROGRAM_TOTAL_DAYS = 90;
export const PROGRAM_WEEKS = 12;

export type ProgramProgress = {
  hasAnchor: boolean;
  /** 1-based day in program, capped 1–90 */
  currentDay: number;
  /** 1–12 */
  weekNumber: number;
  percentComplete: number;
  daysRemaining: number;
  isComplete: boolean;
  anchorDate: Date | null;
};

/**
 * Program clock: day 1 = calendar day of anchor (activated_at or fallback).
 */
export function getProgramProgress(anchorIso: string | null): ProgramProgress {
  if (!anchorIso) {
    return {
      hasAnchor: false,
      currentDay: 1,
      weekNumber: 1,
      percentComplete: 0,
      daysRemaining: PROGRAM_TOTAL_DAYS,
      isComplete: false,
      anchorDate: null,
    };
  }
  const anchor = startOfDay(new Date(anchorIso));
  const today = startOfDay(new Date());
  const elapsed = differenceInCalendarDays(today, anchor) + 1;
  const currentDay = Math.min(PROGRAM_TOTAL_DAYS, Math.max(1, elapsed));
  const isComplete = elapsed >= PROGRAM_TOTAL_DAYS;
  const daysRemaining = Math.max(0, PROGRAM_TOTAL_DAYS - currentDay);
  const weekNumber = Math.min(PROGRAM_WEEKS, Math.floor((currentDay - 1) / 7) + 1);
  const percentComplete = Math.min(100, Math.round((currentDay / PROGRAM_TOTAL_DAYS) * 100));

  return {
    hasAnchor: true,
    currentDay,
    weekNumber,
    percentComplete,
    daysRemaining,
    isComplete,
    anchorDate: anchor,
  };
}

type MemberAccess = Database["public"]["Tables"]["member_access"]["Row"];

/** Prefer official start time; fall back to row creation for legacy rows. */
export function getProgramAnchorIso(access: MemberAccess | null): string | null {
  if (!access?.has_access) return null;
  return access.activated_at ?? access.created_at ?? null;
}
