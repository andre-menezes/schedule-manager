import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEnvVar, isSupportedLocale, parseDefaultLocale } from '@core/config';

describe('getEnvVar', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('usa o valor definido no ambiente', () => {
    vi.stubEnv('VITE_APP_NAME', 'Meu Sistema');

    expect(getEnvVar('VITE_APP_NAME', 'Vue Template')).toBe('Meu Sistema');
  });

  it('usa o valor padrão quando a variável está vazia', () => {
    vi.stubEnv('VITE_APP_NAME', '');

    expect(getEnvVar('VITE_APP_NAME', 'Vue Template')).toBe('Vue Template');
  });

  it('falha com a variável no erro quando não há valor nem padrão', () => {
    vi.stubEnv('VITE_APP_NAME', '');

    expect(() => getEnvVar('VITE_APP_NAME')).toThrow(
      '[Config Error]: A variável de ambiente VITE_APP_NAME não foi definida.'
    );
  });
});

describe('locale padrão', () => {
  it('reconhece só os locales suportados', () => {
    expect(isSupportedLocale('pt-BR')).toBe(true);
    expect(isSupportedLocale('en-US')).toBe(true);
    expect(isSupportedLocale('fr-FR')).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
  });

  it('aceita os locales suportados', () => {
    expect(parseDefaultLocale('pt-BR')).toBe('pt-BR');
    expect(parseDefaultLocale('en-US')).toBe('en-US');
  });

  it('falha com o valor e a lista suportada quando o locale não é suportado', () => {
    expect(() => parseDefaultLocale('fr-FR')).toThrow(
      '[Config Error]: VITE_APP_DEFAULT_LOCALE="fr-FR" não está entre os locales suportados (pt-BR, en-US).'
    );
  });
});

describe('constantes de configuração', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('lê as variáveis do ambiente ao carregar', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.gov.br');
    vi.resetModules();

    const { API_BASE_URL } = await import('@core/config');

    expect(API_BASE_URL).toBe('https://api.exemplo.gov.br');
  });

  it('aceita VITE_APP_DEFAULT_LOCALE=en-US', async () => {
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', 'en-US');
    vi.resetModules();

    const { DEFAULT_LOCALE } = await import('@core/config');

    expect(DEFAULT_LOCALE).toBe('en-US');
  });

  it('falha ao carregar com um VITE_APP_DEFAULT_LOCALE não suportado', async () => {
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', 'fr-FR');
    vi.resetModules();

    await expect(import('@core/config')).rejects.toThrow('VITE_APP_DEFAULT_LOCALE="fr-FR"');
  });

  it('roda sem nenhum .env, com os valores padrão', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    vi.stubEnv('VITE_APP_NAME', '');
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', '');
    vi.resetModules();

    const config = await import('@core/config');

    expect([config.API_BASE_URL, config.APP_NAME, config.DEFAULT_LOCALE]).toEqual([
      '/api',
      'Vue Template',
      'pt-BR',
    ]);
  });
});
