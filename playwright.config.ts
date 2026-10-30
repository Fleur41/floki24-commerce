import { defineConfig, devices } from "@playwright/test";

const port = 3100;

/**
 * End-to-end tests run against a production build. Without store credentials
 * the app uses the public mock.shop catalog, so no secrets are needed.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
