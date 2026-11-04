import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useQuery } from '@tanstack/vue-query';
import { createPinia, setActivePinia } from 'pinia';
import { createQueryClient, notifyMutationError } from '@app/providers/query';
import { useNotificationStore } from '@shared/stores/notification.store';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('createQueryClient', () => {
  it('aplica os padrões do template', () => {
    const queries = createQueryClient().getDefaultOptions().queries;

    expect(queries).toMatchObject({ staleTime: 30_000, retry: 1, refetchOnWindowFocus: false });
  });
});

describe('erro de mutation (ADR-0040)', () => {
  async function failMutation(meta?: { notifyError?: boolean }) {
    const onMutationError = vi.fn();
    const mutation = createQueryClient(onMutationError)
      .getMutationCache()
      .build(createQueryClient(), {
        mutationFn: () => Promise.reject(new Error('falhou')),
        meta,
      });
    await mutation.execute(undefined).catch(() => undefined);
    return onMutationError;
  }

  it('repassa o erro ao handler global', async () => {
    const onMutationError = await failMutation();

    expect(onMutationError).toHaveBeenCalledWith(expect.objectContaining({ message: 'falhou' }));
  });

  it('não repassa quando a mutation pede notifyError: false', async () => {
    expect(await failMutation({ notifyError: false })).not.toHaveBeenCalled();
  });

  it('funciona sem handler', async () => {
    const mutation = createQueryClient()
      .getMutationCache()
      .build(createQueryClient(), { mutationFn: () => Promise.reject(new Error('x')) });

    await expect(mutation.execute(undefined)).rejects.toThrow('x');
  });

  it('o handler do app notifica com os fallbacks traduzidos', () => {
    setActivePinia(createPinia());

    notifyMutationError(null);

    expect(useNotificationStore().current).toMatchObject({
      type: 'error',
      message: 'Erro inesperado.',
    });
  });
});

describe('padrão de busca com useQuery', () => {
  /** Monta um componente que busca dados como uma view de módulo faria. */
  function mountWithQuery(fetcher: (signal: AbortSignal) => Promise<string[]>) {
    const Probe = defineComponent({
      setup() {
        const { data, error, isPending } = useQuery({
          queryKey: ['probe'],
          queryFn: ({ signal }) => fetcher(signal),
        });
        return () =>
          h('p', isPending.value ? 'carregando' : error.value ? 'erro' : data.value?.join(','));
      },
    });
    return mountWithPlugins(Probe);
  }

  it('repassa o signal ao service e expõe os dados', async () => {
    const fetcher = vi.fn().mockResolvedValue(['a', 'b']);
    const wrapper = mountWithQuery(fetcher);

    expect(wrapper.text()).toBe('carregando');
    await flushPromises();

    expect(fetcher).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(wrapper.text()).toBe('a,b');
  });

  it('expõe o erro sem deixar o loading preso', async () => {
    const wrapper = mountWithQuery(vi.fn().mockRejectedValue(new Error('falhou')));

    await flushPromises();

    expect(wrapper.text()).toBe('erro');
  });
});
