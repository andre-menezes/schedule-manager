<template>
  <v-chip
    size="small"
    variant="tonal"
    :color="active ? 'success' : 'secondary-text'"
    :prepend-icon="active ? 'check_circle' : 'block'"
    data-cy="customer-status"
  >
    {{ active ? $t('customers.status.active') : $t('customers.status.inactive') }}
  </v-chip>
</template>

<script setup lang="ts">
defineProps<{ active: boolean }>();
</script>
