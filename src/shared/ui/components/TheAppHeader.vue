<template>
  <!-- Superfície com borda inferior, sem sombra: só o que flutua tem sombra (ADR-0046). -->
  <v-app-bar class="app-header px-2 px-sm-4" color="surface" flat border="b" height="64">
    <v-app-bar-nav-icon class="d-md-none" @click="emit('toggleNavigation')" />
    <router-link
      to="/"
      class="app-header__brand d-flex align-center ga-3 text-decoration-none"
      data-cy="app-brand"
    >
      <BaseLogo class="app-header__logo" />
      <span class="text-subtitle-1 font-weight-semibold text-high-emphasis d-none d-sm-inline">
        {{ APP_NAME }}
      </span>
    </router-link>

    <v-spacer />

    <div class="d-flex align-center ga-1">
      <TheLocaleMenu :locale="locale" @change-locale="setLocale" />
      <TheHeaderActions :theme="theme" @switch-theme="toggleTheme" />
    </div>
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

<style scoped>
.app-header__brand {
  color: inherit;
  border-radius: 4px;
}

.app-header__brand:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 4px;
}

.app-header__logo {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
}
</style>
