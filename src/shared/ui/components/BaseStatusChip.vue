<template>
  <v-chip
    size="small"
    variant="flat"
    :color="`${tone}-container`"
    :prepend-icon="icon"
    data-cy="status-chip"
  >
    {{ label }}
  </v-chip>
</template>

<script setup lang="ts">
import type { StatusTone } from '@typings/theme';

/**
 * Chip de status do design system (ADR-0045): fundo `<tom>-container` com o
 * texto `on-<tom>-container`, com contraste AA nos dois temas. O módulo
 * decide o tom (ex.: ativo → `success`); o chip só desenha.
 */
defineProps<{
  label: string;
  tone: StatusTone;
  /** Ícone do Material Symbols antes do texto (opcional). */
  icon?: string;
}>();
</script>
