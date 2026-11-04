import { expect, test } from '@playwright/test';

/**
 * Decisões (`/decisoes`) — índice de ADRs gerado a partir de `docs/decisions`.
 */
test.describe('Página Decisões', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decisoes');
  });

  test('carrega a página', async ({ page }) => {
    await expect(page.getByTestId('decisions-page')).toBeVisible();
    await expect(page.getByTestId('decisions-title')).toContainText('Decisões');
    await expect(page).toHaveURL(/\/decisoes$/);
  });

  test('exibe a tabela de ADRs', async ({ page }) => {
    await expect(page.getByTestId('adr-table')).toBeVisible();
    await expect(page.getByText('ADR-0001').first()).toBeVisible();
    await expect(
      page.getByText('Arquitetura em camadas e regras de dependência').first()
    ).toBeVisible();
  });
});
