import { expect, test } from '@playwright/test';

/**
 * Onboarding (`/onboarding`) — stepper de criação de feature, checklist e FAQ.
 */
test.describe('Página Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('carrega a página', async ({ page }) => {
    await expect(page.getByTestId('onboarding-page')).toBeVisible();
    await expect(page.getByTestId('onboarding-title')).toContainText(
      'Primeiros passos e como criar uma feature'
    );
    await expect(page).toHaveURL(/\/onboarding$/);
  });

  test('exibe o stepper no primeiro passo', async ({ page }) => {
    await expect(page.getByTestId('onboarding-stepper')).toBeVisible();
    const step = page.getByTestId('onboarding-step-1');
    await expect(step).toBeVisible();
    await expect(step).toContainText('Criar o módulo');
  });

  test('avança para o próximo passo do stepper', async ({ page }) => {
    await page.locator('.v-stepper-item', { hasText: 'Criar os tipos' }).click();
    const step = page.getByTestId('onboarding-step-2');
    await expect(step).toBeVisible();
    await expect(step).toContainText('Criar os tipos');
  });

  test('exibe o checklist de conclusão e o FAQ', async ({ page }) => {
    await expect(page.getByTestId('onboarding-checklist')).toBeVisible();
    await expect(page.getByTestId('onboarding-faq')).toBeVisible();
    await expect(page.getByText('Onde ficam as variáveis de ambiente?').first()).toBeVisible();
  });
});
