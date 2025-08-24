module.exports = {
    root: true,
    env: {
      browser: true,
      es2020: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
    },
    ignorePatterns: ['dist', 'node_modules'],
  }; 