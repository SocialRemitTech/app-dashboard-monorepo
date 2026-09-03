// .eslintrc.cjs — root ESLint config (ESLint 8 style, matching the installed 8.57.1)
module.exports = {
  root: true,
  env: { es2022: true, node: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  settings: { react: { version: 'detect' } },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.expo',
    'apps/mobile/ios',
    'apps/mobile/android',
    '*.config.js',
    '*.config.cjs',
    '*.config.ts',
  ],
  rules: {
    // Pragmatic for an app in active development — tighten later.
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-undef': 'off', // TypeScript handles this

    // React Native REQUIRES require() for static assets — Metro resolves images by
    // statically analysing require() calls, so this rule would break asset loading.
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: { jest: true },
    },
  ],
};
