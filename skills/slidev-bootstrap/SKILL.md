---
name: slidev-bootstrap
description: Use when user wants to create a new Slidev presentation or bootstrap a slides project. Handles project initialization from template.
---

# Slidev Project Bootstrap

## Creating a New Slidev Project

When the user asks to create a new Slidev presentation, run the bootstrap script:

```bash
bash $(dirname $(node -pe "require.resolve('astar-opencode-slidev/package.json')"))/scripts/bootstrap.sh <target-directory>
```

This will:
1. Copy the Slidev project template (package.json, slides.md, vite.config, opencode.jsonc)
2. Run `npm install` to install dependencies

After bootstrapping, tell the user:
- `npm run dev` starts the dev server with hot reload
- `npm run build` builds a single self-contained HTML file to `dist/`
- Slides are written in `slides.md`

## Updating the Slidev Skill

If the user wants the latest Slidev reference material, run:

```bash
bash $(dirname $(node -pe "require.resolve('astar-opencode-slidev/package.json')"))/scripts/fetch-skill.sh
```

This fetches the official Slidev skill from GitHub.
