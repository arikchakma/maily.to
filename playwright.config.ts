import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  // Firefox runs slower with more than four workers.
  workers: '25%',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
  reporter: 'list',
  testDir: './apps/app/tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'vp build && vp preview --host 127.0.0.1 --port 4173 --strictPort',
    cwd: './apps/app',
    url: 'http://127.0.0.1:4173',
  },
});
