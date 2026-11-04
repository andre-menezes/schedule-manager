import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTheme } from '@shared/composables/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('expõe o tema da store', () => {
    localStorage.setItem('app_theme', 'dark');

    const { theme, isDark } = useTheme();

    expect(theme.value).toBe('dark');
    expect(isDark.value).toBe(true);
  });

  it('alterna entre claro e escuro', () => {
    const { theme, isDark, toggleTheme } = useTheme();
    expect(theme.value).toBe('light');

    toggleTheme();
    expect(theme.value).toBe('dark');
    expect(isDark.value).toBe(true);

    toggleTheme();
    expect(theme.value).toBe('light');
    expect(isDark.value).toBe(false);
  });
});
