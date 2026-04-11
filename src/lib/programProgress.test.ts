import { describe, expect, it } from "vitest";
import { getProgramProgress, PROGRAM_TOTAL_DAYS } from "./programProgress";

describe("getProgramProgress", () => {
  it("returns defaults without anchor", () => {
    const p = getProgramProgress(null);
    expect(p.hasAnchor).toBe(false);
    expect(p.currentDay).toBe(1);
    expect(p.percentComplete).toBe(0);
  });

  it("counts calendar days from anchor", () => {
    const anchor = new Date();
    anchor.setDate(anchor.getDate() - 9); // 10 calendar days span → day 10
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
