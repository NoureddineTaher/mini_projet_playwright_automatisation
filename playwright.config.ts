import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Lit les variables d'environnement depuis le fichier .env
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Voir https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Exécution des tests en parallèle */
  fullyParallel: true,
  /* Échoue sur le CI si test.only est resté dans le code */
  forbidOnly: !!process.env.CI,
  /* Nombre de tentatives sur le CI */
  retries: process.env.CI ? 2 : 0,
  /* Nombre de workers */
  workers: process.env.CI ? 1 : undefined,
  /* Format du rapport */
  reporter: 'html',
timeout: 60000, // Passe le timeout par défaut à 60 secondes
  expect: {
    timeout: 10000, // Les assertions ont 10s pour réussir
  },
  /* Paramètres partagés pour tous les projets */
  use: {
    /* Base URL pour les actions comme `await page.goto('/')` */
    /* On utilise la variable définie dans le .env */
    baseURL: process.env.BASE_URL_UI, 

    /* Capture des traces, screenshots et vidéos en cas d'échec */
    trace: 'retain-on-failure',
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
    video: 'retain-on-failure',
    
    launchOptions: {
      slowMo: 300,
    }
  },

  /* Configuration des projets par navigateur */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        actionTimeout: 10000,
        navigationTimeout: 15000
       },
    },
  ],
});