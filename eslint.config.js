import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ["src/generated/prisma/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
];