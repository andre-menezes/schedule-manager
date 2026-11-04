/**
 * Meta fields de rota suportados pelo template (augmentation do vue-router).
 * Com isso, `route.meta.layout` (e os demais campos) é tipado em todo o projeto e valores inválidos
 * (ex.: `layout: 'vazio'`) falham no typecheck.
 */
import 'vue-router';

export type RouteLayout = 'default' | 'empty';

/** Entrada da rota no menu lateral. Rotas sem `nav` não aparecem no menu. */
export interface RouteNav {
  /** Chave i18n do rótulo (ex.: `nav.home`). */
  titleKey: string;
  icon: string;
  /** Posição no menu, em ordem crescente. */
  order: number;
}

declare module 'vue-router' {
  interface RouteMeta {
    /** Layout da rota; ausente = `default` (header + navegação). */
    layout?: RouteLayout;
    /**
     * Chave i18n do título da página (ex.: `pageTitle.home`). Vira
     * `document.title` como "<título> · <APP_NAME>"; ausente = só `APP_NAME`.
     */
    titleKey?: string;
    nav?: RouteNav;
  }
}
