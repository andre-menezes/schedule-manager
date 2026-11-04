# ADR-0027: TanStack Query para dados assíncronos

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0009 (Padrões de estado e organização do `shared/`), ADR-0025 (Colocalização por módulo)

## Contexto e problema

As views buscavam dados com `ref` + `onMounted` + `loading` controlado à mão. O
padrão se repetia em cada tela, os exemplos da documentação esqueciam o
`try/finally` (um erro deixava o loading preso), não havia cache nem
deduplicação, e cancelar a requisição ao sair da tela exigia código manual
mesmo com o `httpClient` aceitando `signal`. Antes do primeiro CRUD real, era
preciso decidir onde fica o estado vindo do servidor.

## Drivers da decisão

- Um padrão único de loading, erro e cancelamento para todas as telas.
- Cache e invalidação depois de gravações, sem copiar dados do servidor para
  stores.
- Tipagem completa e testes simples.

## Opções consideradas

- **TanStack Query (`@tanstack/vue-query`)** — escolhida.
- **Composable próprio (`useAsyncData`)** — sem dependência, mas sem cache,
  deduplicação nem invalidação; reescreveria o que a biblioteca já resolve.
- **Stores Pinia com actions de fetch** — mistura estado de servidor com
  estado de cliente e exige controlar loading, erro e expiração à mão.

## Decisão

- Dados do servidor são lidos com `useQuery` e gravados com `useMutation`.
  Depois de uma gravação, invalide as queries afetadas pela chave.
- Cada query fica num composable do módulo (`modules/<x>/composables/`), que
  chama o service do módulo repassando o `signal` da query.
- O `QueryClient` é criado em `@app/providers/query` e registrado em
  `@app/providers/plugins`. Padrões: `staleTime` de 30 s, uma retentativa e
  sem refetch ao focar a janela.
- Pinia continua responsável pelo estado de cliente (tema, preferências), não
  por cópias de dados do servidor.
- Nos testes, `mountWithPlugins` registra um `QueryClient` novo por montagem,
  sem retentativas.

## Consequências

### Positivas

- Loading, erro, cache, deduplicação e cancelamento saem prontos em cada tela.
- As views ficam menores e os exemplos da documentação deixam de ter o bug do
  loading preso.

### Negativas / trade-offs

- Dependência nova, carregada no bundle inicial.
- A equipe precisa conhecer chaves de query e invalidação.

### Neutras

- Os services continuam iguais; só passam a aceitar `signal` opcional.

## Referências

- `src/app/providers/query.ts`, `src/test/api/query.spec.ts`.
- [TanStack Query para Vue](https://tanstack.com/query/latest/docs/framework/vue/overview)
