/**
 * Builds portrait 4:5 hero WebPs from the master landscape source.
 * Run: node scripts/generate-hero-images.mjs
 */
import sharp from "sharp";
import { statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "src/assets/private-trainer-fitness.webp");
const publicDir = path.join(root, "public");

const WEBP = { quality: 92, effort: 6, smartSubsample: false };

async function build() {
  const meta = await sharp(source).metadata();
  const srcW = meta.width ?? 1024;
  const srcH = meta.height ?? 576;

  // Largest centered 4:5 crop from the landscape master.
  const cropW = Math.min(srcW, Math.round((srcH * 4) / 5));
  const cropH = Math.round((cropW * 5) / 4);
  const left = Math.round((srcW - cropW) / 2);
  const top = Math.round((srcH - cropH) / 2);

  const cropped = sharp(source).extract({ left, top, width: cropW, height: cropH });

  const variants = [
    { name: "hero-430.webp", width: 430, height: 538 },
    { name: "hero-860.webp", width: 860, height: 1075 },
    { name: "hero-lcp.webp", width: 1024, height: 1280 },
  ];

  for (const { name, width, height } of variants) {
    const out = path.join(publicDir, name);
    await cropped
      .clone()
      .resize(width, height, { fit: "cover", position: "centre" })
      .webp(WEBP)
      .toFile(out);
    const bytes = statSync(out).size;
    console.log(`${name}: ${width}x${height}, ${(bytes / 1024).toFixed(1)} KiB`);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
