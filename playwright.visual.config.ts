import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

import { BASE_URL, VISUAL_PORT } from './tests/visual/catering-spec.data'

/**
 * Dedicated config for the catering visual report generator.
 *
 * Kept separate from `playwright.config.ts` so this run never mixes with the
 * e2e suite: that config points at ./tests/e2e, this one at ./tests/visual.
 * Neither discovers the other's specs.
 *
 * Run with:  npm run report:visual
 */
export default defineConfig({
  testDir: './tests/visual',
  // The report is written in teardown, not in a test, so it is still produced
  // when a capture fails or the browser cannot start.
  globalTeardown: './tests/visual/global-teardown.ts',
  // Screenshots are captured in sequence; parallelism would interleave the logs
  // and fight over the same output files.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // Per-test cap; the capture tests raise their own via test.setTimeout.
  timeout: 360_000,
  // Plain console output — this is a generator, not a pass/fail suite, so the
  // HTML reporter would pop open an unrelated report at the end.
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'off',
    video: 'off',
    // Freeze CSS animations so captures are deterministic.
    launchOptions: { args: ['--force-prefers-reduced-motion'] },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    // `npm` is used rather than `pnpm` so the generator runs on any machine
    // regardless of which package manager is installed. The dedicated port
    // keeps this run clear of any unrelated dev server sitting on 3000.
    command: `npm run dev -- --port ${VISUAL_PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    // A cold Next.js dev build can take a while on first run.
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
