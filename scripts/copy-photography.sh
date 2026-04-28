#!/usr/bin/env bash
# Copies travel photos into public/photography for the portfolio.
# Run from repo root: npm run photography:copy
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/photography"
mkdir -p "$DEST"

ROME="${PHOTO_SRC_ROME:-$HOME/Desktop/TRAVEL/ROME}"
PRAGUE="${PHOTO_SRC_PRAGUE:-$HOME/Desktop/TRAVEL/PRAGUE}"

copy_one() {
  local src="$1" name="$2"
  if [[ ! -f "$src" ]]; then
    echo "copy-photography: missing: $src" >&2
    echo "Set PHOTO_SRC_ROME / PHOTO_SRC_PRAGUE or place files in the default TRAVEL folders." >&2
    exit 1
  fi
  cp -f "$src" "$DEST/$name"
  echo "OK $name"
}

copy_one "$ROME/DSCN2618.JPG" "DSCN2618.JPG"
copy_one "$ROME/DSCN2612.JPG" "DSCN2612.JPG"
copy_one "$PRAGUE/DSCN2591.JPG" "DSCN2591.JPG"
copy_one "$PRAGUE/DSCN2554.JPG" "DSCN2554.JPG"
echo "All 4 files -> $DEST"
