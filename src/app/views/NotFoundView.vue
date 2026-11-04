<template>
  <section class="d-flex align-center justify-center text-center px-4 px-sm-6 py-6 py-md-16">
    <v-card max-width="520" class="pa-6 pa-sm-8">
      <v-card-item>
        <v-img
          :src="notFoundIllustration"
          :alt="$t('notFound.title')"
          max-height="220"
          class="mx-auto"
        />
      </v-card-item>

      <v-card-text>
        <p class="text-overline text-secondary-text font-weight-bold mb-2">
          {{ $t('notFound.eyebrow') }}
        </p>
        <h1 class="text-h3 font-weight-bold mb-3">{{ $t('notFound.title') }}</h1>
        <p class="text-body-1 text-medium-emphasis mb-8">{{ $t('notFound.description') }}</p>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="primary" size="large" prepend-icon="home" to="/">
          {{ $t('common.backToHome') }}
        </v-btn>
      </v-card-actions>

      <p class="text-caption text-medium-emphasis mt-6 mb-0">
        <a
          href="https://storyset.com/web"
          target="_blank"
          rel="noopener"
          class="text-medium-emphasis"
        >
          {{ $t('notFound.illustrationCredit') }}
        </a>
      </p>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import notFoundIllustration from '@shared/assets/illustrations/404_not_found.svg';
</script>
