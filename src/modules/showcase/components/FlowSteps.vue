<template>
  <v-timeline side="end" align="center" density="comfortable" data-cy="flow-steps">
    <v-timeline-item v-for="step in steps" :key="step.order" :dot-color="'primary'" size="small">
      <template #icon>
        <v-icon :icon="step.icon" size="small" />
      </template>
      <div>
        <p class="text-subtitle-2 font-weight-bold mb-1">{{ step.title }}</p>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ step.description }}</p>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
import type { FlowStep } from '../types';

defineProps<{
  steps: FlowStep[];
}>();
</script>
