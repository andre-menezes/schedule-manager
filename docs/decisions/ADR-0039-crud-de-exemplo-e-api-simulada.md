# ADR-0039: CRUD de exemplo (`customers`) e API simulada no `pnpm dev`

- **Status:** Aceita
- **Data:** 2026-11-03
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0025 (colocalização por módulo), ADR-0026 (vitrine em
  módulo removível), ADR-0027 (TanStack Query), ADR-0029 (acessibilidade no
  E2E), ADR-0038 (múltiplos locales)

## Contexto e problema

O template demonstrava as camadas com trechos de código, mas não tinha um
fluxo de dados real de ponta a ponta: nenhuma tela lia, gravava ou paginava
dados de uma API (roadmap, item 2.1). Os exemplos de `customers` da
documentação não existiam como código executável, então podiam divergir do
que compila e passa nos testes.

Um CRUD de verdade precisa de um backend, e o template não tem um. Sem ele, a
tela de exemplo só mostraria um erro no `pnpm dev`. Como entregar um exemplo
canônico que roda sozinho, sem dependência nova e sem que o código do `src/`
saiba que a API é falsa?

## Drivers da decisão

- O exemplo roda com `pnpm install && pnpm dev`, sem subir outro serviço.
- O `src/` usa o `httpClient` e os services como faria com o backend real;
  trocar pela API real é só apontar o `VITE_API_BASE_URL`.
- Nenhuma dependência nova (CONTRACT, princípio 5).
- Unitários e E2E continuam determinísticos.
- Um projeto novo apaga o exemplo com o `template:clean`, como a vitrine.

## Opções consideradas

- **Plugin do Vite com middleware no servidor de desenvolvimento** —
  escolhida. Responde sob a base da API no próprio `vite`, com dados em
  memória; sem dependência.
- **MSW (Mock Service Worker)** — padrão de mercado, intercepta no navegador e
  serve também a testes. Traz dependência nova e um service worker no
  `public/`, e o código de bootstrap precisaria ligá-lo só em desenvolvimento.
- **json-server ou outro processo à parte** — dependência nova e um segundo
  processo para subir junto do `pnpm dev`; sem regras de negócio (e-mail
  único, erros RFC 9457).
- **Service falso no `src/`** — dispensa HTTP, mas o exemplo deixaria de
  mostrar o `httpClient`, o cancelamento e os erros reais.

## Decisão

1. **Módulo `src/modules/customers`** com o fluxo completo nas camadas do
   template: `types.ts` → `api/customer.service.ts` → queries e mutations em
   `composables/` → views container → componentes apresentacionais.
   - Listagem paginada com busca; página, tamanho e busca ficam na URL
     (`?page=2&pageSize=25&search=ana`), então recarregar e voltar no
     histórico preservam a tela.
   - Detalhe com exclusão confirmada num diálogo, e um formulário único para
     cadastro e edição.
   - As chaves de query ficam em `customerKeys`; cada mutation invalida as
     listas, a edição grava o detalhe no cache e a exclusão o remove.
   - Os tipos de paginação ficam no módulo até um segundo módulo precisar
     deles (roadmap 2.2 os promove para `src/types/services`).
   - A validação do formulário usa as `rules` do Vuetify; a biblioteca de
     formulários fica para a ADR do roadmap 3.3.
2. **API simulada em `mock/`** (fora do `src/`):
   - `mock/api-mock.ts`: plugin `apiMock` (`apply: 'serve'`) com um
     middleware que casa método e caminho (`/customers/:id`) e responde JSON,
     ou `application/problem+json` (RFC 9457) para erros.
   - `mock/customers.ts`: endpoints de clientes com 32 registros em memória,
     paginação, busca, e-mail único (409) e campos obrigatórios (400).
   - `mock/handlers.ts`: lista de handlers registrados.
   - O `vite.config.ts` só liga o mock no modo `development` e com a base da
     API relativa (o padrão `/api`); `API_MOCK=false` o desliga para usar um
     backend real atrás de um proxy relativo.
3. **Testes**: os unitários mockam o service; o E2E intercepta a API com
   `page.route`, como antes (ADR-0029), mas responde com os mesmos handlers
   de `mock/customers.ts`, criados de novo a cada teste. Os testes de
   `mock/` rodam no Vitest, fora da medição de cobertura (que mede só o
   `src/`).
4. **`template:clean`** apaga o módulo, os testes e `mock/customers.ts`, e
   deixa `mock/handlers.ts` sem rotas: a API simulada fica disponível para os
   módulos do projeto novo.

## Consequências

### Positivas

- O Onboarding aponta para um módulo real, que compila, passa no lint, na
  cobertura e no axe.
- O exemplo roda sem backend e sem dependência nova.
- O mesmo contrato simulado serve ao `pnpm dev` e ao E2E.

### Negativas / trade-offs

- O mock é código de Node mantido à mão: regras de negócio do backend real
  (validações, mensagens) precisam ser espelhadas para o exemplo ser fiel.
- Os dados ficam em memória: reiniciar o `pnpm dev` volta à lista inicial.
- O mock não roda no `vite preview` nem no build; uma tela publicada sem
  backend mostra o erro da API.

### Neutras

- O `lint`, o `tsconfig.node.json` e o `include` do Vitest passam a cobrir
  `mock/`.
- O helper de acessibilidade do E2E espera as transições CSS terminarem antes
  do axe: o cabeçalho da tabela anima a cor ao montar.

## Referências

- `src/modules/customers/`, `mock/`, `e2e/customers.spec.ts`,
  `docs/specs/FEAT-001-crud-de-clientes.md`.
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
