<template>
  <v-card variant="tonal" :color="layer.color" class="h-100" data-cy="layer-card">
    <v-card-item>
      <template #prepend>
        <v-avatar :color="layer.color" variant="flat" size="40">
          <v-icon :icon="layer.icon" />
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ layer.name }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <p class="text-body-2 text-high-emphasis mb-0">{{ layer.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ArchitectureLayer } from '../types';

defineProps<{
  layer: ArchitectureLayer;
}>();
</script>
