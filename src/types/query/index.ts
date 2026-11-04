/**
 * Metadados das mutations do TanStack Query (augmentation do `Register`).
 * Com isso, `meta` em `useMutation` é tipado em todo o projeto (ADR-0040).
 */
import '@tanstack/vue-query';

export interface AppMutationMeta extends Record<string, unknown> {
  /**
   * `false` quando a própria tela mostra o erro da gravação (ex.: no
   * formulário); sem isso, o erro vira uma notificação global.
   */
  notifyError?: boolean;
}

declare module '@tanstack/vue-query' {
  interface Register {
    mutationMeta: AppMutationMeta;
  }
}
