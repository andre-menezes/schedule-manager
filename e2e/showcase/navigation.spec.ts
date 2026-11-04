import { expect, test } from '@playwright/test';

/** Navegação pelo menu lateral entre as páginas da documentação (ADR-0036). */
test.describe('Navegação pelo menu', () => {
  test('atualiza o título da aba e leva o foco ao conteúdo', async ({ page }) => {
    await page.goto('/docs');
    await expect(page).toHaveTitle(/^Documentação · /);
    // O carregamento inicial não move o foco.
    await expect(page.locator('main#main-content')).not.toBeFocused();

    await page.getByRole('navigation').getByRole('link', { name: 'Arquitetura' }).click();

    await expect(page).toHaveURL(/\/arquitetura$/);
    await expect(page).toHaveTitle(/^Arquitetura · /);
    await expect(page.locator('main#main-content')).toBeFocused();
  });
});
