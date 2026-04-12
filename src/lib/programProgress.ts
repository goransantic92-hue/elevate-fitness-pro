import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { Database } from "@/types/database";
import { countContiguousCompletedWeeksFromStart } from "@/lib/weekCompletionStats";

export const PROGRAM_TOTAL_DAYS = 90;
export const PROGRAM_WEEKS = 12;

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];

export type ProgramProgress = {
  hasAnchor: boolean;
  /** 1-based day in program, capped 1–90 */
  currentDay: number;
  /** 1–12 — current week to work on (from check-ins) or calendar fallback */
  weekNumber: number;
  percentComplete: number;
  daysRemaining: number;
  isComplete: boolean;
  anchorDate: Date | null;
  /** Weeks 1..n fully checked in order (Mon+Wed+Fri+Sat, gym or home). */
  completedContiguousWeeks: number;
};

/**
 * Member dashboard: progress only from session checkboxes.
 * One program week = all four slots done (Mon, Wed, Fri, Sat bonus) — gym or home per slot.
 * Weeks count in order from 1; if week 2 is incomplete, week 3+ do not advance the bar.
 * Day 1–90 is spread across 12 completed weeks (linear).
 */
export function getProgramProgressFromSessionLogs(logs: WLog[]): ProgramProgress {
  const contiguous = countContiguousCompletedWeeksFromStart(logs);
  const isComplete = contiguous >= PROGRAM_WEEKS;
  const weekNumber = Math.min(PROGRAM_WEEKS, contiguous + 1);

  let currentDay: number;
  if (isComplete) {
    currentDay = PROGRAM_TOTAL_DAYS;
  } else if (contiguous === 0) {
    currentDay = 1;
  } else {
    currentDay = Math.min(PROGRAM_TOTAL_DAYS - 1, Math.floor((contiguous / PROGRAM_WEEKS) * PROGRAM_TOTAL_DAYS));
  }

  const daysRemaining = Math.max(0, PROGRAM_TOTAL_DAYS - currentDay);
  const percentComplete = Math.min(100, Math.round((currentDay / PROGRAM_TOTAL_DAYS) * 100));

  return {
    hasAnchor: true,
    currentDay,
    weekNumber,
    percentComplete,
    daysRemaining,
    isComplete,
    anchorDate: null,
    completedContiguousWeeks: contiguous,
  };
}

/** Calendar-based progress from access grant (legacy / non-dashboard use). */
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
      completedContiguousWeeks: 0,
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
    completedContiguousWeeks: 0,
  };
}

type MemberAccess = Database["public"]["Tables"]["member_access"]["Row"];

/** Prefer official start time; fall back to row creation for legacy rows. */
export function getProgramAnchorIso(access: MemberAccess | null): string | null {
  if (!access?.has_access) return null;
  return access.activated_at ?? access.created_at ?? null;
}
