import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '@core/config';
import type { AppState } from '@typings/store';
import type { ThemeName } from '@typings/theme';

/**
 * Tema inicial: a escolha salva pelo usuário prevalece; sem ela, segue a
 * preferência do sistema (`prefers-color-scheme`).
 */
function resolveInitialTheme(): ThemeName {
  const persisted = localStorage.getItem(STORAGE_KEYS.THEME);
  if (persisted === 'dark' || persisted === 'light') {
    return persisted;
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: resolveInitialTheme(),
  }),

  actions: {
    switchTheme(): void {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
    },
  },
});
