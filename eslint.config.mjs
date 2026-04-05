import nextConfig from 'eslint-config-next/core-web-vitals';
import globals from 'globals';

const eslintConfig = [
  ...nextConfig,
  // Node.js scripts: allow Node globals, relax browser-only rules
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Scripts run in Node – require() style imports may appear via ts-node interop
      '@typescript-eslint/no-require-imports': 'off',
      // console is intentional in CLI scripts
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
