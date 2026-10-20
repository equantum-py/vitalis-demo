import { defineConfig, devices } from "@playwright/test";

// CHROMIUM_PATH permite usar un navegador ya instalado (p. ej. en el entorno de build).
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: "movil-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: "escritorio-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100/demo",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
