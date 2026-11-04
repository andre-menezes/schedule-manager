<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" class="navigation-menu" :temporary="!mdAndUp">
    <!-- O drawer já é um <nav>; os itens são links, não itens de lista. -->
    <v-list class="pa-3" nav role="none">
      <v-list-item
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        color="primary"
        rounded="lg"
        class="mb-1"
      >
        <template #prepend><v-icon :icon="item.icon" /></template>
        <v-list-item-title class="font-weight-medium">
          {{ $t(item.titleKey) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <template #append>
      <div class="navigation-status ma-3 pa-3 d-flex justify-center align-center ga-2 rounded-lg">
        <v-icon icon="info" color="accent" />
        <span class="text-body-small">
          <span class="font-weight-semibold">{{ $t('common.currentVersion') }}:</span>
          {{ version }}
        </span>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import type { MenuItem } from '@typings/components';

const { version } = __APP_META__;

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Reativo ao redimensionamento (window.innerWidth não é).
const { mdAndUp } = useDisplay();
const rail = computed(() => !drawer.value && mdAndUp.value);

// Itens de navegação: toda rota com `meta.nav` entra no menu, na ordem de
// `meta.nav.order`. Um módulo novo aparece aqui sem editar este componente.
const router = useRouter();
const menuItems = computed<MenuItem[]>(() =>
  router
    .getRoutes()
    .flatMap(({ path, meta }) => (meta.nav ? [{ ...meta.nav, route: path }] : []))
    .sort((a, b) => a.order - b.order)
);
</script>
