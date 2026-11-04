<template>
  <v-container class="py-10" data-cy="home-page">
    <h1 class="text-h4 font-weight-bold mb-3" data-cy="home-title">
      {{ $t('welcome.title', { appName: APP_NAME }) }}
    </h1>
    <p class="text-body-1 text-medium-emphasis">{{ $t('welcome.description') }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { APP_NAME } from '@core/config';
</script>
