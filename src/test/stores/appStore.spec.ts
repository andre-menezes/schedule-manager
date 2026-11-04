import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@shared/stores/app.store';

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('inicia com o tema salvo', () => {
    localStorage.setItem('app_theme', 'dark');

    const store = useAppStore();

    expect(store.theme).toBe('dark');
  });

  it('alterna e persiste o tema', () => {
    const store = useAppStore();

    store.switchTheme();
    expect(store.theme).toBe('dark');
    expect(localStorage.getItem('app_theme')).toBe('dark');

    store.switchTheme();
    expect(store.theme).toBe('light');
    expect(localStorage.getItem('app_theme')).toBe('light');
  });
});
