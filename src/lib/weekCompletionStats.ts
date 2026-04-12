import type { Database } from "@/types/database";

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];

const SLOTS: WLog["slot"][] = ["mon", "wed", "fri", "sat_bonus"];

/** A week counts if every slot has at least one completed log (gym or home). */
export function countFullyCompletedProgramWeeks(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= 12; w++) {
    const allDone = SLOTS.every((slot) => {
      const gym = logs.some((l) => l.week_number === w && l.slot === slot && l.variant === "gym" && l.completed);
      const home = logs.some((l) => l.week_number === w && l.slot === slot && l.variant === "home" && l.completed);
      return gym || home;
    });
    if (allDone) n++;
  }
  return n;
}

export function isWeekFullyCompleteForVariant(logs: WLog[], weekNumber: number, variant: "gym" | "home"): boolean {
  return SLOTS.every((slot) =>
    logs.some((l) => l.week_number === weekNumber && l.slot === slot && l.variant === variant && l.completed)
  );
}
