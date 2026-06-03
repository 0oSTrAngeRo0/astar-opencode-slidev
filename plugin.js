import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SlidevPlugin = async ({ directory }) => {
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
