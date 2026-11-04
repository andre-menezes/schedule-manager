<template>
  <v-app :theme="appStore.theme">
    <component :is="currentLayout">
      <router-view :key="route.name" />
    </component>
    <TheNotifications />
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@shared/stores/app.store';
import { useRouteFocus, useRouteTitle } from '@shared/composables';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';
import TheNotifications from '@shared/ui/components/TheNotifications.vue';

const route = useRoute();
const appStore = useAppStore();

// Título da aba por rota e foco no conteúdo após navegar (ADR-0036).
useRouteTitle();
useRouteFocus();

const currentLayout = computed(() => (route.meta.layout === 'empty' ? EmptyLayout : DefaultLayout));
</script>
