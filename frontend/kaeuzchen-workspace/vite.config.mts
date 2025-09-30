/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: './node_modules/.vite/kaeuzchen-workspace',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    name: 'kaeuzchen-workspace',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage',
      provider: 'v8' as const,
    },
    thresholds: {
      global: {
        branches: 90,
        functions: 85,
        lines: 90,
        statements: 90,
      },
      // Datei-spezifische Mindestanforderungen
      perFile: true,
      lines: 80,
      statements: 80,
      functions: 70, // Realistisch für den Anfang
      branches: 80,
    },
    watermarks: {
      statements: [70, 90], // Rot < 70%, Gelb 70-89%, Grün ≥ 90%
      functions: [60, 85], // Rot < 60%, Gelb 60-84%, Grün ≥ 85%
      branches: [65, 80], // Rot < 65%, Gelb 65-79%, Grün ≥ 80%
      lines: [70, 90], // Rot < 70%, Gelb 70-89%, Grün ≥ 90%
    },
  },
}));
