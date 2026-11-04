import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

/**
 * Home (`/`) — página inicial do Agenda.
 */
test.describe('Página inicial', () => {
  test('carrega a página inicial', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Bem-vindo');
  });

  test('não tem violações WCAG A/AA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
