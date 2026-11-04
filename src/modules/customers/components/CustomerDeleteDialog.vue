<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    :persistent="deleting"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card data-cy="customer-delete-dialog">
      <v-card-title class="text-h6">{{ $t('customers.delete.title') }}</v-card-title>
      <v-card-text>
        <p class="mb-0">{{ $t('customers.delete.message', { name: customerName }) }}</p>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
          :text="errorMessage"
          data-cy="customer-delete-error"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          :disabled="deleting"
          data-cy="customer-delete-cancel-btn"
          @click="emit('update:modelValue', false)"
        >
          {{ $t('customers.delete.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          :loading="deleting"
          data-cy="customer-delete-confirm-btn"
          @click="emit('confirm')"
        >
          {{ $t('customers.delete.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  customerName: string;
  deleting: boolean;
  errorMessage?: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [open: boolean];
  confirm: [];
}>();
</script>
