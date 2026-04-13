import type { Database } from "@/types/database";

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];
export type WorkoutVariant = WLog["variant"];

const SLOTS: WLog["slot"][] = ["mon", "wed", "fri", "sat_bonus"];

/** Slot counts as done if that slot is completed for gym, home, or emergency (10 min). */
export function isSlotCompletedUnion(logs: WLog[], weekNumber: number, slot: WLog["slot"]): boolean {
  return logs.some(
    (l) =>
      l.week_number === weekNumber &&
      l.slot === slot &&
      l.completed &&
      (l.variant === "gym" || l.variant === "home" || l.variant === "emergency")
  );
}

/** A week counts if every slot has at least one completed log (any track). */
export function countFullyCompletedProgramWeeks(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= 12; w++) {
    const allDone = SLOTS.every((slot) => isSlotCompletedUnion(logs, w, slot));
    if (allDone) n++;
  }
  return n;
}

export function isWeekFullyCompleteForVariant(logs: WLog[], weekNumber: number, variant: WorkoutVariant): boolean {
  return SLOTS.every((slot) =>
    logs.some((l) => l.week_number === weekNumber && l.slot === slot && l.variant === variant && l.completed)
  );
}

/** Each slot done on any track — used for overview / check-in bump. */
export function isWeekFullyCompleteUnion(logs: WLog[], weekNumber: number): boolean {
  return SLOTS.every((slot) => isSlotCompletedUnion(logs, weekNumber, slot));
}

/** Weeks 1..n in order; stops at first week missing any slot (any track). */
export function countContiguousCompletedWeeksFromStart(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= 12; w++) {
    const allDone = SLOTS.every((slot) => isSlotCompletedUnion(logs, w, slot));
    if (!allDone) break;
    n++;
  }
  return n;
}
