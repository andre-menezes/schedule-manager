<template>
  <v-card variant="outlined" data-cy="customer-details">
    <v-list lines="two" class="bg-transparent">
      <v-list-item :title="$t('customers.fields.email')" prepend-icon="mail">
        <v-list-item-subtitle data-cy="customer-email">{{ customer.email }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item :title="$t('customers.fields.phone')" prepend-icon="call">
        <v-list-item-subtitle data-cy="customer-phone">
          {{ customer.phone ?? $t('customers.detail.noPhone') }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item :title="$t('customers.fields.status')" prepend-icon="toggle_on">
        <CustomerStatusChip :active="customer.active" class="mt-1" />
      </v-list-item>
      <v-list-item :title="$t('customers.fields.createdAt')" prepend-icon="event">
        <v-list-item-subtitle>{{ formatDate(customer.createdAt, locale) }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useLocale } from '@shared/composables/useLocale';
import { formatDate } from '@shared/utils/format';
import type { Customer } from '../types';
import CustomerStatusChip from './CustomerStatusChip.vue';

defineProps<{ customer: Customer }>();

const { locale } = useLocale();
</script>
