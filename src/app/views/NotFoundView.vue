<template>
  <section
    class="not-found d-flex flex-column align-center justify-center text-center px-4 py-12 py-md-16"
  >
    <div class="not-found__code text-primary-text" aria-hidden="true">{{ STATUS_CODE }}</div>
    <p class="text-overline text-medium-emphasis mt-2 mb-2">{{ $t('notFound.eyebrow') }}</p>
    <h1 class="text-h3 mb-3">{{ $t('notFound.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 440px">
      {{ $t('notFound.description') }}
    </p>
    <div class="d-flex flex-wrap justify-center ga-3">
      <v-btn color="primary" prepend-icon="home" to="/">
        {{ $t('common.backToHome') }}
      </v-btn>
      <v-btn variant="outlined" prepend-icon="arrow_back" data-cy="not-found-back" @click="goBack">
        {{ $t('notFound.goBack') }}
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

/** Código HTTP exibido em destaque; não se traduz. */
const STATUS_CODE = 404;

const router = useRouter();

function goBack(): void {
  router.back();
}
</script>

<style scoped>
/* O número é decorativo: o título e o sobretítulo já dizem que é a 404. */
.not-found__code {
  font-size: clamp(88px, 18vw, 160px);
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
</style>
