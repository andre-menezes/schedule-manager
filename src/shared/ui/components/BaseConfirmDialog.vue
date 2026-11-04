<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    :persistent="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card data-cy="confirm-dialog">
      <v-card-title class="text-h6 pt-5 px-6">{{ title }}</v-card-title>
      <v-card-text class="px-6">
        <p class="text-body-2 mb-0">{{ message }}</p>
        <v-alert
          v-if="errorMessage"
          type="error"
          class="mt-4"
          :text="errorMessage"
          data-cy="confirm-dialog-error"
        />
      </v-card-text>
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn
          variant="text"
          :disabled="loading"
          data-cy="confirm-dialog-cancel"
          @click="emit('update:modelValue', false)"
        >
          {{ cancelLabel ?? $t('dialog.cancel') }}
        </v-btn>
        <!-- O v-card-actions deixa os botões em `text`; a ação principal é cheia. -->
        <v-btn
          :color="tone"
          variant="flat"
          :loading="loading"
          data-cy="confirm-dialog-confirm"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/**
 * Diálogo de confirmação do design system (ADR-0045): título, mensagem e as
 * ações "Cancelar" e a principal. `tone="error"` para ações destrutivas.
 * Enquanto `loading`, o diálogo não fecha ao clicar fora.
 */
withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel?: string;
    tone?: 'primary' | 'error';
    loading?: boolean;
    /** Erro da ação, já traduzido; aparece dentro do diálogo. */
    errorMessage?: string | null;
  }>(),
  { cancelLabel: undefined, tone: 'primary', loading: false, errorMessage: null }
);

const emit = defineEmits<{
  'update:modelValue': [open: boolean];
  confirm: [];
}>();
</script>
