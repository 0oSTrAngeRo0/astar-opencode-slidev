import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function cloneSkillTo(targetDir) {
  const tmpDir = `/tmp/_slidev_skill_${process.pid}`;

  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  execSync(
    `git clone --depth 1 --filter=blob:none https://github.com/slidevjs/slidev.git "${tmpDir}"`,
    { stdio: 'pipe', timeout: 30000 },
  );

  const commit = execSync(
    `git -C "${tmpDir}" log -1 --format='%h %s'`,
    { encoding: 'utf8', timeout: 5000 },
  ).trim();

  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(path.join(tmpDir, 'skills', 'slidev'), targetDir, { recursive: true });
  fs.rmSync(tmpDir, { recursive: true, force: true });

  return commit;
}

function ensureSkill() {
  const skillDir = path.resolve(__dirname, 'skills', 'slidev');
  if (fs.existsSync(path.join(skillDir, 'SKILL.md'))) return;
  try { cloneSkillTo(skillDir); } catch {}
}

function updateSkill() {
  const skillDir = path.resolve(__dirname, 'skills', 'slidev');
  if (fs.existsSync(skillDir)) {
    fs.rmSync(skillDir, { recursive: true, force: true });
  }
  return cloneSkillTo(skillDir);
}

export const SlidevPlugin = async ({ directory }) => {
  ensureSkill();

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
    tool: {
      "slidev:bootstrap": {
        description: "Initialize a new Slidev project from templates. Copies template files and runs npm install.",
        args: {
          target: {
            type: "string",
            description: "Target directory path for the new Slidev project. If relative, resolved against the current working directory.",
          },
        },
        execute: async (args, ctx) => {
          const target = args.target || '.';
          const cwd = ctx.directory || directory;
          const targetDir = path.isAbsolute(target) ? target : path.resolve(cwd, target);

          const templatesDir = path.resolve(__dirname, 'templates');
          if (!fs.existsSync(templatesDir)) {
            return { output: `Error: templates directory not found at ${templatesDir}` };
          }

          fs.mkdirSync(targetDir, { recursive: true });
          fs.cpSync(templatesDir, targetDir, { recursive: true });

          execSync('npm install', { cwd: targetDir, stdio: 'pipe', timeout: 120000 });

          return {
            output: [
              `Slidev project created at: ${targetDir}`,
              '',
              `  cd ${targetDir}`,
              '  npm run dev     # Start dev server',
              '  npm run build   # Build single HTML file',
            ].join('\n'),
          };
        },
      },
      "slidev:fetch-skill": {
        description: "Fetch the latest Slidev skill reference from GitHub. Updates the local skill file used for AI guidance on Slidev.",
        args: {},
        execute: async () => {
          try {
            const commit = updateSkill();
            return `Slidev skill updated successfully (${commit})`;
          } catch (e) {
            return `Failed to fetch Slidev skill: ${e.message}`;
          }
        },
      },
    },
  };
};
