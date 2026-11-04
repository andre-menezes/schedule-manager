<template>
  <section class="architecture-page py-6 py-md-8" data-cy="architecture-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('architecture.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="architecture-title">
        {{ $t('architecture.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('architecture.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('architecture.sections.layers.title')"
      :description="$t('architecture.sections.layers.description')"
      icon="layers"
      anchor="camadas"
    >
      <v-row>
        <v-col v-for="layer in layers" :key="layer.name" cols="12" sm="6" md="4">
          <LayerCard :layer="layer" />
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.dependencies.title')"
      :description="$t('architecture.sections.dependencies.description')"
      icon="rule"
      anchor="dependencias"
    >
      <DependencyRulesTable :rules="dependencyRules" />
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.structure.title')"
      :description="$t('architecture.sections.structure.description')"
      icon="folder_open"
      anchor="estrutura"
    >
      <CodeBlock :code="folderStructure" language="text" filename="src/" />
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.init.title')"
      :description="$t('architecture.sections.init.description')"
      icon="rocket_launch-fill"
      anchor="inicializacao"
    >
      <FlowSteps :steps="initFlow" />
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.routes.title')"
      :description="$t('architecture.sections.routes.description')"
      icon="alt_route"
      anchor="rotas"
    >
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ $t('architecture.sections.routes.intro') }}
      </p>
      <ShowcaseCard
        :title="$t('architecture.sections.routes.showcaseTitle')"
        :description="$t('architecture.sections.routes.showcaseDescription')"
        :code="routesExample"
        language="ts"
      >
        <template #preview>
          <v-chip color="secondary" variant="tonal" prepend-icon="dashboard">layout: empty</v-chip>
        </template>
      </ShowcaseCard>
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.http.title')"
      :description="$t('architecture.sections.http.description')"
      icon="api"
      anchor="http"
    >
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ $t('architecture.sections.http.intro') }}
      </p>
      <CodeBlock
        :code="httpExample"
        language="ts"
        filename="modules/customers/api/customer.service.ts"
        class="mb-4"
      />
      <CodeBlock
        :code="queryExample"
        language="ts"
        filename="modules/customers/composables/useCustomersQuery.ts"
      />
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.state.title')"
      :description="$t('architecture.sections.state.description')"
      icon="database"
      anchor="estado"
    >
      <v-table density="comfortable" class="border rounded-lg">
        <thead>
          <tr>
            <th class="text-left font-weight-bold">
              {{ $t('architecture.sections.state.columnStore') }}
            </th>
            <th class="text-left font-weight-bold">
              {{ $t('architecture.sections.state.columnResponsibility') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in stores" :key="store.name">
            <td>
              <v-chip size="small" variant="tonal" color="accent">{{ store.name }}</v-chip>
            </td>
            <td class="text-medium-emphasis">{{ store.responsibility }}</td>
          </tr>
        </tbody>
      </v-table>
    </DocSection>

    <DocSection
      :title="$t('architecture.sections.conventions.title')"
      :description="$t('architecture.sections.conventions.description')"
      icon="checklist"
      anchor="convencoes"
    >
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-subtitle-2 font-weight-bold mb-2">
            {{ $t('architecture.sections.conventions.aliasesTitle') }}
          </p>
          <v-table density="compact" class="border rounded-lg">
            <tbody>
              <tr v-for="alias in aliases" :key="alias.name">
                <td>
                  <code>{{ alias.name }}</code>
                </td>
                <td class="text-medium-emphasis">{{ alias.target }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-subtitle-2 font-weight-bold mb-2">
            {{ $t('architecture.sections.conventions.languageTitle') }}
          </p>
          <v-list density="compact" class="bg-transparent">
            <v-list-item
              v-for="rule in languageRules"
              :key="rule.title"
              :title="rule.title"
              :subtitle="rule.detail"
            >
              <template #prepend>
                <v-icon icon="translate" color="primary" size="small" class="mr-2" />
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </DocSection>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DocSection from '../components/DocSection.vue';
import CodeBlock from '../components/CodeBlock.vue';
import ShowcaseCard from '../components/ShowcaseCard.vue';
import LayerCard from '../components/LayerCard.vue';
import DependencyRulesTable from '../components/DependencyRulesTable.vue';
import FlowSteps from '../components/FlowSteps.vue';
import type { ArchitectureLayer, DependencyRule, FlowStep } from '../types';

const { t } = useI18n();

const layers = computed<ArchitectureLayer[]>(() => [
  {
    name: 'app',
    description: t('architecture.layers.app'),
    icon: 'rocket_launch-fill',
    color: 'primary',
  },
  {
    name: 'modules',
    description: t('architecture.layers.modules'),
    icon: 'dashboard_customize',
    color: 'info',
  },
  {
    name: 'shared',
    description: t('architecture.layers.shared'),
    icon: 'hub',
    color: 'accent',
  },
  {
    name: 'core',
    description: t('architecture.layers.core'),
    icon: 'foundation',
    color: 'error',
  },
  {
    name: 'types',
    description: t('architecture.layers.types'),
    icon: 'data_object',
    color: 'warning',
  },
  {
    name: 'test',
    description: t('architecture.layers.test'),
    icon: 'checklist_rtl',
    color: 'success',
  },
  {
    name: 'e2e',
    description: t('architecture.layers.e2e'),
    icon: 'laptop_windows',
    color: 'secondary',
  },
]);

const dependencyRules = computed<DependencyRule[]>(() => [
  {
    layer: 'app',
    canImport: t('architecture.dependencyRules.canImport.sharedCoreTypes'),
    cannotImport: t('architecture.dependencyRules.cannotImport.modules'),
  },
  {
    layer: 'modules',
    canImport: t('architecture.dependencyRules.canImport.sharedCoreTypes'),
    cannotImport: t('architecture.dependencyRules.cannotImport.appOtherModule'),
  },
  {
    layer: 'shared',
    canImport: t('architecture.dependencyRules.canImport.coreTypes'),
    cannotImport: t('architecture.dependencyRules.cannotImport.appModules'),
  },
  {
    layer: 'core',
    canImport: t('architecture.dependencyRules.canImport.typesOnly'),
    cannotImport: t('architecture.dependencyRules.cannotImport.appModulesShared'),
  },
  {
    layer: 'types',
    canImport: t('architecture.dependencyRules.canImport.none'),
    cannotImport: t('architecture.dependencyRules.cannotImport.any'),
  },
  {
    layer: 'test',
    canImport: t('architecture.dependencyRules.canImport.allSrc'),
    cannotImport: t('architecture.dependencyRules.cannotImport.dash'),
  },
]);

const folderStructure = `src/
├── app/          # bootstrap, providers, rotas base, locales
│   ├── providers/  # Pinia, i18n, Router, Vuetify
│   └── views/      # views globais (404)
├── core/         # base sem UI: config/env
│   └── config/     # constantes e variáveis de ambiente
├── modules/      # features por domínio (cada uma na própria pasta)
│   ├── home/
│   └── customers/    # routes.ts, views/, components/,
│                     # types.ts, api/, composables/
├── shared/       # infraestrutura transversal
│   ├── api/        # instâncias HTTP e services compartilhados
│   ├── composables/
│   ├── helpers/    # efeitos (ex.: downloadAndSave)
│   ├── stores/     # estado global (Pinia)
│   ├── ui/         # layouts, componentes globais, ícones
│   └── utils/      # funções puras
├── test/         # testes unitários e de integração
└── types/        # contratos TypeScript compartilhados`;

const routesExample = `import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/clientes',
    name: 'Clientes',
    component: () => import('./views/ClientesView.vue'),
    meta: { layout: 'empty' },
  },
];

export default routes;`;

const httpExample = `import { httpClient } from '@shared/api/instances';
import type { Customer } from '../types';

export function getCustomersRequest(options: { signal?: AbortSignal } = {}): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers', { signal: options.signal });
}`;

const queryExample = `import { useQuery } from '@tanstack/vue-query';
import { getCustomersRequest } from '../api/customer.service';

export function useCustomersQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => getCustomersRequest({ signal }),
  });
}`;

const initFlow = computed<FlowStep[]>(() => [
  {
    order: 1,
    title: t('architecture.initFlow.step1.title'),
    description: t('architecture.initFlow.step1.description'),
    icon: 'play_arrow',
  },
  {
    order: 2,
    title: t('architecture.initFlow.step2.title'),
    description: t('architecture.initFlow.step2.description'),
    icon: 'extension',
  },
  {
    order: 3,
    title: t('architecture.initFlow.step3.title'),
    description: t('architecture.initFlow.step3.description'),
    icon: 'alt_route',
  },
  {
    order: 4,
    title: t('architecture.initFlow.step4.title'),
    description: t('architecture.initFlow.step4.description'),
    icon: 'check_circle',
  },
]);

const stores = computed(() => [
  { name: 'app.store', responsibility: t('architecture.stores.app') },
  { name: 'notification.store', responsibility: t('architecture.stores.notification') },
]);

const aliases = [
  { name: '@', target: 'src/' },
  { name: '@app', target: 'src/app/' },
  { name: '@core', target: 'src/core/' },
  { name: '@modules', target: 'src/modules/' },
  { name: '@shared', target: 'src/shared/' },
  { name: '@typings', target: 'src/types/' },
  { name: '@test', target: 'src/test/' },
];

const languageRules = computed(() => [
  {
    title: t('architecture.languageRules.docs.title'),
    detail: t('architecture.languageRules.docs.detail'),
  },
  {
    title: t('architecture.languageRules.code.title'),
    detail: t('architecture.languageRules.code.detail'),
  },
  {
    title: t('architecture.languageRules.commits.title'),
    detail: t('architecture.languageRules.commits.detail'),
  },
]);
</script>
