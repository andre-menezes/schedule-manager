import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { VApp } from 'vuetify/components';
import { MAIN_CONTENT_ID } from '@core/config';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';

// O <v-main> depende do layout do <v-app>.
const Host = defineComponent({
  render: () => h(VApp, () => h(EmptyLayout, () => h('p', { 'data-cy': 'page' }, 'conteúdo'))),
});

describe('EmptyLayout', () => {
  it('renderiza a página dentro de um <main> focável por script, sem header nem menu', () => {
    const wrapper = mountWithPlugins(Host);
    const main = wrapper.get(`#${MAIN_CONTENT_ID}`);

    expect(main.element.tagName).toBe('MAIN');
    expect(main.attributes('tabindex')).toBe('-1');
    expect(main.get('[data-cy=page]').text()).toBe('conteúdo');
    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.find('nav').exists()).toBe(false);
    expect(wrapper.find('[data-cy=skip-link]').exists()).toBe(false);
  });
});
