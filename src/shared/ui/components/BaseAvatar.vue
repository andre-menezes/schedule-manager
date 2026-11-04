<template>
  <v-avatar
    :size="size"
    :color="`event-${resolvedHue}-bg`"
    :aria-label="decorative ? undefined : name"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    data-cy="avatar"
  >
    <span class="font-weight-medium" :style="{ fontSize: `${Math.round(size * 0.4)}px` }">
      {{ initials }}
    </span>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getInitials, hueFor } from '@shared/utils/avatar';
import type { EventHue } from '@typings/theme';

/**
 * Avatar de pessoa do design system (ADR-0045): círculo com as iniciais
 * sobre uma cor de evento. Sem `hue`, a cor vem do nome e é sempre a mesma
 * para a mesma pessoa.
 */
const props = withDefaults(
  defineProps<{
    name: string;
    size?: number;
    hue?: EventHue;
    /** Ao lado do nome escrito, o avatar não repete o nome ao leitor de tela. */
    decorative?: boolean;
  }>(),
  { size: 40, hue: undefined, decorative: false }
);

const initials = computed(() => getInitials(props.name));
const resolvedHue = computed(() => props.hue ?? hueFor(props.name));
</script>
