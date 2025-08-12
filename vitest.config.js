import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        'src/routes/**/*',
        'src/main.jsx',
        'src/assets/**/*',
        'src/services/axios.js',
        'src/utils/prepare.js',
      ],
      reportsDirectory: './__tests__/coverage',
    },
  },
});
