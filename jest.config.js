const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.claude/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '<rootDir>/.claude/', '<rootDir>/tests/e2e/'],
};

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  // github-slugger@2 is ESM-only; allow Jest to transform it (pnpm-aware path).
  config.transformIgnorePatterns = [
    'node_modules/(?!\\.pnpm/github-slugger|github-slugger/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};
