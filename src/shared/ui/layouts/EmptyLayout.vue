<template>
  <v-main
    :id="MAIN_CONTENT_ID"
    tabindex="-1"
    class="main-content d-flex align-center justify-center min-h-screen"
  >
    <slot></slot>
  </v-main>
</template>

<script setup lang="ts">
import { MAIN_CONTENT_ID } from '@core/config';
</script>

<style scoped>
/* O <main> recebe foco só por script (tabindex -1); sem contorno no bloco todo. */
.main-content:focus {
  outline: none;
}
</style>
