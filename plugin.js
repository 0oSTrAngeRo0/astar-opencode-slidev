import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fetchSkill() {
  const skillDir = path.resolve(__dirname, 'skills', 'slidev');
  if (fs.existsSync(path.join(skillDir, 'SKILL.md'))) return;

  try {
    execSync(
      [
        `git clone --depth 1 --filter=blob:none https://github.com/slidevjs/slidev.git /tmp/_slidev_skill_${process.pid}`,
        `rm -rf "${skillDir}"/*`,
        `mkdir -p "${skillDir}"`,
        `cp -r /tmp/_slidev_skill_${process.pid}/skills/slidev/* "${skillDir}"/`,
        `rm -rf /tmp/_slidev_skill_${process.pid}`,
      ].join(' && '),
      { stdio: 'pipe', timeout: 30000 },
    );
  } catch {}
}

export const SlidevPlugin = async ({ directory }) => {
  fetchSkill();

  const hasSlidesProject = fs.existsSync(path.join(directory, 'slides.md'));

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];

      const referencePath = path.resolve(__dirname, 'skills', 'slidev');
      if (!config.skills.paths.includes(referencePath)) {
        config.skills.paths.push(referencePath);
      }

      if (!hasSlidesProject) {
        const bootstrapPath = path.resolve(__dirname, 'skills', 'slidev-bootstrap');
        if (!config.skills.paths.includes(bootstrapPath)) {
          config.skills.paths.push(bootstrapPath);
        }
      }
    },
  };
};
