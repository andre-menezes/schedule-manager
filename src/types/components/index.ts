import type { RouteNav } from '@typings/router';

/** Item do menu lateral, montado a partir do `meta.nav` das rotas. */
export interface MenuItem extends RouteNav {
  route: string;
}

/** Itens do menu lateral de um grupo; `titleKey` ausente = sem título. */
export interface MenuGroup {
  titleKey?: string;
  items: MenuItem[];
}
