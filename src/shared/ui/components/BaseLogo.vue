<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    class="base-logo"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="32" height="32" rx="8" class="base-logo__tile" />
    <!-- Três camadas empilhadas: a arquitetura em camadas do template. -->
    <path d="M16 7 25 11.5 16 16 7 11.5Z" class="base-logo__layer" />
    <path
      d="m9.2 15.4 6.8 3.4 6.8-3.4 2.2 1.1-9 4.5-9-4.5Z"
      class="base-logo__layer"
      opacity=".8"
    />
    <path
      d="m9.2 19.9 6.8 3.4 6.8-3.4 2.2 1.1-9 4.5-9-4.5Z"
      class="base-logo__layer"
      opacity=".6"
    />
  </svg>
</template>

<script setup lang="ts">
/**
 * Marca do template: um bloco na cor primária do tema com três camadas
 * empilhadas. Decorativa: o nome do app vem escrito ao lado.
 */
</script>

<style scoped>
.base-logo__tile {
  fill: rgb(var(--v-theme-primary));
}

.base-logo__layer {
  fill: rgb(var(--v-theme-on-primary));
}
</style>
