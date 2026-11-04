<template>
  <header
    class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6"
    data-cy="page-header"
  >
    <div class="d-flex align-center ga-4 min-w-0">
      <slot name="prepend" />
      <div class="min-w-0">
        <p v-if="overline" class="text-overline text-medium-emphasis mb-1">{{ overline }}</p>
        <h1 class="text-h4 mb-0" data-cy="page-header-title">{{ title }}</h1>
        <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1 mb-0">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="$slots.actions" class="d-flex flex-wrap ga-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Cabeçalho de página do design system (ADR-0045): o `<h1>` da tela, com
 * sobretítulo e subtítulo opcionais e as ações à direita (quebram para baixo
 * em tela estreita). Slot `prepend` para um avatar ou ícone.
 */
defineProps<{
  title: string;
  subtitle?: string;
  overline?: string;
}>();

defineSlots<{ prepend?: () => unknown; actions?: () => unknown }>();
</script>
