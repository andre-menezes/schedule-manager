<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    class="navigation-menu"
    :temporary="!mdAndUp"
    color="surface"
    border="e"
    width="248"
  >
    <!-- O drawer já é um <nav>; os itens são links, não itens de lista. -->
    <v-list class="pa-2" nav density="compact" role="none">
      <template v-for="group in menuGroups" :key="group.titleKey ?? 'root'">
        <v-list-subheader
          v-if="group.titleKey && !rail"
          class="navigation-menu__group text-overline"
          data-cy="nav-group"
        >
          {{ $t(group.titleKey) }}
        </v-list-subheader>
        <v-divider v-else-if="group.titleKey" class="my-2 mx-2" />
        <v-list-item
          v-for="item in group.items"
          :key="item.route"
          :to="item.route"
          color="primary"
          rounded="md"
          class="mb-1"
          :title="rail ? $t(item.titleKey) : undefined"
        >
          <template #prepend><v-icon :icon="item.icon" size="20" /></template>
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ $t(item.titleKey) }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <template #append>
      <div
        class="navigation-status d-flex align-center ga-2 px-4 py-3 text-caption text-medium-emphasis"
      >
        <v-icon icon="sell" size="16" />
        <span>
          <span class="font-weight-medium">{{ $t('common.currentVersion') }}:</span>
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
import type { MenuGroup, MenuItem } from '@typings/components';

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

/**
 * Agrupa os itens pelo `meta.nav.groupKey`: os sem grupo vêm primeiro, sem
 * título; os grupos seguem a ordem do primeiro item de cada um.
 */
const menuGroups = computed<MenuGroup[]>(() => {
  const groups = new Map<string | undefined, MenuItem[]>();
  for (const item of menuItems.value) {
    groups.set(item.groupKey, [...(groups.get(item.groupKey) ?? []), item]);
  }
  const ungrouped = groups.get(undefined);
  groups.delete(undefined);
  return [
    ...(ungrouped ? [{ items: ungrouped }] : []),
    ...[...groups].map(([titleKey, items]) => ({ titleKey, items })),
  ];
});
</script>

<style scoped>
.navigation-status {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
