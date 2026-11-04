<template>
  <v-app-bar theme="dark" class="app-header px-2 px-sm-4" elevation="2" height="64">
    <v-app-bar-nav-icon class="d-md-none" @click="emit('toggleNavigation')" />
    <div class="d-none d-sm-flex align-center ga-3">
      <BaseLogo class="logo" />
      <v-app-bar-title class="text-title-medium font-weight-bold pa-0">
        {{ APP_NAME }}
      </v-app-bar-title>
    </div>

    <v-spacer />

    <v-row class="flex-grow-0 ga-4" no-gutters align="center">
      <TheLocaleMenu :locale="locale" @change-locale="setLocale" />
      <TheHeaderActions :theme="theme" @switch-theme="toggleTheme" />
    </v-row>
  </v-app-bar>
</template>

<script setup lang="ts">
import { APP_NAME } from '@core/config';
import { useLocale, useTheme } from '@shared/composables';
import BaseLogo from './BaseLogo.vue';
import TheHeaderActions from './TheHeaderActions.vue';
import TheLocaleMenu from './TheLocaleMenu.vue';

const { theme, toggleTheme } = useTheme();
const { locale, setLocale } = useLocale();

const emit = defineEmits<{
  toggleNavigation: [];
}>();
</script>
