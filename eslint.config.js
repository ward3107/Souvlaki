import js from '@eslint/js';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default typescriptEslint.config(
  { ignores: ['dist', '.vercel', 'node_modules', 'coverage', 'playwright-report'] },
  {
    extends: [
      js.configs.recommended,
      ...typescriptEslint.configs.recommended,
      // These recommended rule sets were previously registered but never
      // enabled — a11y in particular is a stated project focus.
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      // Pull the real browser globals (window/document/localStorage/...) from
      // the `globals` package, instead of declaring two literal globals.
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // TypeScript already checks props, so PropTypes is redundant noise.
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Modal backdrops here are click-to-close conveniences that sit alongside
      // a real, focusable close button (and Escape). Keep these a11y rules
      // running as warnings so genuine gaps still surface without blocking CI
      // on the intentional overlay pattern.
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
