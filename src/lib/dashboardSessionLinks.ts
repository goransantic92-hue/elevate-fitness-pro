import { emergencyWorkouts as defaultEmergency, gymWorkouts as defaultGym, homeWorkouts as defaultHome, weeklySchedule } from "@/data/busyStrong90";
import type { EmergencyWorkoutCms, MemberWorkoutsCmsPayload, WorkoutPlanCms } from "@/types/siteCms";

export type PlanTab = "gym" | "home" | "emergency";

export type SessionSlot = "mon" | "wed" | "fri" | "sat_bonus";

export type WorkoutContentSources = Pick<MemberWorkoutsCmsPayload, "gym" | "home" | "emergency">;

const defaultSources: WorkoutContentSources = {
  gym: defaultGym,
  home: defaultHome,
  emergency: [...defaultEmergency],
};

const SLOT_TO_CODE: Record<Exclude<SessionSlot, "sat_bonus">, "a" | "b" | "c"> = {
  mon: "a",
  wed: "b",
  fri: "c",
};

/** Maps main sessions to a complementary 10-minute emergency workout. */
const SLOT_TO_EMERGENCY_ID: Record<SessionSlot, string> = {
  mon: "push",
  wed: "leg",
  fri: "pull",
  sat_bonus: "full",
};

export type SessionLinkMeta = {
  to: string;
  title: string;
  description: string;
  badge?: string;
};

function emergencyById(id: string, emergency: EmergencyWorkoutCms[]) {
  return emergency.find((w) => w.id === id);
}

export function getSessionLinkMeta(
  slot: SessionSlot,
  planTab: PlanTab,
  sources: WorkoutContentSources = defaultSources
): SessionLinkMeta {
  const gymWorkouts = sources.gym;
  const homeWorkouts = sources.home;
  const emergencyWorkouts = sources.emergency;
  if (planTab === "emergency") {
    const id = SLOT_TO_EMERGENCY_ID[slot];
    const w = emergencyById(id, emergencyWorkouts);
    if (!w) {
      return { to: "/dashboard/training", title: "Training", description: "Open training plans" };
    }
    return {
      to: `/dashboard/training/emergency/${id}`,
      title: w.name,
      description: `${w.time} · not a full-session substitute — better than skipping.`,
      badge: w.time,
    };
  }

  if (slot === "sat_bonus") {
    const w = emergencyById("full", emergencyWorkouts);
    const sat = weeklySchedule.find((d) => d.day === "Saturday");
    return {
      to: `/dashboard/training/emergency/full`,
      title: w?.name ?? "Full Body Blast",
      description: sat?.note ? `${sat.focus} — ${sat.note}` : "Optional Saturday finishers from the manual.",
      badge: "10 min",
    };
  }

  const code = SLOT_TO_CODE[slot];
  const workout: WorkoutPlanCms = planTab === "gym" ? gymWorkouts[code] : homeWorkouts[code];
  const dayName = slot === "mon" ? "Monday" : slot === "wed" ? "Wednesday" : "Friday";
  const dayRow = weeklySchedule.find((d) => d.day === dayName);

  const extra = dayRow ? `${dayRow.focus} · ${dayRow.duration}${dayRow.note ? ` · ${dayRow.note}` : ""}` : workout.focus;

  return {
    to: `/dashboard/training/${planTab}/${code}`,
    title: workout.title,
    description: `${workout.focus} — ${extra}`,
  };
}
