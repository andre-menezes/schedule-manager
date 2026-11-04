<template>
  <section class="py-6" data-cy="customer-form-page">
    <h1 class="text-h4 font-weight-bold mb-6" data-cy="customer-form-title">
      {{ isEdit ? $t('customers.form.editTitle') : $t('customers.form.createTitle') }}
    </h1>

    <BaseLoadingState v-if="isEdit && isPending" />
    <BaseEmptyState
      v-else-if="error && isNotFoundError(error)"
      :title="$t('customers.detail.notFound')"
      :description="$t('customers.detail.notFoundDescription')"
      icon="person_off"
      data-cy="customer-form-load-error"
    />
    <BaseErrorState
      v-else-if="error"
      :message="errorMessage(error)"
      retryable
      :retrying="isFetching"
      data-cy="customer-form-load-error"
      @retry="refetch"
    />
    <v-card v-else variant="outlined" max-width="640" class="pa-4 pa-sm-6">
      <CustomerForm
        :initial-values="customer"
        :saving="saving"
        :error-message="saveError"
        @submit="save"
        @cancel="cancel"
      />
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useErrorMessage } from '@shared/composables/useErrorMessage';
import { useNotify } from '@shared/composables/useNotify';
import BaseEmptyState from '@shared/ui/components/BaseEmptyState.vue';
import BaseErrorState from '@shared/ui/components/BaseErrorState.vue';
import BaseLoadingState from '@shared/ui/components/BaseLoadingState.vue';
import CustomerForm from '../components/CustomerForm.vue';
import { useCustomerQuery } from '../composables/useCustomerQuery';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '../composables/useCustomerMutations';
import { isNotFoundError } from '../errors';
import type { Customer, CustomerParams } from '../types';

/** Com `id` (rota `CustomerEdit`) edita; sem `id` (rota `CustomerCreate`) cadastra. */
const props = defineProps<{ id?: number }>();

const router = useRouter();
const errorMessage = useErrorMessage();
const notify = useNotify();
const { t } = useI18n();

const isEdit = computed(() => props.id !== undefined);
const {
  data: customer,
  error,
  isPending,
  isFetching,
  refetch,
} = useCustomerQuery(() => props.id ?? null);

const createMutation = useCreateCustomerMutation();
const updateMutation = useUpdateCustomerMutation();

const saving = computed(() => createMutation.isPending.value || updateMutation.isPending.value);
const saveError = computed(() => {
  const failure = createMutation.error.value ?? updateMutation.error.value;
  return failure ? errorMessage(failure) : null;
});

function showDetail({ id }: Customer): void {
  void router.push({ name: 'CustomerDetail', params: { id } });
}

function save(params: CustomerParams): void {
  if (props.id === undefined) {
    createMutation.mutate(params, {
      onSuccess: (customer) => {
        notify.success(t('customers.notify.created', { name: customer.name }));
        showDetail(customer);
      },
    });
  } else {
    updateMutation.mutate(
      { id: props.id, params },
      {
        onSuccess: (customer) => {
          notify.success(t('customers.notify.updated', { name: customer.name }));
          showDetail(customer);
        },
      }
    );
  }
}

function cancel(): void {
  void router.push(
    props.id === undefined
      ? { name: 'Customers' }
      : { name: 'CustomerDetail', params: { id: props.id } }
  );
}
</script>
