<template>
  <v-container class="py-10" data-cy="home-page">
    <h1 class="text-h4 font-weight-bold mb-3" data-cy="home-title">
      {{ $t('welcome.title', { appName: APP_NAME }) }}
    </h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ $t('welcome.description') }}</p>
    <v-btn
      v-if="hasDocs"
      :to="{ name: 'DocsHome' }"
      color="primary"
      variant="tonal"
      prepend-icon="menu_book"
      data-cy="home-docs-link"
    >
      {{ $t('welcome.docsLink') }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { APP_NAME } from '@core/config';

// A documentação vive no módulo `showcase`, que `pnpm template:clean` remove.
// O link é resolvido pelo nome da rota para não importar outro módulo.
const hasDocs = useRouter().hasRoute('DocsHome');
</script>
