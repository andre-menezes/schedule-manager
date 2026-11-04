# Skill: Testes (Vitest + Playwright)

## Objetivo

Criar e manter testes automatizados que garantam a qualidade do código,
prevenindo regressões e validando regras de negócio.

## Ferramentas

| Ferramenta     | Tipo                 | Localização                |
| -------------- | -------------------- | -------------------------- |
| Vitest         | Unitários/integração | `src/test/**/*.spec.ts`    |
| Vue Test Utils | Mount de componentes | `src/test/components/`     |
| happy-dom      | DOM simulado         | Config em `vite.config.ts` |
| Playwright     | End-to-end           | `e2e/**/*.spec.ts`         |

## Quando criar cada tipo

| Cenário                           | Tipo de teste  |
| --------------------------------- | -------------- |
| Regra de negócio (lógica pura)    | Unitário       |
| Service (comunicação HTTP)        | Unitário       |
| Store (state + actions)           | Unitário       |
| Componente com lógica (computeds) | Integração     |
| Fluxo completo do usuário         | E2E            |
| Regressão de bug corrigido        | Unitário + E2E |

## Padrões — Teste unitário

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
});
```

### Regras

- `beforeEach` limpa estado (isolamento entre testes).
- Pinia real com `createPinia()` (nunca mock completo da store).
- Mock apenas do que é externo (HTTP, APIs de browser).
- Cada `it` testa **um** comportamento.
- Nome do `it` em português, descrevendo o resultado esperado.
- Assertion obrigatória (nunca `it` vazio).

## Padrões — Mock de service

```ts
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn(), post: vi.fn() },
}));

// No teste:
vi.mocked(httpClient.get).mockResolvedValue(mockData);
```

- Mock apenas a instância HTTP (não o módulo inteiro de stores).
- Dados mockados representativos do contrato real.

## Padrões — Teste E2E (Playwright)

O `webServer` do `playwright.config.ts` sobe o Vite (porta 9091, modo `test`);
não é preciso rodar `pnpm dev` antes. Na primeira
execução, instale o navegador com `pnpm test:e2e:install`.

### Navegando para uma página

Todas as rotas são públicas (o template não tem login — ADR-0021).

```ts
import { expect, test } from '@playwright/test';

test.describe('Página Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega a página inicial', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Bem-vindo');
  });
});
```

### Interceptando a API

Intercepte os endpoints consumidos pela página com `page.route` antes do
`goto`, para não depender do backend:

```ts
await page.route('**/customers', (route) =>
  route.fulfill({ json: [{ id: 1, name: 'Maria Souza' }] })
);
await page.goto('/customers');
```

### Acessibilidade

Toda página com E2E também passa pelo axe (WCAG 2.1 A/AA, ADR-0029):

```ts
import { expectNoA11yViolations } from './support/a11y';

test('não tem violações WCAG A/AA', async ({ page }) => {
  await page.goto('/customers');
  await expectNoA11yViolations(page);
});
```

### Regras

- Seletores via `data-cy` com `page.getByTestId(...)` (o `testIdAttribute` é
  `data-cy`); nunca classes CSS ou texto que pode mudar. Reserve `getByText`
  para validar conteúdo textual visível.
- `test.describe` = página/fluxo; `test.describe` aninhado = cenário;
  `test` = comportamento (pt-BR).
- Use caminhos relativos (`page.goto('/arquitetura')`) — a `baseURL` já está definida.
- Use asserções com espera automática (`await expect(locator).toBeVisible()`),
  nunca `waitForTimeout`.
- Não mocke stores — o E2E testa o sistema integrado. Intercepte apenas as
  fronteiras externas (endpoints HTTP) com `page.route`.

## Atributos data-cy

Adicione nos componentes para seletores estáveis:

```vue
<v-btn data-cy="submit-btn" @click="submit">Enviar</v-btn>
<v-list data-cy="customer-list">
  <v-list-item
    v-for="customer in customers"
    :key="customer.id"
    :data-cy="`customer-${customer.id}`"
  />
</v-list>
```

## Thresholds de cobertura

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

## Comandos

```bash
pnpm test                 # unitários (single run)
pnpm test:watch           # unitários (watch mode)
pnpm test:coverage        # cobertura com relatório
pnpm test:e2e             # E2E headless
pnpm test:e2e:open        # E2E interativo
pnpm test:all             # unitários + E2E
```

## Não fazer

- Não criar teste sem assertion (falso positivo).
- Não mockar módulo inteiro de stores (esconde breaking changes).
- Não usar seletores frágeis (classes CSS, texto dinâmico).
- Não testar implementação interna (teste comportamento observável).
- Não deixar teste falhando no PR.
- Não tratar warning como aceitável sem investigar.
