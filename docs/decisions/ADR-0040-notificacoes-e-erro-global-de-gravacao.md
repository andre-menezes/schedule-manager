# ADR-0040: Notificações globais e erro de gravação notificado

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0009 (estado e `shared/`), ADR-0027 (TanStack Query),
  ADR-0028 (tratamento global de erros), ADR-0029 (contraste AA), ADR-0037
  (textos no i18n)

## Contexto e problema

O template não tinha como avisar o usuário de algo que aconteceu fora da área
que ele olha: o CRUD de clientes salvava e navegava sem confirmar, e cada tela
teria de inventar o próprio aviso. O `errorHandler` global (ADR-0028) só
registra erros não tratados no console, e o roadmap (3.1 e 3.2) pedia ligar os
erros HTTP a um aviso para o usuário. Como padronizar avisos e decidir quais
erros viram aviso, sem duplicar o que a tela já mostra?

## Drivers da decisão

- Um único jeito de avisar, em qualquer tela, sem dependência nova.
- Erros de gravação não podem passar em silêncio, nem aparecer duas vezes.
- Erros de leitura continuam com a tela, que já tem o `BaseErrorState`.
- Texto com contraste AA e anunciado ao leitor de tela.

## Opções consideradas

- **Store Pinia + `useNotify` + `v-snackbar` global; erro de mutation pelo
  `MutationCache` do TanStack Query** — escolhida.
- **Biblioteca de toasts (ex.: vue-toastification)** — dependência nova para
  o que o `v-snackbar` do Vuetify já faz.
- **Notificar no interceptor do `httpClient`** — pegaria também as leituras,
  já tratadas na tela, e cancelamentos; sem saber se a tela mostra o erro.
- **Notificar no `errorHandler` do Vue** — só vê erros não tratados; uma
  mutation com erro não chega lá.

## Decisão

1. **Store** `shared/stores/notification.store.ts`: fila em ordem de
   chegada; `notify({ type, message, timeout? })` e `dismiss(id)`. Tempo
   padrão de 5 s, e 8 s para erros.
2. **Composable** `useNotify()` em `@shared/composables`, com `success`,
   `info`, `warning` e `error`. O texto chega traduzido de quem notifica.
3. **Snackbar** `TheNotifications` em `shared/ui/components`, montado no
   `App.vue`, fora dos layouts. Mostra a primeira da fila e passa à próxima
   ao expirar ou fechar. Fundo `surface` com o tom só no ícone: o verde de
   `success` com texto branco não tem contraste AA. O Vuetify anuncia o
   conteúdo (`role="status"`).
4. **Erro de gravação:** o `QueryClient` (`@app/providers/query`) tem um
   `MutationCache` cujo `onError` chama `notifyHttpError`
   (`@shared/helpers/http-error-notification`), com a mensagem do Problem
   Details (RFC 9457) e os fallbacks de `errors.*`. Cancelamentos são
   ignorados.
5. **Opt-out:** a mutation cuja tela já mostra o erro declara
   `meta: { notifyError: false }`, tipado pelo `Register` do TanStack Query
   em `@typings/query`. O CRUD de clientes usa isso (o formulário e o diálogo
   mostram o erro) e notifica o sucesso de cadastro, edição e exclusão.
6. **Leituras** não notificam: o erro de uma query fica na tela, no
   `BaseErrorState` com "Tentar novamente".

## Consequências

### Positivas

- Avisos iguais em todas as telas, sem dependência nova.
- Toda gravação com erro avisa o usuário, a menos que a tela diga que já
  mostra o erro.

### Negativas / trade-offs

- Quem mostra o erro na tela precisa lembrar do `notifyError: false`, senão
  o erro aparece duas vezes.
- Uma notificação de cada vez: várias seguidas esperam na fila.

### Neutras

- O `errorHandler` global (ADR-0028) continua só registrando erros não
  tratados; mostrar esses erros ao usuário fica para quando houver um
  reporter de monitoramento.

## Referências

- `src/shared/stores/notification.store.ts`, `src/shared/composables/useNotify.ts`,
  `src/shared/ui/components/TheNotifications.vue`,
  `src/shared/helpers/http-error-notification.ts`, `src/app/providers/query.ts`,
  `src/types/query/index.ts`.
- [TanStack Query — MutationCache](https://tanstack.com/query/latest/docs/reference/MutationCache)
