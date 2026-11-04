import { expect, test } from '@playwright/test';

/**
 * Componentes (`/componentes`) — vitrine de componentes e blocos de código.
 */
test.describe('Página Componentes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/componentes');
  });

  test('carrega a página', async ({ page }) => {
    await expect(page.getByTestId('components-page')).toBeVisible();
    await expect(page.getByTestId('components-title')).toContainText('Componentes');
    await expect(page).toHaveURL(/\/componentes$/);
  });

  test('exibe os cartões de showcase', async ({ page }) => {
    const cards = page.getByTestId('showcase-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(2);
    await expect(page.getByTestId('showcase-preview').first()).toBeVisible();
  });

  test('permite copiar um bloco de código', async ({ page }) => {
    await expect(page.getByTestId('code-block').first()).toBeVisible();
    await page.getByTestId('code-block-copy').first().click();
  });
});
