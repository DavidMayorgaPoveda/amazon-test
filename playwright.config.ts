import os from "node:os";
import { defineConfig, devices } from "@playwright/test";

const LOCAL_BASE_URL = process.env.LOCAL_BASE_URL ?? "http://127.0.0.1:3333";

export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  globalSetup: "./src/config/global-setup.ts",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    headless: false,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node app/server.js",
    url: LOCAL_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  projects: [
    {
      name: "ui",
      testDir: "./src/tests/ui",
      use: { ...devices["Desktop Chrome"], baseURL: LOCAL_BASE_URL },
    },
    {
      name: "api",
      testDir: "./src/tests/api",
      use: { baseURL: LOCAL_BASE_URL },
    },
    {
      name: "db",
      testDir: "./src/tests/db",
      use: { baseURL: LOCAL_BASE_URL },
    },
    {
      name: "e2e",
      testDir: "./src/tests/e2e",
      use: { ...devices["Desktop Chrome"], baseURL: LOCAL_BASE_URL },
    },
  ],
});
