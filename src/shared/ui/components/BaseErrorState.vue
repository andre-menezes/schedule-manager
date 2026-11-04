<template>
  <v-alert
    type="error"
    variant="tonal"
    :title="title ?? $t('states.errorTitle')"
    :text="message"
    data-cy="error-state"
  >
    <template v-if="retryable" #append>
      <v-btn
        variant="text"
        prepend-icon="refresh"
        :loading="retrying"
        data-cy="error-state-retry"
        @click="emit('retry')"
      >
        {{ $t('states.retry') }}
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
/**
 * Estado de erro de uma área da tela. A mensagem chega pronta (ex.: de
 * `useErrorMessage`); com `retryable`, oferece "Tentar novamente".
 */
defineProps<{
  message: string;
  /** Título; padrão "Não foi possível carregar". */
  title?: string;
  retryable?: boolean;
  /** Mostra o botão de tentar de novo carregando (ex.: `isFetching`). */
  retrying?: boolean;
}>();

const emit = defineEmits<{ retry: [] }>();
</script>
