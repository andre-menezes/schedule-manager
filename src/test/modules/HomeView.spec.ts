import { describe, expect, it } from 'vitest';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import HomeView from '@modules/home/views/HomeView.vue';

describe('HomeView', () => {
  it('mostra o título de boas-vindas com o nome do app', () => {
    const wrapper = mountWithPlugins(HomeView);

    expect(wrapper.find('[data-cy="home-title"]').text()).toBe('Bem-vindo ao Agenda');
  });

  it('mostra a descrição do produto', () => {
    const wrapper = mountWithPlugins(HomeView);

    expect(wrapper.text()).toContain('compromissos pessoais e atendimentos');
  });
});
