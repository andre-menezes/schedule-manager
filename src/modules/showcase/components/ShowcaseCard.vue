<template>
  <v-card variant="outlined" class="showcase-card" data-cy="showcase-card">
    <v-card-item class="pt-5 px-5 px-md-6">
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ title }}</v-card-title>
      <v-card-subtitle v-if="description" class="text-wrap">{{ description }}</v-card-subtitle>
    </v-card-item>

    <v-card-text class="px-5 px-md-6 pb-5 pb-md-6">
      <v-sheet
        rounded="lg"
        class="showcase-card__preview d-flex flex-wrap align-center ga-4 pa-5 mb-4"
        data-cy="showcase-preview"
      >
        <slot name="preview" />
      </v-sheet>

      <CodeBlock :code="code" :language="language" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ShowcaseCardProps } from '../types';
import CodeBlock from './CodeBlock.vue';

defineProps<ShowcaseCardProps>();
</script>

<style scoped>
.showcase-card__preview {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
  min-height: 88px;
}
</style>
