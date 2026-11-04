import '@app/styles/icons.scss';
import '@app/styles/main.scss';

/**
 * `matchMedia` simulado. Consultas de largura (`min-width`/`max-width` em px)
 * são avaliadas contra `window.innerWidth`, como o Vuetify faz para os
 * breakpoints do `useDisplay`; as demais (ex.: `prefers-color-scheme`) não
 * casam.
 */
function matchesQuery(query: string): boolean {
  const width = /\((min|max)-width:\s*([\d.]+)px\)/.exec(query);
  if (!width) return false;
  const px = Number(width[2]);
  return width[1] === 'min' ? window.innerWidth >= px : window.innerWidth <= px;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: matchesQuery(query),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

if (typeof globalThis.localStorage === 'undefined') {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  } satisfies Storage;

  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
}
