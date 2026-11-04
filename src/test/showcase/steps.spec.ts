import { describe, expect, it } from 'vitest';
import {
  buildOnboardingChecklist,
  buildOnboardingFaqs,
  buildOnboardingSteps,
} from '@modules/showcase/steps';
import { createAppI18n } from '@app/providers/i18n';

const { t } = createAppI18n('pt-BR').global;

// Só as chaves (sem carregar o conteúdo): os READMEs citados como referência.
const readmes = Object.keys(import.meta.glob('/src/**/README.md'));

/**
 * Um texto traduzido nunca é vazio nem a própria chave `onboarding.*` (o
 * vue-i18n devolve a chave quando ela não existe nas mensagens).
 */
function isTranslated(text: string): boolean {
  return text.trim() !== '' && !text.startsWith('onboarding.');
}

describe('passos do onboarding', () => {
  const steps = buildOnboardingSteps(t);

  it('monta os oito passos com título e descrição traduzidos', () => {
    expect(steps).toHaveLength(8);
    expect(steps.every((step) => isTranslated(step.title))).toBe(true);
    expect(steps.every((step) => isTranslated(step.description))).toBe(true);
  });

  it('usa títulos únicos (são a chave do v-for do stepper)', () => {
    expect(new Set(steps.map((step) => step.title)).size).toBe(steps.length);
  });

  it('todo passo traz código e linguagem; os exemplos de arquivo ficam no módulo customers', () => {
    expect(steps.every((step) => step.code.trim() !== '' && step.language !== '')).toBe(true);

    const filenames = steps.flatMap((step) => (step.filename ? [step.filename] : []));
    const outsideExample = filenames.filter(
      (file) =>
        !file.startsWith('src/modules/customers/') && !file.startsWith('src/test/customers/')
    );
    expect(outsideExample).toEqual([]);
  });

  it('as referências apontam para READMEs que existem no repositório', () => {
    const references = steps.flatMap((step) => (step.reference ? [`/${step.reference}`] : []));

    expect(references.length).toBeGreaterThan(0);
    expect(references.filter((reference) => !readmes.includes(reference))).toEqual([]);
  });

  it('os exemplos de SFC fecham o bloco <script> (montado fora do .vue)', () => {
    const sfcSteps = steps.filter((step) => step.language === 'vue');

    expect(sfcSteps.length).toBeGreaterThan(0);
    expect(sfcSteps.every((step) => step.code.includes('</script>'))).toBe(true);
  });

  it('termina com os comandos de validação', () => {
    expect(steps.at(-1)?.language).toBe('bash');
    expect(steps.at(-1)?.code).toContain('pnpm lint');
    expect(steps.at(-1)?.code).toContain('pnpm build');
    expect(steps.at(-1)?.code).toContain('pnpm test');
  });
});

describe('checklist do onboarding', () => {
  it('lista itens traduzidos e únicos', () => {
    const checklist = buildOnboardingChecklist(t);

    expect(checklist).toHaveLength(13);
    expect(checklist.every(isTranslated)).toBe(true);
    expect(new Set(checklist).size).toBe(checklist.length);
  });
});

describe('FAQ do onboarding', () => {
  it('traz pergunta e resposta traduzidas, com perguntas únicas', () => {
    const faqs = buildOnboardingFaqs(t);

    expect(faqs).toHaveLength(4);
    expect(faqs.every((faq) => isTranslated(faq.question) && isTranslated(faq.answer))).toBe(true);
    expect(new Set(faqs.map((faq) => faq.question)).size).toBe(faqs.length);
  });
});
