/**
 * Download a workout demo from Supabase, trim leading seconds, re-compress, and re-upload.
 *
 * Requires .env.local with VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   node scripts/retrim-workout-demo.mjs gym/a/05-tricep-pushdown.mp4 2
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
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

const storagePath = process.argv[2];
const trimStartSec = Number(process.argv[3] ?? "0");

if (!storagePath || !Number.isFinite(trimStartSec) || trimStartSec < 0) {
  console.error("Usage: node scripts/retrim-workout-demo.mjs <storage-path> [trimStartSec]");
  console.error("Example: node scripts/retrim-workout-demo.mjs gym/a/05-tricep-pushdown.mp4 2");
  process.exit(1);
}

const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const workDir = join(tmpdir(), `retrim-${Date.now()}`);
mkdirSync(workDir, { recursive: true });
const originalPath = join(workDir, "original.mp4");
const trimmedPath = join(workDir, "trimmed.mp4");

function cleanup() {
  for (const p of [originalPath, trimmedPath]) {
    if (existsSync(p)) unlinkSync(p);
  }
}

try {
  console.log(`Downloading workout-demos/${storagePath}…`);
  const { data, error } = await supabase.storage.from("workout-demos").download(storagePath);
  if (error) throw error;
  writeFileSync(originalPath, Buffer.from(await data.arrayBuffer()));

  console.log(`Trimming first ${trimStartSec}s and compressing to 720p…`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      String(trimStartSec),
      "-i",
      originalPath,
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
      trimmedPath,
    ],
    { stdio: "inherit" },
  );

  const body = readFileSync(trimmedPath);
  console.log(`Uploading ${(body.length / 1024 / 1024).toFixed(2)} MB → ${storagePath}…`);
  const { error: uploadError } = await supabase.storage.from("workout-demos").upload(storagePath, body, {
    contentType: "video/mp4",
    upsert: true,
  });
  if (uploadError) throw uploadError;

  console.log(`Done. ${storagePath} updated (trimmed ${trimStartSec}s from start).`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  cleanup();
}
