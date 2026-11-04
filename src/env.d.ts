/// <reference types="vite/client" />

/**
 * Variáveis `VITE_*` lidas pela aplicação. Todas são opcionais e têm valor
 * padrão em `@core/config`. Ao criar uma nova, declare-a aqui e no `.env.example`.
 */
interface AppEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_DEFAULT_LOCALE?: string;
  readonly VITE_SENTRY_DSN?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- só agrega `AppEnv` ao tipo do Vite.
interface ImportMetaEnv extends AppEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Metadados do `package.json` injetados em build (`define` no `vite.config.ts`). */
declare const __APP_META__: {
  readonly version: string;
  readonly runtimeDependencies: number;
  readonly toolingDependencies: number;
};

/**
 * Tipo dos `.vue` importados por arquivos `.ts` para o ESLint tipado. O
 * vue-tsc resolve o SFC real e ignora esta declaração; o TypeScript usado pelo
 * typescript-eslint não entende `.vue` e, sem ela, tipa esses imports como
 * erro, gerando falsos positivos nas regras `no-unsafe-*`.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
