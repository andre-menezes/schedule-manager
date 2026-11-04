import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

/**
 * Troca de idioma pelo seletor do cabeçalho (ADR-0038). Usa só a página
 * inicial.
 */
async function switchToEnglish(page: Page): Promise<void> {
  await page.getByTestId('locale-menu-btn').click();
  await page.getByTestId('locale-option-en-US').click();
}

test.describe('Seletor de idioma', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('começa em pt-BR', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByTestId('home-title')).toContainText('Bem-vindo');
    await expect(page.getByTestId('locale-menu-btn')).toHaveAccessibleName('Alterar idioma');
  });

  test('trocar para English muda os textos, o <html lang> e o título da aba', async ({ page }) => {
    await switchToEnglish(page);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await expect(page.getByTestId('home-title')).toContainText('Welcome');
    await expect(page).toHaveTitle(/^Home · /);
    await expect(page.getByTestId('locale-menu-btn')).toHaveAccessibleName('Change language');
  });

  test('o menu marca o idioma ativo', async ({ page }) => {
    await switchToEnglish(page);
    await page.getByTestId('locale-menu-btn').click();

    await expect(page.getByTestId('locale-option-en-US')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('locale-option-pt-BR')).toHaveAttribute('aria-checked', 'false');
  });

  test('a escolha persiste depois de recarregar a página', async ({ page }) => {
    await switchToEnglish(page);
    await expect(page.getByTestId('home-title')).toContainText('Welcome');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await expect(page.getByTestId('home-title')).toContainText('Welcome');
    await expect(page).toHaveTitle(/^Home · /);
  });

  test('funciona pelo teclado', async ({ page }) => {
    await page.getByTestId('locale-menu-btn').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('locale-menu')).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('locale-option-en-US')).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await expect(page.getByTestId('locale-menu')).toBeHidden();
  });

  test.describe('acessibilidade', () => {
    test('o menu aberto não tem violações WCAG A/AA', async ({ page }) => {
      await page.getByTestId('locale-menu-btn').click();
      await expect(page.getByTestId('locale-menu')).toBeVisible();

      await expectNoA11yViolations(page);
    });

    test('em English, a página não tem violações WCAG A/AA', async ({ page }) => {
      await switchToEnglish(page);
      await expect(page.getByTestId('home-title')).toContainText('Welcome');
      await expect(page.getByTestId('locale-menu')).toBeHidden();

      await expectNoA11yViolations(page);
    });
  });
});
