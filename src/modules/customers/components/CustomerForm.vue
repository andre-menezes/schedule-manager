<template>
  <form novalidate data-cy="customer-form" @submit="onSubmit">
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="errorMessage"
      data-cy="customer-form-error"
    />
    <v-text-field
      v-model="name"
      v-bind="nameProps"
      :label="$t('customers.fields.name')"
      :counter="NAME_MAX_LENGTH"
      autocomplete="name"
      class="mb-2"
      data-cy="customer-name-input"
    />
    <v-text-field
      v-model="email"
      v-bind="emailProps"
      :label="$t('customers.fields.email')"
      type="email"
      autocomplete="email"
      class="mb-2"
      data-cy="customer-email-input"
    />
    <v-text-field
      v-model="phone"
      v-bind="phoneProps"
      :label="$t('customers.fields.phone')"
      :hint="$t('customers.form.optional')"
      persistent-hint
      type="tel"
      autocomplete="tel"
      class="mb-2"
      data-cy="customer-phone-input"
    />
    <v-switch
      v-model="active"
      :label="$t('customers.form.activeLabel')"
      color="primary"
      inset
      data-cy="customer-active-input"
    />
    <div class="d-flex ga-2 justify-end">
      <v-btn
        variant="text"
        :disabled="saving"
        data-cy="customer-cancel-btn"
        @click="emit('cancel')"
      >
        {{ $t('customers.form.cancel') }}
      </v-btn>
      <v-btn type="submit" color="primary" :loading="saving" data-cy="customer-submit-btn">
        {{ $t('customers.form.save') }}
      </v-btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm, type PublicPathState } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { toTypedSchema } from '@shared/utils/form-schema';
import { NAME_MAX_LENGTH, customerFormSchema, toFormValues } from '../schemas';
import type { CustomerParams } from '../types';

const props = defineProps<{
  /** Valores iniciais; ausente no cadastro. */
  initialValues?: CustomerParams;
  saving: boolean;
  /** Erro da última gravação (ex.: e-mail já cadastrado), já traduzido. */
  errorMessage?: string | null;
}>();

const emit = defineEmits<{
  submit: [params: CustomerParams];
  cancel: [];
}>();

const { t } = useI18n();

/**
 * Formulário com VeeValidate + Zod (ADR-0042): o schema valida e transforma
 * os valores; o VeeValidate guarda o estado de cada campo. A cópia local
 * garante que editar não altera o objeto recebido por prop.
 */
const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(customerFormSchema),
  initialValues: toFormValues(props.initialValues),
});

/**
 * Liga um campo ao `v-text-field`: as mensagens do schema são chaves de
 * i18n, traduzidas aqui. O erro só aparece depois que o campo perde o foco
 * ou o formulário é enviado.
 */
const vuetifyField = (state: PublicPathState) => ({
  'error-messages': state.errors.map((key) => t(key)),
});
const fieldOptions = { props: vuetifyField, validateOnModelUpdate: false };

const [name, nameProps] = defineField('name', fieldOptions);
const [email, emailProps] = defineField('email', fieldOptions);
const [phone, phoneProps] = defineField('phone', fieldOptions);
const [active] = defineField('active');

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>
