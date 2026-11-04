<template>
  <section :id="anchor" class="doc-section mb-10" data-cy="doc-section">
    <v-row no-gutters align="center" class="mb-2">
      <v-col v-if="icon" cols="auto" class="mr-3">
        <v-avatar color="primary" variant="tonal" size="40">
          <v-icon :icon="icon" />
        </v-avatar>
      </v-col>
      <v-col>
        <h2 class="text-h5 font-weight-bold mb-0" data-cy="doc-section-title">{{ title }}</h2>
        <p v-if="description" class="text-body-2 text-medium-emphasis mb-0 mt-1">
          {{ description }}
        </p>
      </v-col>
    </v-row>

    <v-divider class="mb-5 mt-3" />

    <slot />
  </section>
</template>

<script setup lang="ts">
import type { DocSectionProps } from '../types';

defineProps<DocSectionProps>();
</script>
