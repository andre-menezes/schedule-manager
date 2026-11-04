import { nextTick, onScopeDispose } from 'vue';
import { START_LOCATION, useRouter } from 'vue-router';
import { MAIN_CONTENT_ID } from '@core/config';

/**
 * Move o foco para o conteúdo principal (`#main-content`) depois de cada
 * navegação, para que leitores de tela e quem navega pelo teclado comecem a
 * nova página pelo conteúdo, e não pelo link clicado no menu (ADR-0036).
 *
 * - O carregamento inicial não move o foco: a página começa do topo, com o
 *   link "Pular para o conteúdo" como primeiro elemento focável.
 * - Mudanças só de hash ou query na mesma página não movem o foco.
 * - O foco usa `preventScroll`: a rolagem continua a cargo do
 *   `scrollBehavior` do router (inclusive a rolagem até o hash).
 *
 * Deve ser chamado uma vez, na raiz da aplicação.
 */
export function useRouteFocus(targetId: string = MAIN_CONTENT_ID): void {
  const router = useRouter();

  const removeHook = router.afterEach((to, from, failure) => {
    if (failure || from === START_LOCATION || to.path === from.path) {
      return;
    }
    // Espera o DOM da nova rota (e uma eventual troca de layout) renderizar.
    void nextTick(() => {
      document.getElementById(targetId)?.focus({ preventScroll: true });
    });
  });

  onScopeDispose(removeHook);
}
