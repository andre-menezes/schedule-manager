<template>
  <v-data-table-server
    :headers="headers"
    :items="customers"
    :items-length="total"
    :page="page"
    :items-per-page="pageSize"
    :items-per-page-options="PAGE_SIZE_OPTIONS"
    :loading="loading"
    item-value="id"
    data-cy="customer-table"
    @update:options="onOptions"
  >
    <template #no-data>
      <BaseEmptyState :title="$t('customers.list.empty')" icon="person_search" />
    </template>
    <template #[`item.name`]="{ item }">
      <router-link
        :to="{ name: 'CustomerDetail', params: { id: item.id } }"
        class="text-primary-text font-weight-medium"
        data-cy="customer-link"
      >
        {{ item.name }}
      </router-link>
    </template>
    <template #[`item.active`]="{ item }">
      <CustomerStatusChip :active="item.active" />
    </template>
    <template #[`item.createdAt`]="{ item }">
      {{ formatDate(item.createdAt, locale) }}
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@shared/composables/useLocale';
import { formatDate } from '@shared/utils/format';
import BaseEmptyState from '@shared/ui/components/BaseEmptyState.vue';
import type { Customer } from '../types';
import CustomerStatusChip from './CustomerStatusChip.vue';

const props = defineProps<{
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  /** Nova página ou novo tamanho de página; trocar o tamanho volta à página 1. */
  changePage: [options: { page: number; pageSize: number }];
}>();

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const { t } = useI18n();
const { locale } = useLocale();

const headers = computed(() => [
  { title: t('customers.fields.name'), key: 'name', sortable: false },
  { title: t('customers.fields.email'), key: 'email', sortable: false },
  { title: t('customers.fields.status'), key: 'active', sortable: false },
  { title: t('customers.fields.createdAt'), key: 'createdAt', sortable: false },
]);

/**
 * O Vuetify emite `update:options` também ao montar a tabela; só uma mudança
 * real de página ou tamanho vira evento.
 */
function onOptions({ page, itemsPerPage }: { page: number; itemsPerPage: number }): void {
  if (itemsPerPage !== props.pageSize) {
    emit('changePage', { page: 1, pageSize: itemsPerPage });
  } else if (page !== props.page) {
    emit('changePage', { page, pageSize: itemsPerPage });
  }
}
</script>
