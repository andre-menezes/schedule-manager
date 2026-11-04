import type { RouteNav } from '@typings/router';

/** Item do menu lateral, montado a partir do `meta.nav` das rotas. */
export interface MenuItem extends RouteNav {
  route: string;
}
