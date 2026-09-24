const js = require('@eslint/js');
const pluginCypress = require('eslint-plugin-cypress');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'cypress/reports/', 'cypress/screenshots/', 'cypress/downloads/'],
  },
  js.configs.recommended,
  pluginCypress.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['*.config.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  prettier,
];
