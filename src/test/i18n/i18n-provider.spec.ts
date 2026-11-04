import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '@core/config';
import type { MessageSchema } from '@app/providers/i18n';

/** Importa o provider do zero: o locale inicial é resolvido no carregamento. */
async function loadProvider() {
  vi.resetModules();
  const provider = await import('@app/providers/i18n');
  return { ...provider, locale: provider.default.global.locale };
}

describe('provider de i18n', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sem preferência salva, inicia no locale padrão da configuração', async () => {
    const { locale } = await loadProvider();

    expect(locale.value).toBe('pt-BR');
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });

  it('a preferência salva prevalece sobre o locale padrão da configuração', async () => {
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', 'pt-BR');
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'en-US');

    const { locale, default: i18n } = await loadProvider();

    expect(locale.value).toBe('en-US');
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
    expect(i18n.global.t('nav.home')).toBe('Home');
  });

  it('sem preferência salva, usa VITE_APP_DEFAULT_LOCALE=en-US', async () => {
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', 'en-US');

    const { locale } = await loadProvider();

    expect(locale.value).toBe('en-US');
  });

  it('ignora uma preferência salva que não está entre os locales suportados', async () => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'fr-FR');

    const { locale } = await loadProvider();

    expect(locale.value).toBe('pt-BR');
  });

  it('setLocale troca o locale ativo, persiste a escolha e atualiza o <html lang>', async () => {
    const { locale, setLocale, default: i18n } = await loadProvider();

    setLocale('en-US');

    expect(locale.value).toBe('en-US');
    expect(i18n.global.t('nav.home')).toBe('Home');
    expect(localStorage.getItem(STORAGE_KEYS.LOCALE)).toBe('en-US');
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
  });

  it('persiste uma troca feita direto no locale global, como a do useI18n()', async () => {
    const { locale } = await loadProvider();

    locale.value = 'en-US';

    expect(localStorage.getItem(STORAGE_KEYS.LOCALE)).toBe('en-US');
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
  });

  it('não grava o locale inicial: sem escolha do usuário, nada é salvo', async () => {
    await loadProvider();

    expect(localStorage.getItem(STORAGE_KEYS.LOCALE)).toBeNull();
  });

  it('uma chave sem tradução no locale ativo cai no pt-BR (fallbackLocale)', async () => {
    const { default: i18n, setLocale } = await loadProvider();
    setLocale('en-US');
    // Simula uma tradução incompleta: o en-US fica sem mensagens.
    i18n.global.setLocaleMessage('en-US', {} as MessageSchema);

    expect(i18n.global.t('nav.home')).toBe('Início');
  });
});
