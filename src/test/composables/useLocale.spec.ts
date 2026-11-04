import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { createAppI18n } from '@app/providers/i18n';
import { useLocale } from '@shared/composables';

function setup(i18n = createAppI18n('pt-BR')) {
  let result: ReturnType<typeof useLocale> | undefined;
  const Host = defineComponent({
    setup() {
      result = useLocale();
      return () => h('div');
    },
  });
  mount(Host, { global: { plugins: [i18n] } });
  if (!result) throw new Error('useLocale não foi chamado');
  return { ...result, i18n };
}

describe('useLocale', () => {
  it('expõe o locale ativo do vue-i18n', () => {
    const { locale } = setup(createAppI18n('en-US'));

    expect(locale.value).toBe('en-US');
  });

  it('setLocale troca o locale global e as mensagens', () => {
    const { locale, setLocale, i18n } = setup();

    setLocale('en-US');

    expect(locale.value).toBe('en-US');
    expect(i18n.global.locale.value).toBe('en-US');
    expect(i18n.global.t('nav.home')).toBe('Home');
  });
});
