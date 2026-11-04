import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { VDialog } from 'vuetify/components';
import BaseAvatar from '@shared/ui/components/BaseAvatar.vue';
import BaseConfirmDialog from '@shared/ui/components/BaseConfirmDialog.vue';
import BaseEventBlock from '@shared/ui/components/BaseEventBlock.vue';
import BasePageHeader from '@shared/ui/components/BasePageHeader.vue';
import BaseStatusChip from '@shared/ui/components/BaseStatusChip.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('BaseStatusChip', () => {
  it('usa o fundo container do tom e mostra o rótulo', () => {
    const wrapper = mountWithPlugins(BaseStatusChip, {
      props: { label: 'Confirmado', tone: 'success', icon: 'check_circle' },
    });

    expect(wrapper.text()).toContain('Confirmado');
    expect(wrapper.get('[data-cy=status-chip]').classes()).toContain('bg-success-container');
  });
});

describe('BaseAvatar', () => {
  it('mostra as iniciais e anuncia o nome', () => {
    const wrapper = mountWithPlugins(BaseAvatar, { props: { name: 'Maria Souza', hue: 'teal' } });
    const avatar = wrapper.get('[data-cy=avatar]');

    expect(avatar.text()).toBe('MS');
    expect(avatar.attributes('aria-label')).toBe('Maria Souza');
    expect(avatar.attributes('role')).toBe('img');
    expect(avatar.classes()).toContain('bg-event-teal-bg');
  });

  it('decorativo, fica fora do leitor de tela; sem matiz, a cor vem do nome', () => {
    const wrapper = mountWithPlugins(BaseAvatar, {
      props: { name: 'Maria Souza', decorative: true, size: 32 },
    });
    const avatar = wrapper.get('[data-cy=avatar]');

    expect(avatar.attributes('aria-hidden')).toBe('true');
    expect(avatar.attributes('aria-label')).toBeUndefined();
    expect(avatar.classes().some((name) => name.startsWith('bg-event-'))).toBe(true);
  });
});

describe('BasePageHeader', () => {
  it('mostra título, sobretítulo, subtítulo e os slots', () => {
    const wrapper = mountWithPlugins(BasePageHeader, {
      props: { title: 'Clientes', overline: 'Cadastros', subtitle: 'Todos os clientes' },
      slots: {
        prepend: () => h('span', { 'data-cy': 'prepend' }),
        actions: () => h('button', { 'data-cy': 'action' }, 'Novo'),
      },
    });

    expect(wrapper.get('h1').text()).toBe('Clientes');
    expect(wrapper.text()).toContain('Cadastros');
    expect(wrapper.text()).toContain('Todos os clientes');
    expect(wrapper.find('[data-cy=prepend]').exists()).toBe(true);
    expect(wrapper.find('[data-cy=action]').exists()).toBe(true);
  });

  it('só com o título, não desenha os opcionais', () => {
    const wrapper = mountWithPlugins(BasePageHeader, { props: { title: 'Clientes' } });

    expect(wrapper.findAll('p')).toHaveLength(0);
  });
});

describe('BaseEventBlock', () => {
  it('desenha hora, título e subtítulo com a cor do evento', () => {
    const wrapper = mountWithPlugins(BaseEventBlock, {
      props: { title: 'Reunião com Ana', time: '09:00', hue: 'indigo', subtitle: 'Online' },
    });
    const block = wrapper.get('[data-cy=event-block]');

    expect(block.element.tagName).toBe('DIV');
    expect(block.classes()).toContain('bg-event-indigo-bg');
    expect(block.text()).toContain('09:00');
    expect(block.text()).toContain('Online');
  });

  it('compacto, esconde o subtítulo', () => {
    const wrapper = mountWithPlugins(BaseEventBlock, {
      props: { title: 'Almoço', time: '12:00', hue: 'green', subtitle: 'Fora', compact: true },
    });

    expect(wrapper.get('[data-cy=event-block]').classes()).toContain('base-event-block--compact');
    expect(wrapper.text()).not.toContain('Fora');
  });

  it('clicável, vira botão e emite select', async () => {
    const wrapper = mountWithPlugins(BaseEventBlock, {
      props: { title: 'Academia', time: '15:30', hue: 'teal', clickable: true },
    });
    const block = wrapper.get('[data-cy=event-block]');

    await block.trigger('click');

    expect(block.element.tagName).toBe('BUTTON');
    expect(wrapper.emitted('select')).toHaveLength(1);
  });

  it('sem clickable, o clique não emite', async () => {
    const wrapper = mountWithPlugins(BaseEventBlock, {
      props: { title: 'Academia', time: '15:30', hue: 'teal' },
    });

    await wrapper.get('[data-cy=event-block]').trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
  });
});

describe('BaseConfirmDialog', () => {
  let wrapper: VueWrapper | undefined;
  /** O conteúdo do v-dialog é teleportado para o <body>. */
  const inBody = (cy: string) => document.body.querySelector<HTMLElement>(`[data-cy="${cy}"]`);

  beforeEach(() => {
    vi.stubGlobal('visualViewport', new EventTarget());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
  });

  async function open(props: Record<string, unknown> = {}) {
    wrapper = mountWithPlugins(BaseConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Excluir cliente',
        message: 'Excluir Maria?',
        confirmLabel: 'Excluir',
        ...props,
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    return wrapper;
  }

  it('mostra título, mensagem e o cancelar padrão traduzido', async () => {
    await open();

    expect(inBody('confirm-dialog')?.textContent).toContain('Excluir Maria?');
    expect(inBody('confirm-dialog-cancel')?.textContent).toContain('Cancelar');
    expect(inBody('confirm-dialog-error')).toBeNull();
  });

  it('confirma, cancela e repassa o fechamento do próprio diálogo', async () => {
    const dialog = await open({ cancelLabel: 'Voltar', tone: 'error' });

    inBody('confirm-dialog-confirm')?.click();
    inBody('confirm-dialog-cancel')?.click();
    dialog.findComponent(VDialog).vm.$emit('update:modelValue', false);

    expect(inBody('confirm-dialog-cancel')?.textContent).toContain('Voltar');
    expect(dialog.emitted('confirm')).toHaveLength(1);
    expect(dialog.emitted('update:modelValue')).toEqual([[false], [false]]);
  });

  it('mostra o erro da ação', async () => {
    await open({ errorMessage: 'Falhou (HTTP 500)' });

    expect(inBody('confirm-dialog-error')?.textContent).toContain('Falhou (HTTP 500)');
  });
});
