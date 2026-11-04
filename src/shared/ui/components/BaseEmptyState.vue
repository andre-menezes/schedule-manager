<template>
  <div
    class="d-flex flex-column align-center justify-center ga-2 py-10 px-4 text-center"
    data-cy="empty-state"
  >
    <v-icon :icon="icon ?? 'inbox'" size="48" color="secondary-text" aria-hidden="true" />
    <p class="text-subtitle-1 font-weight-bold mb-0" data-cy="empty-state-title">
      {{ title ?? $t('states.emptyTitle') }}
    </p>
    <p v-if="description" class="text-body-2 text-medium-emphasis mb-0" style="max-width: 480px">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="d-flex flex-wrap justify-center ga-2 mt-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
/** Estado vazio: nenhum item a exibir, com ações opcionais (ex.: cadastrar). */
defineProps<{
  /** Título; padrão "Nada por aqui". */
  title?: string;
  description?: string;
  /** Ícone do Material Symbols; padrão `inbox`. */
  icon?: string;
}>();

defineSlots<{ actions?: () => unknown }>();
</script>
