# ADR-0043: Monitoramento de erros com o Sentry, opcional

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0028 (tratamento global de erros), ADR-0041 (deploy e
  CSP)

## Contexto e problema

Os erros não tratados chegam a um `ErrorReporter` trocável (ADR-0028), que só
escreve no console do navegador: em produção, ninguém fica sabendo. Um
projeto real precisa ver os erros dos usuários, com versão e ambiente. Como
ligar um serviço de monitoramento sem obrigar quem não o usa e sem pesar no
bundle?

## Drivers da decisão

- Desligado por padrão: o template roda sem conta em serviço nenhum.
- Sem custo no bundle inicial quando desligado.
- Um erro enviado uma vez só, pelo mesmo caminho da ADR-0028.
- Sem dados pessoais nos eventos.

## Opções consideradas

- **Sentry (`@sentry/vue`)** — escolhida: SDK oficial para Vue, plano
  gratuito e hospedagem própria possível.
- **Outro serviço (Datadog RUM, Bugsnag, LogRocket)** — viáveis pelo mesmo
  `ErrorReporter`, mas sem preferência do time.
- **Nenhum** — mantém os erros só no console.

## Decisão

- Dependência `@sentry/vue` 11.8.0, carregada por import dinâmico: vira um
  chunk à parte, baixado só com o DSN definido.
- `VITE_SENTRY_DSN` (opcional, em `@core/config`): vazio desliga.
- `createErrorReporter` (`@app/providers/monitoring`), chamado no `main.ts`
  antes do `registerErrorHandlers`: sem DSN, devolve o `consoleReporter`; com
  DSN, inicia o Sentry e devolve um reporter que escreve no console e chama
  `captureException`, com a origem (`vue` ou `unhandledrejection`) como tag.
  Se o SDK não carregar, fica só o console.
- O SDK não registra handlers próprios (`attachErrorHandler: false` e sem a
  integração `GlobalHandlers`): quem captura continua sendo o
  `registerErrorHandlers`, para cada erro ir uma vez.
- `environment` vem do modo do Vite e `release`, da versão do
  `package.json`. `dataCollection.userInfo: false` tira os dados do usuário.
- Em produção, o host de ingestão do Sentry entra na CSP pela
  `CSP_CONNECT_SRC` (ADR-0041).

## Consequências

### Positivas

- Um projeto liga o monitoramento com uma variável, sem tocar no código.
- Quem não usa não baixa o SDK.

### Negativas / trade-offs

- O `main.ts` espera o SDK carregar antes de montar o app quando o DSN está
  definido (um chunk a mais na primeira carga).
- Sem tracing nem replay: só erros. Ligar performance ou session replay é
  uma decisão à parte (custo e privacidade).
- Os erros de gravação já mostrados ao usuário (ADR-0040) não chegam ao
  Sentry, porque são tratados.

### Neutras

- Trocar de serviço é trocar o `createErrorReporter`; o resto da aplicação
  só conhece o `ErrorReporter`.

## Referências

- `src/app/providers/monitoring.ts`, `src/app/main.ts`, `src/core/config/index.ts`.
- [Sentry para Vue](https://docs.sentry.io/platforms/javascript/guides/vue/)
