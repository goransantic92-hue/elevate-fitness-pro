#!/usr/bin/env python3
"""Regenerate favicon + PWA icons from public/pwa-512.png (BUSY STRONG 90 brand)."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SOURCE = PUBLIC / "pwa-512.png"

SIZES = {
    "favicon-32.png": 32,
    "favicon-48.png": 48,
    "favicon-192.png": 192,
    "apple-touch-icon.png": 180,
    "pwa-192.png": 192,
    "logo-512.png": 512,
}


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source image: {SOURCE}")

    master = Image.open(SOURCE).convert("RGBA")

    for name, size in SIZES.items():
        out = PUBLIC / name
        resized = master.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(out, format="PNG", optimize=True)
        print(f"wrote {out.name} ({size}x{size})")

  # Multi-size .ico for browsers + Google (Lovable favicon.ico replacement)
    ico_path = PUBLIC / "favicon.ico"
    ico_sizes = [16, 32, 48, 64, 128, 256]
    ico_images = [master.resize((s, s), Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"wrote {ico_path.name} ({', '.join(map(str, ico_sizes))}px)")


if __name__ == "__main__":
    main()
