import { expect, test } from '@playwright/test';

/**
 * Documentação (`/docs`) — hub de entrada das telas do módulo showcase.
 */
test.describe('Hub da documentação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs');
  });

  test('carrega o hub', async ({ page }) => {
    await expect(page.getByTestId('docs-home-page')).toBeVisible();
    await expect(page.getByTestId('docs-home-title')).toContainText('Vue 3 Template');
    await expect(page).toHaveURL('/docs');
  });

  test('exibe os cartões de navegação da documentação', async ({ page }) => {
    const cards = page.getByTestId('nav-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(3);
    await expect(page.getByText('Arquitetura').first()).toBeVisible();
    await expect(page.getByText('Onboarding').first()).toBeVisible();
  });

  test('exibe o fluxo de trabalho', async ({ page }) => {
    await expect(page.getByText('Fluxo de trabalho').first()).toBeVisible();
  });

  test('navega para a seção de arquitetura ao clicar no cartão', async ({ page }) => {
    await page.locator('[data-cy=nav-card][data-cy-route="/arquitetura"]').click();
    await expect(page).toHaveURL(/\/arquitetura$/);
  });
});
