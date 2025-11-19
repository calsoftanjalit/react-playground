import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      all: true,
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/types/**',
        'src/vite-env.d.ts',
        'src/styles/**',
        '**/*.{css,scss,sass,less}',
      ],
    },
  },
})
