<template>
  <v-btn
    class="mr-1"
    variant="text"
    :aria-label="
      theme === 'dark' ? $t('header.activateLightTheme') : $t('header.activateDarkTheme')
    "
    :icon="theme === 'dark' ? 'light_mode' : 'dark_mode'"
    @click="emit('switchTheme')"
  />
</template>

<script setup lang="ts">
import type { ThemeName } from '@typings/theme';

defineProps<{
  theme: ThemeName;
}>();

const emit = defineEmits<{
  switchTheme: [];
}>();
</script>
