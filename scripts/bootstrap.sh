#!/bin/bash
set -e

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES="$PLUGIN_DIR/templates"

if [ ! -d "$TEMPLATES" ]; then
  echo "Error: templates directory not found at $TEMPLATES"
  exit 1
fi

echo "Creating Slidev project at: $TARGET"

mkdir -p "$TARGET"
cp -r "$TEMPLATES"/* "$TARGET"/

cd "$TARGET"
npm install

echo ""
echo "Slidev project ready!"
echo ""
echo "  cd $TARGET"
echo "  npm run dev     # Start dev server"
echo "  npm run build   # Build single HTML file"
