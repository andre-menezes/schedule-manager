import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { VApp } from 'vuetify/components';
import { MAIN_CONTENT_ID } from '@core/config';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

// O <v-main> depende do layout do <v-app>.
const Host = defineComponent({
  render: () => h(VApp, () => h(DefaultLayout, () => h('p', 'conteúdo'))),
});

let wrapper: VueWrapper | undefined;

function mountLayout() {
  wrapper = mountWithPlugins(Host, {
    attachTo: document.body,
    global: { stubs: { TheAppHeader: true, TheNavigationMenu: true } },
  });
  return wrapper;
}

describe('link "Pular para o conteúdo"', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('é o primeiro elemento focável e aponta para o conteúdo principal', () => {
    mountLayout();
    const first = document.body.querySelector(FOCUSABLE);

    expect(first?.getAttribute('data-cy')).toBe('skip-link');
    expect(first?.getAttribute('href')).toBe(`#${MAIN_CONTENT_ID}`);
    expect(first?.textContent?.trim()).toBe('Pular para o conteúdo');
  });

  it('o conteúdo principal é um <main> focável por script', () => {
    mountLayout();
    const main = document.getElementById(MAIN_CONTENT_ID);

    expect(main?.tagName).toBe('MAIN');
    expect(main?.getAttribute('tabindex')).toBe('-1');
  });

  it('ao ser acionado, leva o foco ao conteúdo principal', async () => {
    const layout = mountLayout();

    await layout.get('[data-cy="skip-link"]').trigger('click');

    expect(document.activeElement).toBe(document.getElementById(MAIN_CONTENT_ID));
  });
});
