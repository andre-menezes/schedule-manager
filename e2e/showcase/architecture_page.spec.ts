import { expect, test } from '@playwright/test';

/**
 * Arquitetura (`/arquitetura`) — camadas, regras de dependência e fluxos.
 */
test.describe('Página Arquitetura', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/arquitetura');
  });

  test('carrega a página', async ({ page }) => {
    await expect(page.getByTestId('architecture-page')).toBeVisible();
    await expect(page.getByTestId('architecture-title')).toContainText('Arquitetura em camadas');
    await expect(page).toHaveURL(/\/arquitetura$/);
  });

  test('exibe os cartões das camadas', async ({ page }) => {
    const cards = page.getByTestId('layer-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(4);
    await expect(page.getByText('modules').first()).toBeVisible();
    await expect(page.getByText('shared').first()).toBeVisible();
  });

  test('exibe a tabela de regras de dependência', async ({ page }) => {
    await expect(page.getByTestId('dependency-rules')).toBeVisible();
    await expect(page.getByText('Não pode importar de').first()).toBeVisible();
  });

  test('exibe o fluxo de inicialização', async ({ page }) => {
    await expect(page.getByTestId('flow-steps').first()).toBeVisible();
  });

  test('permite copiar um bloco de código', async ({ page }) => {
    await expect(page.getByTestId('code-block').first()).toBeVisible();
    await page.getByTestId('code-block-copy').first().click();
  });
});
