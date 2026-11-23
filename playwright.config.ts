import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

const isCI = !!process.env.CI;

const BASE_URL_UI = process.env.BASE_URL_UI;

if (!BASE_URL_UI) {
  throw new Error('BASE_URL_UI est manquante dans la configuration.');
}

export default defineConfig({

  testDir: './tests',

  fullyParallel: false,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  workers: 1,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],

  timeout: 60000,

  expect: {
    timeout: 10000
  },

  use: {
    baseURL: BASE_URL_UI,

    locale: 'fr-FR',

    timezoneId: 'Europe/Paris',

    trace: 'retain-on-failure',

    headless: true,

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    actionTimeout: isCI ? 30000 : 10000,

    navigationTimeout: isCI ? 30000 : 15000,
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
