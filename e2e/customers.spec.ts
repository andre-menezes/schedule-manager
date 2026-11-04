import { expect, test } from '@playwright/test';
import { createCustomerHandlers } from '../mock/customers.ts';
import { expectNoA11yViolations } from './support/a11y';
import { routeMockApi } from './support/mock-api';

/**
 * CRUD de clientes (exemplo canônico). A API é atendida pelos handlers em
 * memória de `mock/customers.ts`, com 32 clientes iniciais.
 */
test.describe('Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await routeMockApi(page, createCustomerHandlers());
  });

  test('lista a primeira página e pagina pela URL', async ({ page }) => {
    await page.goto('/customers');

    await expect(page).toHaveTitle(/^Clientes · /);
    await expect(page.getByTestId('customer-link')).toHaveCount(10);
    await expect(page.getByTestId('customer-link').first()).toHaveText('Ana Souza');

    await page.getByRole('button', { name: /próxima página/i }).click();
    await expect(page).toHaveURL(/\/customers\?page=2$/);
    await expect(page.getByTestId('customer-link').first()).toHaveText('Carla Lima');

    await page.goBack();
    await expect(page.getByTestId('customer-link').first()).toHaveText('Ana Souza');
  });

  test('busca por nome ou e-mail', async ({ page }) => {
    await page.goto('/customers');

    await page.getByTestId('customer-search-input').locator('input').fill('costa');
    await page.getByTestId('customer-search-btn').click();

    await expect(page).toHaveURL(/search=costa/);
    await expect(page.getByTestId('customer-link')).toHaveCount(8);
  });

  test('cadastra, edita e exclui um cliente', async ({ page }) => {
    await page.goto('/customers');
    await page.getByTestId('customer-create-btn').click();
    await expect(page).toHaveURL(/\/customers\/new$/);

    await page.getByTestId('customer-name-input').locator('input').fill('Paula Teixeira');
    await page.getByTestId('customer-email-input').locator('input').fill('paula@example.com');
    await page.getByTestId('customer-submit-btn').click();

    await expect(page).toHaveURL(/\/customers\/33$/);
    await expect(page.getByTestId('customer-detail-title')).toHaveText('Paula Teixeira');
    await expect(page.getByTestId('notification-message')).toHaveText(
      'Cliente cadastrado: Paula Teixeira.'
    );
    // Visível, o snackbar também passa pela checagem de contraste.
    await expectNoA11yViolations(page);
    await page.getByTestId('notification-close').click();
    await expect(page.getByTestId('notification-message')).toBeHidden();

    await page.getByTestId('customer-edit-btn').click();
    await page.getByTestId('customer-name-input').locator('input').fill('Paula T. Lima');
    await page.getByTestId('customer-submit-btn').click();
    await expect(page.getByTestId('customer-detail-title')).toHaveText('Paula T. Lima');

    await page.getByTestId('customer-delete-btn').click();
    await page.getByTestId('customer-delete-confirm-btn').click();

    await expect(page).toHaveURL(/\/customers$/);
    await page.goto('/customers/33');
    await expect(page.getByTestId('customer-detail-error')).toContainText('Cliente não encontrado');
  });

  test('mostra a validação e o erro de e-mail repetido', async ({ page }) => {
    await page.goto('/customers/new');

    await page.getByTestId('customer-submit-btn').click();
    await expect(page.getByText('Campo obrigatório.').first()).toBeVisible();

    await page.getByTestId('customer-name-input').locator('input').fill('Outra Ana');
    await page.getByTestId('customer-email-input').locator('input').fill('ana.souza@example.com');
    await page.getByTestId('customer-submit-btn').click();

    await expect(page.getByTestId('customer-form-error')).toContainText('(HTTP 409)');
  });

  test('mostra o erro quando a API falha', async ({ page }) => {
    await page.route('**/api/customers?**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/problem+json',
        json: { title: 'Internal Server Error', status: 500, detail: 'Banco indisponível.' },
      })
    );
    await page.goto('/customers');

    await expect(page.getByTestId('customers-error')).toContainText('Banco indisponível.');
    await expect(page.getByTestId('error-state-retry')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('mostra os estados vazio e de não encontrado sem violações WCAG', async ({ page }) => {
    await page.goto('/customers?search=ninguem');
    await expect(page.getByTestId('empty-state-title')).toHaveText('Nenhum cliente encontrado.');
    await expectNoA11yViolations(page);

    await page.goto('/customers/999');
    await expect(page.getByTestId('customer-detail-error')).toContainText('Cliente não encontrado');
    await expectNoA11yViolations(page);
  });

  test('não tem violações WCAG A/AA na lista, no detalhe e no formulário', async ({ page }) => {
    await page.goto('/customers');
    await expect(page.getByTestId('customer-link')).toHaveCount(10);
    await expectNoA11yViolations(page);

    await page.goto('/customers/1');
    await expect(page.getByTestId('customer-details')).toBeVisible();
    await expectNoA11yViolations(page);

    await page.goto('/customers/1/edit');
    await expect(page.getByTestId('customer-form')).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
