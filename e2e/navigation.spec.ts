import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

/**
 * Navegação acessível (ADR-0036): título da aba por rota e link "Pular para o
 * conteúdo". Usa só páginas que continuam existindo após o `template:clean`.
 */
test.describe('Navegação acessível', () => {
  test('o título da aba segue a rota', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/^Início · /);

    await page.goto('/pagina-que-nao-existe');
    await expect(page).toHaveTitle(/^Página não encontrada · /);
  });

  test('Tab foca o link "Pular para o conteúdo" e Enter leva ao conteúdo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
    const skipLink = page.getByTestId('skip-link');
    await expect(skipLink).not.toBeInViewport();

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
    await expect(skipLink).toHaveText('Pular para o conteúdo');
    // Visível, o link também passa pela checagem de contraste.
    await expectNoA11yViolations(page);

    await page.keyboard.press('Enter');
    await expect(page.locator('main#main-content')).toBeFocused();
  });
});
