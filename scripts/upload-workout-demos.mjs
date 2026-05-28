/**
 * Upload GYM Training A, B & C demo videos to Supabase Storage (workout-demos bucket).
 *
 * Prerequisites:
 * 1. Run supabase/migrations/20260526120000_workout_demos_storage.sql in Supabase SQL editor.
 * 2. .env.local with VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run upload:workout-demos
 *   node scripts/upload-workout-demos.mjs c    # only Training C
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, statSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import { tmpdir } from "os";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
loadEnvFile(join(root, ".env"));
loadEnvFile(join(root, ".env.local"));

const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** local filename → storage path under workout-demos bucket */
const gymA = {
  dir: join(root, "public", "Trening A"),
  items: [
    { local: "Barbell Dumbbell Bench Press.mp4", storagePath: "gym/a/01-bench-press.mp4" },
    { local: "Overhead Press (DB or BB).mp4", storagePath: "gym/a/02-overhead-press.mp4" },
    { local: "Incline Dumbbell Press.mp4", storagePath: "gym/a/03-incline-dumbbell-press.mp4" },
    { local: "Lateral Raises.mp4", storagePath: "gym/a/04-lateral-raises.mp4" },
    { local: "Cable Band Tricep Pushdown.mp4", storagePath: "gym/a/05-tricep-pushdown.mp4" },
  ],
};

const gymB = {
  dir: join(root, "public", "Trening B"),
  items: [
    { local: "Barbell Squat Goblet Squat.mp4", storagePath: "gym/b/01-barbell-squat-goblet-squat.mp4" },
    { local: "Romanian Deadlift (RDL).mp4", storagePath: "gym/b/02-romanian-deadlift.mp4" },
    { local: "Leg Press or Bulgarian Split Squat.mp4", storagePath: "gym/b/03-leg-press-bulgarian-split-squat.mp4" },
    { local: "Leg Curl (Machine or Band).mp4", storagePath: "gym/b/04-leg-curl.mp4" },
    { local: "Standing Calf raises.mp4", storagePath: "gym/b/05-standing-calf-raises.mp4" },
    { local: "Plank Hold.mp4", storagePath: "gym/b/06-plank-hold.mp4" },
  ],
};

const gymC = {
  dir: join(root, "public", "Trening C"),
  items: [
    { local: "Pull-Ups Lat Pulldown V1.mp4", storagePath: "gym/c/01-pull-ups-lat-pulldown-v1.mp4" },
    { local: "Pull-Ups Lat Pulldown V2.mp4", storagePath: "gym/c/01-pull-ups-lat-pulldown-v2.mp4" },
    { local: "Barbell or Dumbbell Row V1.mp4", storagePath: "gym/c/02-barbell-dumbbell-row-v1.mp4" },
    { local: "Barbell or Dumbbell Row V2 (2).mp4", storagePath: "gym/c/02-barbell-dumbbell-row-v2.mp4" },
    { local: "Seated Cable Row  Band Row V1.mp4", storagePath: "gym/c/03-seated-cable-row-band-row-v1.mp4" },
    { local: "Seated Cable Row  Band Row V2.mp4", storagePath: "gym/c/03-seated-cable-row-band-row-v2.mp4" },
    { local: "Face Pulls or Rear Delt Fly V1.mp4", storagePath: "gym/c/04-face-pulls-rear-delt-fly-v1.mp4" },
    { local: "Face Pulls or Rear Delt Fly V2.mp4", storagePath: "gym/c/04-face-pulls-rear-delt-fly-v2.mp4" },
    { local: "Barbell  Dumbbell Bicep Curl V1.mp4", storagePath: "gym/c/05-barbell-dumbbell-bicep-curl-v1.mp4" },
    { local: "Barbell  Dumbbell Bicep Curl V2.mp4", storagePath: "gym/c/05-barbell-dumbbell-bicep-curl-v2.mp4" },
    { local: "Hammer Curl.mp4", storagePath: "gym/c/06-hammer-curl.mp4" },
  ],
};

const only = process.argv[2]?.toLowerCase();
const allSets = [
  ["a", "GYM Training A", gymA],
  ["b", "GYM Training B", gymB],
  ["c", "GYM Training C", gymC],
];
const setsToRun = only ? allSets.filter(([key]) => key === only) : allSets;
if (only && setsToRun.length === 0) {
  console.error(`Unknown filter "${only}". Use a, b, or c.`);
  process.exit(1);
}

/** Always compress for web demos (720p, under Supabase 50MB limit). */
const ALWAYS_COMPRESS = true;

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const opts = {
    public: false,
    fileSizeLimit: 52_428_800,
    allowedMimeTypes: ["video/mp4"],
  };
  if (buckets?.some((b) => b.id === "workout-demos")) {
    const { error } = await supabase.storage.updateBucket("workout-demos", opts);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.storage.createBucket("workout-demos", opts);
  if (error) throw error;
}

function prepareUploadBody(filePath) {
  const size = statSync(filePath).size;
  if (!ALWAYS_COMPRESS && size <= 8 * 1024 * 1024) {
    return { body: readFileSync(filePath), tempPath: null };
  }
  const tempPath = join(tmpdir(), `workout-demo-${Date.now()}.mp4`);
  console.log(`Compressing ${(size / 1024 / 1024).toFixed(1)} MB → 720p web…`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      filePath,
      "-c:v",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "fast",
      "-vf",
      "scale=720:-2",
      "-an",
      "-movflags",
      "+faststart",
      tempPath,
    ],
    { stdio: "inherit" },
  );
  const compressed = readFileSync(tempPath);
  console.log(`  → ${(compressed.length / 1024 / 1024).toFixed(1)} MB`);
  return { body: compressed, tempPath };
}

async function uploadOne(videosDir, { local, storagePath }) {
  const filePath = join(videosDir, local);
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const { body, tempPath } = prepareUploadBody(filePath);
  try {
    const { error } = await supabase.storage.from("workout-demos").upload(storagePath, body, {
      contentType: "video/mp4",
      upsert: true,
    });
    if (error) throw error;
    console.log(`OK  ${storagePath}`);
  } finally {
    if (tempPath && existsSync(tempPath)) unlinkSync(tempPath);
  }
}

async function uploadSet(label, { dir, items }) {
  console.log(`\n--- ${label} (${dir}) ---`);
  for (const item of items) {
    await uploadOne(dir, item);
  }
}

await ensureBucket();
for (const [, label, set] of setsToRun) {
  await uploadSet(label, set);
}
console.log(`\nDone. Uploaded: ${setsToRun.map(([, label]) => label).join(", ")}.`);
