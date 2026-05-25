/**
 * One-time upload of testimonial MP4s and poster JPGs to Supabase Storage.
 *
 * Prerequisites:
 * 1. Run supabase/migrations/20260525120000_testimonials_storage.sql in the Supabase SQL editor (or db push).
 * 2. Set env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_URL="https://pfxfydhkoqcpomfrlgjg.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<service_role from Dashboard → Settings → API>"
 *   node scripts/upload-testimonials.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
const downloads = "c:\\Users\\Goranche\\Downloads\\Telegram Desktop";
const postersDir = join(root, "public", "testimonials");

const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const files = [
  { storagePath: "videos/nupur.mp4", local: join(downloads, "Nupur.mp4"), contentType: "video/mp4" },
  { storagePath: "videos/george.mp4", local: join(downloads, "George.mp4"), contentType: "video/mp4" },
  { storagePath: "videos/seph.mp4", local: join(downloads, "Seph.mp4"), contentType: "video/mp4" },
  { storagePath: "videos/palav-patel.mp4", local: join(downloads, "Palav Patel.mp4"), contentType: "video/mp4" },
  { storagePath: "posters/nupur.jpg", local: join(postersDir, "nupur.jpg"), contentType: "image/jpeg" },
  { storagePath: "posters/george.jpg", local: join(postersDir, "george.jpg"), contentType: "image/jpeg" },
  { storagePath: "posters/seph.jpg", local: join(postersDir, "seph.jpg"), contentType: "image/jpeg" },
  { storagePath: "posters/palav-patel.jpg", local: join(postersDir, "palav-patel.jpg"), contentType: "image/jpeg" },
];

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.id === "testimonials")) return;
  const { error } = await supabase.storage.createBucket("testimonials", {
    public: true,
    fileSizeLimit: 52_428_800,
    allowedMimeTypes: ["video/mp4", "image/jpeg", "image/webp"],
  });
  if (error) throw error;
}

async function uploadOne({ storagePath, local, contentType }) {
  if (!existsSync(local)) {
    throw new Error(`File not found: ${local}`);
  }
  const body = readFileSync(local);
  const { error } = await supabase.storage.from("testimonials").upload(storagePath, body, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  console.log(`OK ${storagePath}`);
}

await ensureBucket();
for (const f of files) {
  await uploadOne(f);
}
console.log("All testimonial assets uploaded.");
