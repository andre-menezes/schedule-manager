import { defineConfig, devices } from '@playwright/test';

/**
 * Porta dedicada aos testes E2E: não colide com o `pnpm dev` (9081) nem com
 * outros projetos rodando na máquina.
 */
const PORT = 9091;
const baseURL = `http://localhost:${PORT}`;
const isCI = Boolean(process.env.CI);

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    // Os componentes já expõem `data-cy`; `getByTestId` usa esse atributo.
    testIdAttribute: 'data-cy',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Sobe o Vite no modo `test` (valores padrão de `@core/config`), sem
  // depender do `.env.development.local` de cada máquina.
  webServer: {
    command: `pnpm exec vite --mode test --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
