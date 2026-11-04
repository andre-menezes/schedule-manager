<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    class="base-event-block text-left"
    :class="[`bg-event-${hue}-bg`, { 'base-event-block--compact': compact }]"
    :style="{ borderInlineStartColor: `rgb(var(--v-theme-event-${hue}))` }"
    data-cy="event-block"
    @click="clickable && emit('select')"
  >
    <span class="base-event-block__time">{{ time }}</span>
    <span class="base-event-block__title">{{ title }}</span>
    <span v-if="subtitle && !compact" class="base-event-block__subtitle">{{ subtitle }}</span>
  </component>
</template>

<script setup lang="ts">
import type { EventHue } from '@typings/theme';

/**
 * Bloco de compromisso do design system Agenda (ADR-0045): fundo e texto da
 * cor de evento, com a borda de destaque à esquerda. `compact` põe hora e
 * título numa linha (visão de mês ou eventos curtos). Com `clickable`, vira
 * um botão e emite `select`.
 */
defineProps<{
  title: string;
  /** Horário já formatado, ex.: "09:00" ou "09:00 – 10:00". */
  time: string;
  hue: EventHue;
  subtitle?: string;
  compact?: boolean;
  clickable?: boolean;
}>();

const emit = defineEmits<{ select: [] }>();
</script>

<style scoped>
.base-event-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  min-width: 0;
  padding: 4px 8px;
  border: 0;
  border-inline-start: 3px solid;
  border-radius: 4px;
  font: inherit;
  font-size: 12px;
  line-height: 16px;
  overflow: hidden;
}

button.base-event-block {
  cursor: pointer;
}

button.base-event-block:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.base-event-block--compact {
  flex-direction: row;
  gap: 6px;
  padding-block: 2px;
}

.base-event-block__time {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.base-event-block__title,
.base-event-block__subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-event-block__subtitle {
  opacity: 0.85;
}
</style>
