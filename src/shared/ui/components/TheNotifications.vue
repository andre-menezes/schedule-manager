<template>
  <!-- A key remonta o snackbar a cada notificação, reiniciando o timeout. -->
  <v-snackbar
    :key="notification?.id"
    :model-value="Boolean(notification)"
    :timeout="notification?.timeout ?? -1"
    location="bottom end"
    color="surface"
    class="app-notification"
    data-cy="notification"
    @update:model-value="close"
  >
    <div class="d-flex align-center ga-2">
      <v-icon
        :icon="ICONS[notification?.type ?? 'info']"
        :color="notification?.type"
        aria-hidden="true"
      />
      <span data-cy="notification-message">{{ notification?.message }}</span>
    </div>
    <template #actions>
      <v-btn variant="text" data-cy="notification-close" @click="close(false)">
        {{ $t('notifications.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '@shared/stores/notification.store';
import type { NotificationType } from '@typings/store';

/**
 * Snackbar global (ADR-0040): mostra a primeira notificação da fila e passa
 * para a próxima quando ela expira ou é fechada. Fica no `App.vue`, fora dos
 * layouts, para aparecer em qualquer tela. O Vuetify já anuncia o conteúdo
 * ao leitor de tela (`role="status"`, `aria-live="polite"`). O tom aparece só
 * no ícone: o fundo `surface` mantém o texto com contraste AA em todos os
 * tons, sem depender do par `<tom>`/`on-<tom>` de cada um (ADR-0029).
 */
const store = useNotificationStore();
const notification = computed(() => store.current);

const ICONS: Record<NotificationType, string> = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

function close(open: boolean): void {
  if (!open && notification.value) {
    store.dismiss(notification.value.id);
  }
}
</script>

<style scoped>
.app-notification :deep(.v-snackbar__wrapper) {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
