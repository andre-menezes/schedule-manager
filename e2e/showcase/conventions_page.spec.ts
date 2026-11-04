import { expect, test } from '@playwright/test';

/**
 * Convenções (`/convencoes`) — tipos de commit e checklist de code review.
 */
test.describe('Página Convenções', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/convencoes');
  });

  test('carrega a página', async ({ page }) => {
    await expect(page.getByTestId('conventions-page')).toBeVisible();
    await expect(page.getByTestId('conventions-title')).toContainText('Convenções');
    await expect(page).toHaveURL(/\/convencoes$/);
  });

  test('exibe a tabela de tipos de commit', async ({ page }) => {
    await expect(page.getByText('feat').first()).toBeVisible();
    await expect(page.getByText('Correção de bug').first()).toBeVisible();
  });

  test('exibe o checklist de code review', async ({ page }) => {
    await expect(page.getByTestId('review-checklist')).toBeVisible();
    await expect(page.getByText('Arquitetura').first()).toBeVisible();
  });
});
