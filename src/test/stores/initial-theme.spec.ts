import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@shared/stores/app.store';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Simula o `prefers-color-scheme` do sistema. */
function mockSystemTheme(prefersDark: boolean) {
  const matchMedia = vi.fn((query: string) => ({
    matches: prefersDark && query === DARK_QUERY,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
  vi.stubGlobal('matchMedia', matchMedia);
  return matchMedia;
}

describe('tema inicial da appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sem preferência salva, usa o tema escuro quando o sistema prefere escuro', () => {
    const matchMedia = mockSystemTheme(true);

    expect(useAppStore().theme).toBe('dark');
    expect(matchMedia).toHaveBeenCalledWith(DARK_QUERY);
  });

  it('sem preferência salva, usa o tema claro quando o sistema prefere claro', () => {
    mockSystemTheme(false);

    expect(useAppStore().theme).toBe('light');
  });

  it('a preferência salva prevalece sobre o sistema', () => {
    const matchMedia = mockSystemTheme(true);
    localStorage.setItem('app_theme', 'light');

    expect(useAppStore().theme).toBe('light');
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('ignora valor salvo inválido e segue o sistema', () => {
    mockSystemTheme(true);
    localStorage.setItem('app_theme', 'roxo');

    expect(useAppStore().theme).toBe('dark');
  });

  it('usa o tema claro quando o navegador não tem matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);

    expect(useAppStore().theme).toBe('light');
  });
});
