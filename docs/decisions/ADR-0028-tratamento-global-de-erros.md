# ADR-0028: Tratamento global de erros e remoção do analytics

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0027 (TanStack Query para dados assíncronos)

> Nota (ADR-0043): o reporter do console ganhou o par do Sentry, ligado por
> `VITE_SENTRY_DSN` (`@app/providers/monitoring`). Sem o DSN, nada muda.

## Contexto e problema

O template não tinha `app.config.errorHandler` nem captura de
`unhandledrejection`. Um erro num componente ou uma promise rejeitada sem
`catch` sumia sem registro, e não havia um ponto único para ligar um serviço de
monitoramento depois.

O router disparava `page_view` do Google Analytics (`window.gtag`), mas nenhum
script do gtag era carregado. O código nunca rodava e acoplava o router a um
fornecedor.

## Drivers da decisão

- Nenhum erro deve passar sem registro.
- Ligar um serviço de monitoramento deve exigir uma troca num único lugar.
- O template não deve carregar código morto nem depender de fornecedor de
  analytics.

## Opções consideradas

- **Handlers globais com um `ErrorReporter` trocável** — escolhida.
- **Adotar um serviço de monitoramento (ex.: Sentry) já no template** — exige
  conta e dependência que o template ainda não precisa.
- Para o analytics: **remover**, que foi a escolha, ou **criar uma interface
  vazia** ou **manter o gtag configurável por variável de ambiente**.

## Decisão

- `@app/providers/errors` registra `app.config.errorHandler` e um listener de
  `unhandledrejection`. Os dois chamam um `ErrorReporter`
  (`(error, context) => void`), que por padrão registra no console.
- `main.ts` registra os handlers antes dos plugins, para cobrir erros de
  inicialização deles.
- O hook de `page_view` sai do router e os tipos de `src/types/analytics` são
  removidos. Analytics volta quando um projeto precisar, como plugin próprio.

## Consequências

### Positivas

- Erros de componente e promises rejeitadas sempre deixam registro.
- Monitoramento futuro entra trocando o reporter em `main.ts`.
- O router fica só com rotas e rolagem.

### Negativas / trade-offs

- O reporter padrão só escreve no console; em produção, sem um serviço de
  monitoramento, ninguém vê esses registros.

### Neutras

- Erros de requisição continuam chegando a quem chamou (ou ao `error` do
  `useQuery`); o handler global só recebe o que ninguém tratou.

## Referências

- `src/app/providers/errors.ts`, `src/test/app/errors.spec.ts`.
