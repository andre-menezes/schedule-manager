import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import CodeBlock from '@modules/showcase/components/CodeBlock.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

/** Substitui `navigator.clipboard` por um mock (é um getter read-only no happy-dom). */
function stubClipboard(): ReturnType<typeof vi.fn> {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

describe('CodeBlock', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza o código informado', () => {
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'pnpm install' },
    });

    expect(wrapper.text()).toContain('pnpm install');
  });

  it('exibe o nome do arquivo e a linguagem no cabeçalho quando informados', () => {
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'const a = 1;', language: 'ts', filename: 'exemplo.ts' },
    });

    expect(wrapper.text()).toContain('exemplo.ts');
    expect(wrapper.text()).toContain('ts');
  });

  it('copia o código para a área de transferência ao clicar no botão', async () => {
    const writeText = stubClipboard();

    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'pnpm build' },
    });

    await wrapper.get('[data-cy=code-block-copy]').trigger('click');

    expect(writeText).toHaveBeenCalledWith('pnpm build');
  });

  it('indica a cópia no rótulo e volta ao estado inicial após 2 segundos', async () => {
    vi.useFakeTimers();
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, { props: { code: 'pnpm dev' } });
    const icon = () => wrapper.get('[data-cy=code-block-copy] .v-icon').text();
    expect(icon()).toBe('content_copy');

    await wrapper.get('[data-cy=code-block-copy]').trigger('click');
    await flushPromises();
    expect(icon()).toBe('check');

    vi.advanceTimersByTime(1999);
    await wrapper.vm.$nextTick();
    expect(icon()).toBe('check');

    vi.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(icon()).toBe('content_copy');
  });

  it('reinicia o prazo quando copia de novo antes de voltar ao estado inicial', async () => {
    vi.useFakeTimers();
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, { props: { code: 'pnpm dev' } });
    const button = wrapper.get('[data-cy=code-block-copy]');
    const icon = () => wrapper.get('[data-cy=code-block-copy] .v-icon').text();

    await button.trigger('click');
    await flushPromises();
    vi.advanceTimersByTime(1500);
    await button.trigger('click');
    await flushPromises();
    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    expect(icon()).toBe('check');
  });

  it('não indica cópia quando a área de transferência recusa a escrita', async () => {
    const writeText = stubClipboard();
    writeText.mockRejectedValue(new Error('NotAllowedError'));
    const wrapper = mountWithPlugins(CodeBlock, { props: { code: 'pnpm dev' } });

    await wrapper.get('[data-cy=code-block-copy]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-cy=code-block-copy] .v-icon').text()).toBe('content_copy');
  });
});
