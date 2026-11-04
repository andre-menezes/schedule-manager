# shared/stores

Estado global da aplicação (Pinia).

Voltar para o guia geral: [../../../docs/ARCHITECTURE-GUIDE.md](../../../docs/ARCHITECTURE-GUIDE.md)

## Stores existentes

| Store                | Responsabilidade                                                |
| -------------------- | --------------------------------------------------------------- |
| `app.store`          | Estado de UX global (tema persistido em localStorage)           |
| `notification.store` | Fila do snackbar global; as telas usam o `useNotify` (ADR-0040) |

## Quando criar uma store

Crie store apenas quando o estado for:

- **Transversal** — usado por dois ou mais módulos/componentes desconectados.
- **Persistente** — precisa sobreviver a navegação entre rotas.
- **Infraestrutural** — necessário para a mecânica da app (tema).

Se o estado é **local de tela** (modal aberto, valor de formulário, scroll
position), use `ref`/`reactive` no próprio componente.

Se o estado é **derivado de store** e precisa ser reativo em múltiplos
componentes, crie um **composable** em `shared/composables/`.

## Convenções

- Arquivo nomeado como `<contexto>.store.ts`.
- Store usa `defineStore('<contexto>', { ... })` com Options API do Pinia.
- State tipado com interface centralizada em `@typings/store`.
- Actions encapsulam toda lógica de mutação (nunca mutar state diretamente fora da store).
- Getters para lógica derivada que depende do state.

## Exemplo — bom código

```ts
// shared/stores/notification.store.ts
import { defineStore } from 'pinia';

interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    items: [],
    unreadCount: 0,
  }),

  getters: {
    hasUnread: (state): boolean => state.unreadCount > 0,
  },

  actions: {
    markAllAsRead(): void {
      this.items.forEach((item) => (item.read = true));
      this.unreadCount = 0;
    },

    addNotification(notification: Notification): void {
      this.items.unshift(notification);
      this.unreadCount++;
    },
  },
});
```

Por que é bom: responsabilidade única (SRP — só notificações), state tipado,
getters para lógica derivada, actions encapsulam mutação, nome descritivo.

## Exemplo — mau código (God Object)

```ts
// RUIM: store acumulando responsabilidades de vários domínios
export const useGlobalStore = defineStore('global', {
  state: () => ({
    user: null,
    theme: 'light',
    notifications: [],
    cartItems: [],
    loading: false,
    currentRoute: '',
    modalOpen: false,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
    addToCart(item: any) {
      this.cartItems.push(item);
    },
    openModal() {
      this.modalOpen = true;
    },
  },
});
```

Por que é ruim: viola SRP (user, tema, notificações, carrinho e modal tudo
junto), usa `any` em contratos, mistura estado local (`modalOpen`) com estado
global, e torna impossível testar uma responsabilidade sem carregar todas.

## Exemplo — mau código (acessar localStorage direto no componente)

```ts
// RUIM: componente manipula localStorage sem passar pela store
function saveTheme(theme: string) {
  localStorage.setItem('app_theme', theme);
}
```

Por que é ruim: viola encapsulamento. A store é a single source of truth para
estado global. Se o localStorage mudar de chave ou estratégia de persistência,
todos os componentes que acessam direto precisam ser atualizados. A store
centraliza essa lógica:

```ts
// BOM: store encapsula a persistência
actions: {
  switchTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
  },
}
```

## Exemplo — mau código (mutar state fora da action)

```ts
// RUIM: componente muta state diretamente
const appStore = useAppStore();
appStore.theme = 'dark'; // mutação direta sem action (e sem persistir)
```

Por que é ruim: dificulta rastreamento de mudanças (devtools não logam),
impossibilita adicionar lógica transversal (validação, log, side effects),
e quebra a previsibilidade do fluxo unidirecional.

```ts
// BOM: usar action para mutar
appStore.switchTheme();
```

## Resumo

| Cenário                           | Solução                    |
| --------------------------------- | -------------------------- |
| Estado transversal/global         | Store (Pinia)              |
| Estado local de tela/componente   | `ref` / `reactive`         |
| Lógica derivada reativa de store  | Composable (`useXxx`)      |
| Persistência (localStorage, etc.) | Encapsular dentro da store |
