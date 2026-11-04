import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';

const PAGES = ['/docs', '/arquitetura', '/onboarding', '/componentes', '/convencoes', '/decisoes'];

/** Chave do locale salvo (`STORAGE_KEYS.LOCALE` em `@core/config`). */
const LOCALE_STORAGE_KEY = 'app_locale';

test.describe('Acessibilidade da documentação', () => {
  for (const path of PAGES) {
    test(`${path} não tem violações WCAG A/AA`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expectNoA11yViolations(page);
    });
  }

  // Textos em inglês têm outro tamanho e o `lang` muda: o axe roda de novo.
  test.describe('em en-US', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(({ key, locale }) => localStorage.setItem(key, locale), {
        key: LOCALE_STORAGE_KEY,
        locale: 'en-US',
      });
    });

    for (const path of PAGES) {
      test(`${path} não tem violações WCAG A/AA`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
        await expectNoA11yViolations(page);
      });
    }
  });
});
