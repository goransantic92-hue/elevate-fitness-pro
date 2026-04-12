import { describe, expect, it } from "vitest";
import { getProgramProgress, getProgramProgressFromSessionLogs, PROGRAM_TOTAL_DAYS } from "./programProgress";
import type { Database } from "@/types/database";

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];

function row(
  week: number,
  slot: WLog["slot"],
  variant: WLog["variant"],
  completed: boolean
): WLog {
  return {
    id: `id-${week}-${slot}-${variant}`,
    user_id: "u",
    week_number: week,
    slot,
    variant,
    completed,
    main_lifts_note: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

describe("getProgramProgress (calendar)", () => {
  it("returns defaults without anchor", () => {
    const p = getProgramProgress(null);
    expect(p.hasAnchor).toBe(false);
    expect(p.currentDay).toBe(1);
    expect(p.percentComplete).toBe(0);
    expect(p.completedContiguousWeeks).toBe(0);
  });

  it("counts calendar days from anchor", () => {
    const anchor = new Date();
    anchor.setDate(anchor.getDate() - 9);
    const p = getProgramProgress(anchor.toISOString());
    expect(p.hasAnchor).toBe(true);
    expect(p.currentDay).toBe(10);
    expect(p.weekNumber).toBe(2);
  });

  it("caps at 90 days and marks complete", () => {
    const anchor = new Date();
    anchor.setDate(anchor.getDate() - 120);
    const p = getProgramProgress(anchor.toISOString());
    expect(p.currentDay).toBe(PROGRAM_TOTAL_DAYS);
    expect(p.isComplete).toBe(true);
    expect(p.daysRemaining).toBe(0);
  });
});

describe("getProgramProgressFromSessionLogs", () => {
  it("starts at day 1 week 1 with no logs", () => {
    const p = getProgramProgressFromSessionLogs([]);
    expect(p.currentDay).toBe(1);
    expect(p.weekNumber).toBe(1);
    expect(p.completedContiguousWeeks).toBe(0);
    expect(p.percentComplete).toBe(1);
  });

  it("advances after one full week (gym)", () => {
    const logs = [
      row(1, "mon", "gym", true),
      row(1, "wed", "gym", true),
      row(1, "fri", "gym", true),
      row(1, "sat_bonus", "gym", true),
    ];
    const p = getProgramProgressFromSessionLogs(logs);
    expect(p.completedContiguousWeeks).toBe(1);
    expect(p.weekNumber).toBe(2);
    expect(p.currentDay).toBe(Math.floor((1 / 12) * PROGRAM_TOTAL_DAYS));
  });

  it("does not count week 2 if week 1 incomplete", () => {
    const logs = [
      row(2, "mon", "gym", true),
      row(2, "wed", "gym", true),
      row(2, "fri", "gym", true),
      row(2, "sat_bonus", "gym", true),
    ];
    const p = getProgramProgressFromSessionLogs(logs);
    expect(p.completedContiguousWeeks).toBe(0);
    expect(p.weekNumber).toBe(1);
  });

  it("allows gym/home mix per slot", () => {
    const logs = [
      row(1, "mon", "gym", true),
      row(1, "wed", "home", true),
      row(1, "fri", "gym", true),
      row(1, "sat_bonus", "home", true),
    ];
    const p = getProgramProgressFromSessionLogs(logs);
    expect(p.completedContiguousWeeks).toBe(1);
    expect(p.weekNumber).toBe(2);
  });
});
