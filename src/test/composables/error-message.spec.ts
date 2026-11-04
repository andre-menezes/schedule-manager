import { describe, expect, it } from 'vitest';
import { defineComponent, type Plugin } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { useErrorMessage } from '@shared/composables';
import { createAppI18n } from '@app/providers/i18n';

type ErrorMessageFn = ReturnType<typeof useErrorMessage>;

function setup(i18n: Plugin = createAppI18n('pt-BR')): ErrorMessageFn {
  let errorMessage: ErrorMessageFn | undefined;
  const Host = defineComponent({
    setup() {
      errorMessage = useErrorMessage();
      return () => null;
    },
  });
  mount(Host, { global: { plugins: [i18n] } });
  return errorMessage!;
}

describe('useErrorMessage', () => {
  it('usa os textos de errors.* do locale como fallback', () => {
    const errorMessage = setup();

    expect(errorMessage({})).toBe('Erro inesperado.');
    expect(errorMessage({ status: 500 })).toBe('Erro na requisição (HTTP 500)');
  });

  it('segue o locale ativo', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en: { errors: { unexpected: 'Unexpected error.', requestFailed: 'Failed' } } },
    });
    const errorMessage = setup(i18n);

    expect(errorMessage({})).toBe('Unexpected error.');
  });

  it('aceita um fallback específico por chamada', () => {
    const errorMessage = setup();

    expect(errorMessage({}, { unexpected: 'Falha na transferência.' })).toBe(
      'Falha na transferência.'
    );
    expect(errorMessage({ data: { detail: 'Sem saldo.' } })).toBe('Sem saldo.');
  });
});
