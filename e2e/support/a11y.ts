import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Critérios verificados: WCAG 2.1 níveis A e AA. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Falha o teste se a página tiver violações de acessibilidade. A mensagem
 * lista a regra do axe e os seletores afetados, para facilitar a correção.
 */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  // Uma transição CSS em andamento (ex.: o cabeçalho da tabela ao montar)
  // mostra cores intermediárias, e o axe mediria o contraste no meio dela.
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running')
  );
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = violations.map(({ id, impact, nodes }) => ({
    id,
    impact,
    targets: nodes.map((node) => node.target.join(' ')),
  }));

  expect(summary).toEqual([]);
}
