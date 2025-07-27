import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig([
  globalIgnores(['**/main.original.js', 'dist']),
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js, '@stylistic': stylistic },
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      'no-var': ['error'],
      'prefer-const': ['error'],
    },
    extends: ['js/recommended', ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]);
