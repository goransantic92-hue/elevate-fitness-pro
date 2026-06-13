import {
  emergencyWorkouts,
  gymWorkouts,
  homeWorkouts,
  type Exercise,
  type WorkoutPlan,
} from "@/data/busyStrong90";
import { asNullableString, asString, isRecord } from "@/lib/cmsUtils";
import { supabase } from "@/lib/supabase";
import type { HomepageLocale } from "@/types/homepageCms";
import type {
  EmergencyWorkoutCms,
  EmergencyWorkoutRowCms,
  ExerciseCms,
  MemberWorkoutsCmsPayload,
  WorkoutDemoClipCms,
  WorkoutPlanCms,
} from "@/types/siteCms";

const PLAN_IDS = ["a", "b", "c"] as const;

function cloneExercise(ex: Exercise): ExerciseCms {
  return {
    order: ex.order,
    name: ex.name,
    target: ex.target,
    sets: ex.sets,
    reps: ex.reps,
    rest: ex.rest,
    tip: ex.tip,
    demoVideoPath: ex.demoVideoPath,
    demoVideoPaths: ex.demoVideoPaths?.map((c) => ({ ...c })),
    demoVideoStartSec: ex.demoVideoStartSec,
  };
}

function clonePlan(plan: WorkoutPlan): WorkoutPlanCms {
  return {
    id: plan.id,
    code: plan.code,
    title: plan.title,
    focus: plan.focus,
    warmup: plan.warmup,
    exercises: plan.exercises.map(cloneExercise),
    finisher: plan.finisher,
  };
}

export function getDefaultMemberWorkouts(_locale: HomepageLocale): MemberWorkoutsCmsPayload {
  return {
    gym: {
      a: clonePlan(gymWorkouts.a),
      b: clonePlan(gymWorkouts.b),
      c: clonePlan(gymWorkouts.c),
    },
    home: {
      a: clonePlan(homeWorkouts.a),
      b: clonePlan(homeWorkouts.b),
      c: clonePlan(homeWorkouts.c),
    },
    emergency: emergencyWorkouts.map((w) => ({
      id: w.id,
      name: w.name,
      time: w.time,
      rows: w.rows.map((r) => ({ ...r })),
    })),
  };
}

function parseDemoClips(raw: unknown): WorkoutDemoClipCms[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const clips = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const path = asString(item.path, "").trim();
      const label = asString(item.label, "").trim();
      if (!path || !label) return null;
      const startSec = typeof item.startSec === "number" ? item.startSec : undefined;
      return { label, path, ...(startSec !== undefined ? { startSec } : {}) };
    })
    .filter((item): item is WorkoutDemoClipCms => item !== null);
  return clips.length > 0 ? clips : undefined;
}

function parseExercise(raw: unknown, fallback: ExerciseCms): ExerciseCms {
  if (!isRecord(raw)) return fallback;
  const demoVideoPaths = parseDemoClips(raw.demoVideoPaths);
  const demoVideoPath = asNullableString(raw.demoVideoPath, fallback.demoVideoPath ?? null) ?? undefined;
  return {
    order: typeof raw.order === "number" ? raw.order : fallback.order,
    name: asString(raw.name, fallback.name),
    target: asString(raw.target, fallback.target),
    sets: asString(raw.sets, fallback.sets),
    reps: asString(raw.reps, fallback.reps),
    rest: asString(raw.rest, fallback.rest),
    tip: asString(raw.tip, fallback.tip),
    demoVideoPath: demoVideoPath || (demoVideoPaths ? undefined : fallback.demoVideoPath),
    demoVideoPaths: demoVideoPaths ?? fallback.demoVideoPaths,
    demoVideoStartSec:
      typeof raw.demoVideoStartSec === "number" ? raw.demoVideoStartSec : fallback.demoVideoStartSec,
  };
}

function parsePlan(raw: unknown, fallback: WorkoutPlanCms): WorkoutPlanCms {
  if (!isRecord(raw)) return fallback;
  const exercises = Array.isArray(raw.exercises)
    ? raw.exercises.map((item, i) => parseExercise(item, fallback.exercises[i] ?? fallback.exercises[0]))
    : fallback.exercises;
  return {
    id: fallback.id,
    code: asString(raw.code, fallback.code),
    title: asString(raw.title, fallback.title),
    focus: asString(raw.focus, fallback.focus),
    warmup: asString(raw.warmup, fallback.warmup),
    exercises: exercises.length > 0 ? exercises : fallback.exercises,
    finisher: asString(raw.finisher, fallback.finisher),
  };
}

function parsePlans(raw: unknown, fallback: MemberWorkoutsCmsPayload["gym"]): MemberWorkoutsCmsPayload["gym"] {
  const block = isRecord(raw) ? raw : {};
  return {
    a: parsePlan(block.a, fallback.a),
    b: parsePlan(block.b, fallback.b),
    c: parsePlan(block.c, fallback.c),
  };
}

function parseEmergencyRows(raw: unknown, fallback: EmergencyWorkoutRowCms[]): EmergencyWorkoutRowCms[] {
  if (!Array.isArray(raw)) return fallback;
  const rows = raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const exercise = asString(item.exercise, "").trim();
      if (!exercise) return null;
      return {
        exercise,
        sets: asString(item.sets, ""),
        reps: asString(item.reps, ""),
        rest: asString(item.rest, ""),
      };
    })
    .filter((item): item is EmergencyWorkoutRowCms => item !== null);
  return rows.length > 0 ? rows : fallback;
}

function parseEmergency(raw: unknown, fallback: EmergencyWorkoutCms[]): EmergencyWorkoutCms[] {
  if (!Array.isArray(raw)) return fallback;
  const items = raw
    .map((item, i) => {
      if (!isRecord(item)) return null;
      const id = asString(item.id, "").trim();
      const name = asString(item.name, "").trim();
      if (!id || !name) return null;
      const fb = fallback.find((x) => x.id === id) ?? fallback[i] ?? fallback[0];
      return {
        id,
        name,
        time: asString(item.time, fb?.time ?? "10 min"),
        rows: parseEmergencyRows(item.rows, fb?.rows ?? []),
      };
    })
    .filter((item): item is EmergencyWorkoutCms => item !== null);
  return items.length > 0 ? items : fallback;
}

export function parseMemberWorkouts(raw: unknown, locale: HomepageLocale): MemberWorkoutsCmsPayload {
  const d = getDefaultMemberWorkouts(locale);
  if (!isRecord(raw)) return d;
  return {
    gym: parsePlans(raw.gym, d.gym),
    home: parsePlans(raw.home, d.home),
    emergency: parseEmergency(raw.emergency, d.emergency),
  };
}

export function resolveMemberWorkouts(
  cms: MemberWorkoutsCmsPayload | null | undefined,
  locale: HomepageLocale
): MemberWorkoutsCmsPayload {
  return parseMemberWorkouts(cms ?? {}, locale);
}

export async function uploadWorkoutDemoFile(file: File, storagePath: string): Promise<string> {
  const path = storagePath.replace(/^\//, "").trim();
  if (!path) throw new Error("Storage path is required.");
  const { error } = await supabase.storage.from("workout-demos").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "video/mp4",
  });
  if (error) throw error;
  return path;
}

export { PLAN_IDS };
