#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_DIR="$PLUGIN_DIR/skills/slidev"
TMP_DIR="/tmp/_slidev_skill_$$"

echo "Fetching latest Slidev skill from GitHub..."

git clone --depth 1 --filter=blob:none \
  https://github.com/slidevjs/slidev.git \
  "$TMP_DIR" 2>&1 | tail -1

COMMIT=$(git -C "$TMP_DIR" log -1 --format='%h %s' 2>/dev/null || echo 'unknown')

rm -rf "$SKILL_DIR"/*
mkdir -p "$SKILL_DIR"
cp -r "$TMP_DIR/skills/slidev"/* "$SKILL_DIR/"
rm -rf "$TMP_DIR"

echo "Slidev skill updated to latest version ($COMMIT)"
