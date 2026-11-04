<template>
  <div
    role="status"
    aria-live="polite"
    class="d-flex flex-column align-center justify-center ga-3 py-10 text-center"
    data-cy="loading-state"
  >
    <v-progress-circular indeterminate color="primary" :size="40" aria-hidden="true" />
    <p class="text-body-2 text-medium-emphasis mb-0">{{ label ?? $t('states.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
/** Estado de carregamento de uma área da tela, anunciado ao leitor de tela. */
defineProps<{
  /** Texto exibido; padrão "Carregando…". */
  label?: string;
}>();
</script>
