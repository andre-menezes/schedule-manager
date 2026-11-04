<template>
  <v-card
    class="navigation-card h-100 d-flex flex-column"
    variant="outlined"
    :to="card.route"
    data-cy="nav-card"
    :data-cy-route="card.route"
  >
    <v-card-item>
      <template #prepend>
        <v-avatar :color="card.color" variant="tonal" size="44">
          <v-icon :icon="card.icon" />
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ card.title }}</v-card-title>
    </v-card-item>

    <v-card-text class="pt-0">
      <p class="text-body-2 text-medium-emphasis mb-0">{{ card.description }}</p>
    </v-card-text>

    <v-card-actions class="px-4 pb-3 mt-auto text-primary-text">
      <span class="text-body-2 font-weight-medium">{{ $t('common.open') }}</span>
      <v-icon end size="18" icon="arrow_forward" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { NavCard } from '../types';

defineProps<{
  card: NavCard;
}>();
</script>
