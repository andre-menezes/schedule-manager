import { computed } from 'vue';
import { useAppStore } from '@shared/stores/app.store';
import type { ThemeName } from '@typings/theme';

/**
 * Composable para controle reativo do tema da aplicação.
 *
 * @example
 * const { theme, isDark, toggleTheme } = useTheme();
 */
export function useTheme() {
  const appStore = useAppStore();

  const theme = computed<ThemeName>(() => appStore.theme);
  const isDark = computed(() => appStore.theme === 'dark');

  function toggleTheme(): void {
    appStore.switchTheme();
  }

  return {
    theme,
    isDark,
    toggleTheme,
  };
}
