import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SlidevPlugin = async ({ directory }) => {
  const skillPaths = [
    path.resolve(__dirname, 'skills', 'slidev-bootstrap'),
    path.resolve(__dirname, 'skills', 'slidev'),
  ];

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      for (const p of skillPaths) {
        if (!config.skills.paths.includes(p)) {
          config.skills.paths.push(p);
        }
      }
    },
  };
};
