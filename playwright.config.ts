import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  // Half the cores is Playwright's default and it starves Firefox: eight
  // concurrent instances time out twenty-two of its eighty-three tests here,
  // while four pass every one.
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
    command: 'vp dev --force --host 127.0.0.1 --port 4173',
    cwd: './apps/app',
    // Reusing a server keeps a stale dependency cache, so a run after a
    // package rebuild fails with timeouts that look like product bugs.
    reuseExistingServer: false,
    url: 'http://127.0.0.1:4173',
  },
});
