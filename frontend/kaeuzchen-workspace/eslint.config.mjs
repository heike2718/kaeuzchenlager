// eslint.config.mjs
import nx from '@nx/eslint-plugin';
import prettier from 'eslint-config-prettier';
import vitest from 'eslint-plugin-vitest';

export default [
  // Basis (ES, TS, JS) – von Nx vordefiniert
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // Globale Ignorierliste
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.nx/**',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  // Angular (TS + Templates) – Nx Flat-Configs
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],

  // Template-spezifische Regeln (optional erweitern)
  {
    files: ['**/*.html'],
    rules: {
      // Beispiel: '@angular-eslint/template/alt-text': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
    rules: {
      'vitest/no-focused-tests': 'warn', // später via --max-warnings=0 hart schalten
      'vitest/no-disabled-tests': 'warn', // später via --max-warnings=0 hart schalten
      'vitest/no-identical-title': 'error',
    },
  },

  // Ganz zum Schluss: Prettier-Konfig zum Abschalten formatierender ESLint-Regeln
  prettier,
];
