# test

Pasta de testes automatizados do frontend.

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Ferramentas

| Ferramenta     | Tipo                   | Onde                         |
| -------------- | ---------------------- | ---------------------------- |
| Vitest         | Unitários e integração | `src/test/**/*.spec.ts`      |
| Vue Test Utils | Mount de componentes   | `src/test/components/`       |
| happy-dom      | DOM simulado           | Configurado em `vite.config` |
| Playwright     | End-to-end             | `e2e/**/*.spec.ts`           |

## Organização de `src/test/`

| Pasta           | Conteúdo                                                              |
| --------------- | --------------------------------------------------------------------- |
| `api/`          | Camada HTTP (instâncias)                                              |
| `app/`          | `App.vue`, providers, rotas do app e dos módulos base                 |
| `architecture/` | Regras de dependência entre camadas                                   |
| `components/`   | Componentes e layouts de `shared/ui` (renderização, emits)            |
| `composables/`  | Composables de `shared/composables`                                   |
| `core/`         | `core/config` (variáveis de ambiente)                                 |
| `helpers/`      | `shared/helpers` (ex.: download de arquivos)                          |
| `i18n/`         | Mensagens, paridade entre locales e provider de i18n                  |
| `modules/`      | Views e lógica de módulos (ex.: `HomeView`)                           |
| `services/`     | Services de `shared/api/services`                                     |
| `stores/`       | Estado global (Pinia)                                                 |
| `utils/`        | `shared/utils` e os helpers `mountWithPlugins` e `loadRouteComponent` |
| `setup.ts`      | Bootstrap do ambiente (mocks globais)                                 |

## Comandos

```bash
pnpm test                 # unitários (single run)
pnpm test:watch           # unitários (watch mode)
pnpm test:coverage        # cobertura com relatório
pnpm test:e2e             # E2E headless (Playwright)
pnpm test:e2e:open        # E2E interativo (Playwright UI)
pnpm test:all             # unitários + E2E
```

## Thresholds de cobertura

Definidos em `vite.config.ts`. O pipeline falha se a cobertura cair abaixo de:

| Métrica    | Mínimo |
| ---------- | ------ |
| Lines      | 100%   |
| Functions  | 100%   |
| Branches   | 98%    |
| Statements | 100%   |

Os valores são um **piso que só sobe** (ratchet — ADR-0016): refletem a
cobertura real medida e devem ser elevados em `vite.config.ts` sempre que a
cobertura aumentar. A fonte de verdade é o `coverage.thresholds` do
`vite.config.ts`.

## Convenções de nomenclatura

- Testes unitários: `<nome>.spec.ts` em `src/test/`.
- Testes E2E: `<nome>.spec.ts` em `e2e/`.
- Nomes de `describe`: nome do módulo/funcionalidade testada.
- Nomes de `it`: frase em português descrevendo o comportamento esperado.

## Setup (`setup.ts`)

O arquivo `setup.ts` prepara o ambiente global antes de cada suite:

- Mock de `window.matchMedia` (necessário para Vuetify).
- Polyfill de `localStorage`/`sessionStorage` (happy-dom).

## Helper `mountWithPlugins`

Utilitário para montar componentes com todos os plugins do projeto injetados:

```ts
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const wrapper = mountWithPlugins(MyComponent, {
  props: { title: 'Teste' },
});
```

Ele registra Vuetify, i18n, Pinia, router e TanStack Query, com o locale do
Vuetify ligado ao do i18n, como na aplicação (ADR-0038). Cada montagem recebe
um `QueryClient` novo e sem retentativas, para que o cache não vaze entre testes
e um erro mockado apareça na primeira tentativa. O padrão de teste de uma query
está em `src/test/api/query.spec.ts`.

## Helper `loadRouteComponent`

Executa o `import()` lazy de uma rota e devolve o componente carregado, para o
teste conferir que a rota abre a view certa:

```ts
import routes from '@modules/home/routes';
import HomeView from '@modules/home/views/HomeView.vue';
import { loadRouteComponent } from '@test/utils/route-component';

expect(await loadRouteComponent(routes[0])).toBe(HomeView);
```

O router do app importa só os `routes.ts` de `app/` e `modules/`
(`import.meta.glob('@/{app,modules}/**/routes.ts')`), então um helper ou
fixture com esse nome em `src/test/` não vira rota. O `router.spec.ts`
verifica isso com a fixture `src/test/fixtures/stray-routes/routes.ts`.

## Exemplo — bom código (teste focado com mock isolado)

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@shared/stores/app.store';

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('alterna o tema de light para dark', () => {
    const store = useAppStore();

    store.switchTheme();

    expect(store.theme).toBe('dark');
    expect(localStorage.getItem('app_theme')).toBe('dark');
  });

  it('inicia com tema salvo no localStorage', () => {
    localStorage.setItem('app_theme', 'dark');

    const store = useAppStore();

    expect(store.theme).toBe('dark');
  });
});
```

Por que é bom: cada teste foca num único comportamento, `beforeEach` limpa
estado (isolamento), mock mínimo (só localStorage), assertion clara do
resultado esperado.

## Exemplo — mau código (teste sem assertion)

```ts
it('alterna o tema', () => {
  const store = useAppStore();
  store.switchTheme();
  // sem expect — teste sempre passa, falso positivo
});
```

Por que é ruim: teste sem `expect` nunca falha, dando falsa confiança de que
o código funciona. Sempre valide o resultado:

```ts
it('alterna o tema de claro para escuro e persiste a escolha', () => {
  const store = useAppStore();

  store.switchTheme();

  expect(store.theme).toBe('dark');
  expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark');
});
```

## Exemplo — mau código (mock global excessivo)

```ts
// RUIM: mock intercepta todo o módulo, escondendo bugs reais
vi.mock('@shared/stores', () => ({
  useAppStore: () => ({
    theme: 'light',
    switchTheme: vi.fn(),
  }),
}));
```

Por que é ruim: mocka o módulo inteiro com valores fixos — se a store mudar
a assinatura, o teste continua passando sem detectar o breaking change.
Prefira criar uma instância real do Pinia com `createPinia()` e mockar apenas
o service externo (API):

```ts
// BOM: Pinia real, só o fetch é mockado
beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(getCustomersRequest).mockResolvedValue(mockCustomers);
});
```

## Testes E2E (Playwright)

Os testes E2E ficam em `e2e/` e validam fluxos completos do usuário contra a
aplicação rodando. Não mockam stores — testam o sistema integrado. Apenas as
**fronteiras externas** (endpoints HTTP) são interceptadas com `page.route`,
para manter o teste determinístico sem depender do backend.

### Como executar

Na primeira vez (e a cada atualização do `@playwright/test`), baixe o Chromium:

```bash
pnpm test:e2e:install
```

O Playwright **sobe o servidor sozinho** (`webServer` em `playwright.config.ts`):
o Vite roda na porta **9091**, no modo `test`, com os valores padrão das
variáveis de ambiente. Não é preciso rodar `pnpm dev` antes, e o
`.env.development.local` da máquina não interfere.

```bash
pnpm test:e2e            # headless
pnpm test:e2e:open       # interativo (Playwright UI)
```

Fora do CI, se já houver um servidor na 9091 ele é reaproveitado. Em falhas,
o Playwright guarda screenshot e trace em `test-results/`; no CI, o relatório
HTML (`playwright-report/`) fica nos artefatos do job `e2e`.

### Acessibilidade

Cada página coberta pelo E2E também passa pelo axe (`@axe-core/playwright`),
com as regras WCAG 2.1 níveis A e AA (ADR-0029). Use o helper
`expectNoA11yViolations`, que falha listando a regra e os seletores de cada
violação:

```ts
import { expectNoA11yViolations } from './support/a11y';

test('não tem violações WCAG A/AA', async ({ page }) => {
  await page.goto('/customers');
  await expect(page.getByTestId('customers-page')).toBeVisible();
  await expectNoA11yViolations(page);
});
```

Ao criar uma página, inclua essa checagem no spec dela.

### Estrutura e nomenclatura

- Arquivo por página/fluxo: `<contexto>.spec.ts` em `e2e/`.
- `test.describe`: nome da página ou fluxo (ex.: `Página Home`); aninhe outro
  `test.describe` para agrupar cenários (ex.: `com a API indisponível`).
- `test`: frase em português com o comportamento esperado. Sempre com `expect`.
- `baseURL` já configurada (`playwright.config.ts`): use caminhos relativos
  (`page.goto('/arquitetura')`), nunca URLs absolutas.
- Prefira as asserções com espera automática (`await expect(locator)...`).

### Seletores — `data-cy`

Use atributos `data-cy` para seletores estáveis (não dependa de classes CSS
ou de texto que pode mudar). O `playwright.config.ts` define
`testIdAttribute: 'data-cy'`, então `page.getByTestId('home-page')` localiza
`[data-cy=home-page]`. Reserve `getByText` para validar conteúdo textual
visível ao usuário.

```vue
<section data-cy="home-page">
  <h1 data-cy="home-title">Template de Arquitetura Frontend</h1>
  <v-btn data-cy="submit-btn" @click="submit">Enviar</v-btn>
</section>
```

```ts
await expect(page.getByTestId('home-page')).toBeVisible();
await page.getByTestId('submit-btn').click();
await expect(page.getByText('Comandos úteis')).toBeVisible(); // conteúdo textual
```

### Navegando para uma página

Todas as rotas são públicas (o template não tem login — ADR-0021), então o
teste acessa a página direto:

```ts
// e2e/home_page.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Página Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega a página inicial', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Vue 3 Template');
  });
});
```

### Interceptando a API — `page.route`

Quando a página consome a API, intercepte o endpoint **antes** do `goto` para
manter o teste determinístico:

```ts
await page.route('**/customers', (route) =>
  route.fulfill({ json: [{ id: 1, name: 'Maria Souza' }] })
);
await page.goto('/customers');
```
