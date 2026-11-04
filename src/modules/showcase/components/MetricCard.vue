<template>
  <v-card class="h-100" variant="outlined">
    <v-card-text class="pa-5">
      <div class="d-flex align-start justify-space-between mb-5">
        <span class="text-overline font-weight-bold">{{ metric.label }}</span>
        <v-avatar :color="metric.color" variant="tonal" size="38">
          <v-icon :icon="metric.icon" />
        </v-avatar>
      </div>
      <div class="d-flex align-start ga-2">
        <strong class="text-h4 font-weight-bold">
          {{ metric.value }}
        </strong>
        <span class="text-caption text-medium-emphasis mb-1">{{ metric.detail }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Metric } from '../types';

defineProps<{
  metric: Metric;
}>();
</script>
