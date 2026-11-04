<template>
  <section class="onboarding-page py-6 py-md-8" data-cy="onboarding-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('onboarding.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="onboarding-title">
        {{ $t('onboarding.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('onboarding.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('onboarding.setup.title')"
      :description="$t('onboarding.setup.description')"
      icon="terminal"
      anchor="setup"
    >
      <v-row>
        <v-col cols="12" md="6">
          <CodeBlock
            :code="setupClone"
            language="bash"
            :filename="$t('onboarding.setup.cloneFilename')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <CodeBlock
            :code="setupInstall"
            language="bash"
            :filename="$t('onboarding.setup.installFilename')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <CodeBlock
            :code="setupDev"
            language="bash"
            :filename="$t('onboarding.setup.devFilename')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <CodeBlock
            :code="setupTest"
            language="bash"
            :filename="$t('onboarding.setup.testFilename')"
          />
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('onboarding.canonical.title')"
      :description="$t('onboarding.canonical.description')"
      icon="group"
      anchor="canonical-example"
    >
      <p class="text-body-2 font-weight-medium mb-2">{{ $t('onboarding.canonical.filesLabel') }}</p>
      <CodeBlock :code="canonicalTree" language="text" filename="src/modules/customers/" />
      <v-btn
        v-if="hasCustomers"
        :to="{ name: 'Customers' }"
        color="primary"
        variant="tonal"
        prepend-icon="open_in_new"
        class="mt-4"
        data-cy="onboarding-canonical-link"
      >
        {{ $t('onboarding.canonical.open') }}
      </v-btn>
    </DocSection>

    <v-stepper
      v-model="currentStep"
      class="onboarding-stepper mb-10"
      flat
      alt-labels
      data-cy="onboarding-stepper"
    >
      <v-stepper-header>
        <template v-for="(step, index) in steps" :key="step.title">
          <v-stepper-item
            :title="step.title"
            :value="index + 1"
            :complete="currentStep > index + 1"
            complete-icon=""
            edit-icon=""
            editable
            class="font-weight-medium"
            color="primary"
          />
          <v-divider v-if="index < steps.length - 1" />
        </template>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item v-for="(step, index) in steps" :key="step.title" :value="index + 1">
          <div class="pa-2" :data-cy="`onboarding-step-${index + 1}`">
            <div class="d-flex align-center ga-2 mb-1">
              <v-chip size="small" color="primary" variant="tonal">
                {{
                  $t('onboarding.stepper.stepLabel', { current: index + 1, total: steps.length })
                }}
              </v-chip>
              <v-chip v-if="step.reference" size="x-small" variant="text" color="secondary-text">
                {{ step.reference }}
              </v-chip>
            </div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ step.title }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ step.description }}</p>
            <CodeBlock :code="step.code" :language="step.language" :filename="step.filename" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        :disabled="stepperDisabled"
        @click:prev="currentStep--"
        @click:next="currentStep++"
      />
    </v-stepper>

    <DocSection
      :title="$t('onboarding.checklistSection.title')"
      :description="$t('onboarding.checklistSection.description')"
      icon="checklist"
      anchor="checklist"
    >
      <v-list class="bg-transparent" data-cy="onboarding-checklist">
        <v-list-item v-for="item in checklist" :key="item" class="px-0">
          <template #prepend>
            <v-icon icon="check_circle" color="success" class="mr-2" />
          </template>
          <v-list-item-title class="text-body-2 text-wrap">{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </DocSection>

    <DocSection
      :title="$t('onboarding.faqSection.title')"
      :description="$t('onboarding.faqSection.description')"
      icon="help"
      anchor="faq"
    >
      <v-expansion-panels variant="accordion" data-cy="onboarding-faq">
        <v-expansion-panel
          v-for="faq in faqs"
          :key="faq.question"
          :color="$vuetify.theme.current.dark ? 'surface-variant' : 'light-grey'"
        >
          <template #title>
            <span :class="$vuetify.theme.current.dark ? 'text-white' : ''">{{ faq.question }}</span>
          </template>
          <template #text>{{ faq.answer }}</template>
        </v-expansion-panel>
      </v-expansion-panels>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import DocSection from '../components/DocSection.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { buildOnboardingSteps, buildOnboardingChecklist, buildOnboardingFaqs } from '../steps';

const { t } = useI18n();

const setupClone = `git clone https://github.com/andre-menezes/vue-template.git seu-projeto
cd seu-projeto`;

const setupInstall = 'pnpm install';

const setupDev = `pnpm dev
# acesse http://localhost:9081`;

const setupTest = `pnpm test           # testes unitários
pnpm test:e2e       # testes end-to-end
pnpm lint           # verificação de estilo`;

// O exemplo vive no módulo `customers`; o link é resolvido pelo nome da rota
// para não importar outro módulo, e some se o módulo for removido.
const hasCustomers = useRouter().hasRoute('Customers');

const canonicalTree = `types.ts                  # contrato da API
api/customer.service.ts   # um endpoint por função
composables/              # queries, mutations e chaves de cache
list-query.ts             # página e busca na URL
views/                    # lista, detalhe e formulário (containers)
components/               # tabela, formulário, detalhe e diálogo
locales/                  # pt-BR.json e en-US.json`;

const currentStep = ref(1);

const steps = computed(() => buildOnboardingSteps(t));
const checklist = computed(() => buildOnboardingChecklist(t));
const faqs = computed(() => buildOnboardingFaqs(t));

const stepperDisabled = computed<boolean | 'next' | 'prev'>(() => {
  if (currentStep.value === 1) return 'prev';
  if (currentStep.value === steps.value.length) return 'next';
  return false;
});
</script>
