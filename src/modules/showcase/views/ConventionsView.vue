<template>
  <section class="conventions-page py-6 py-md-8" data-cy="conventions-page">
    <div class="mb-8">
      <p class="text-overline text-primary-text font-weight-bold mb-2">
        {{ $t('conventions.eyebrow') }}
      </p>
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2" data-cy="conventions-title">
        {{ $t('conventions.title') }}
      </h1>
      <p class="text-body-1 text-medium-emphasis mb-0" style="max-width: 760px">
        {{ $t('conventions.description') }}
      </p>
    </div>

    <DocSection
      :title="$t('conventions.branches.title')"
      :description="$t('conventions.branches.description')"
      icon="account_tree"
      anchor="branches"
    >
      <v-alert type="error" variant="tonal" class="mb-4">
        {{ $t('conventions.branches.neverDirect') }}
        <v-chip size="small" color="success">main</v-chip> {{ $t('conventions.branches.or') }}
        <v-chip size="small" color="success">develop</v-chip>.
      </v-alert>

      <v-alert type="info" variant="tonal" class="mb-4">
        {{ $t('conventions.branches.createFrom') }}
        <v-chip size="small" color="success">develop</v-chip>
        {{ $t('conventions.branches.updated') }}
        <v-chip size="small" color="success">develop</v-chip>
        {{ $t('conventions.branches.atEnd') }}
      </v-alert>

      <CodeBlock
        :code="branchFlow"
        language="bash"
        :filename="$t('conventions.branches.flowFilename')"
      />

      <p class="text-subtitle-2 font-weight-bold mt-6 mb-2">
        {{ $t('conventions.branches.prefixesTitle') }}
      </p>
      <v-table density="comfortable" class="border rounded-lg">
        <thead>
          <tr>
            <th class="text-left font-weight-bold">
              {{ $t('conventions.branches.columnPrefix') }}
            </th>
            <th class="text-left font-weight-bold">{{ $t('conventions.branches.columnWhen') }}</th>
            <th class="text-left font-weight-bold">
              <v-icon icon="check_circle" color="success" class="mr-2"></v-icon>
              {{ $t('conventions.branches.columnGood') }}
            </th>
            <th class="text-left font-weight-bold">
              <v-icon icon="cancel" color="error" class="mr-2"></v-icon>
              {{ $t('conventions.branches.columnBad') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="branch in branchTypes" :key="branch.prefix">
            <td>
              <v-chip size="small" variant="tonal" color="primary">{{ branch.prefix }}</v-chip>
            </td>
            <td class="text-medium-emphasis">{{ branch.when }}</td>
            <td>
              <code>{{ branch.example }}</code>
            </td>
            <td>
              <code>{{ branch.badExample }}</code>
            </td>
          </tr>
        </tbody>
      </v-table>
    </DocSection>

    <DocSection
      :title="$t('conventions.commitFormat.title')"
      :description="$t('conventions.commitFormat.description')"
      icon="commit"
      anchor="formato"
    >
      <CodeBlock
        :code="commitFormat"
        language="text"
        :filename="$t('conventions.commitFormat.filename')"
      />
    </DocSection>

    <DocSection
      :title="$t('conventions.commitTypes.title')"
      :description="$t('conventions.commitTypes.description')"
      icon="category"
      anchor="tipos"
    >
      <v-table density="comfortable" class="border rounded-lg">
        <thead>
          <tr>
            <th class="text-left font-weight-bold">
              {{ $t('conventions.commitTypes.columnType') }}
            </th>
            <th class="text-left font-weight-bold">
              {{ $t('conventions.commitTypes.columnWhen') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commitType in commitTypes" :key="commitType.type">
            <td>
              <v-chip size="small" variant="tonal" color="primary">{{ commitType.type }}</v-chip>
            </td>
            <td class="text-medium-emphasis">{{ commitType.when }}</td>
          </tr>
        </tbody>
      </v-table>
    </DocSection>

    <DocSection
      :title="$t('conventions.scopes.title')"
      :description="$t('conventions.scopes.description')"
      icon="label"
      anchor="escopos"
    >
      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="scope in commitScopes"
          :key="scope.scope"
          variant="outlined"
          color="secondary-text"
        >
          <span class="font-weight-bold mr-1">{{ scope.scope }}</span>
          <span class="text-medium-emphasis">— {{ scope.usage }}</span>
        </v-chip>
      </div>
    </DocSection>

    <DocSection
      :title="$t('conventions.examples.title')"
      :description="$t('conventions.examples.description')"
      icon="checklist"
      anchor="exemplos"
    >
      <v-row>
        <v-col cols="12" md="6">
          <v-alert
            type="success"
            variant="tonal"
            class="mb-3"
            :title="$t('conventions.examples.goodTitle')"
          />
          <CodeBlock
            :code="goodCommits"
            language="text"
            :filename="$t('conventions.examples.goodFilename')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-alert
            type="error"
            variant="tonal"
            class="mb-3"
            :title="$t('conventions.examples.badTitle')"
          />
          <CodeBlock
            :code="badCommits"
            language="text"
            :filename="$t('conventions.examples.badFilename')"
          />
        </v-col>
      </v-row>
    </DocSection>

    <DocSection
      :title="$t('conventions.review.title')"
      :description="$t('conventions.review.description')"
      icon="rule"
      anchor="review"
    >
      <div class="d-flex ga-4 mb-4">
        <v-chip color="error" variant="tonal" prepend-icon="block">
          {{ $t('conventions.review.blocking') }}
        </v-chip>
        <v-chip color="info" variant="tonal" prepend-icon="lightbulb">
          {{ $t('conventions.review.suggestion') }}
        </v-chip>
      </div>

      <v-expansion-panels variant="accordion" data-cy="review-checklist">
        <v-expansion-panel v-for="category in checklist" :key="category.title">
          <v-expansion-panel-title>
            <v-icon :icon="category.icon" color="primary" class="mr-3" />
            {{ category.title }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list density="comfortable" class="bg-transparent">
              <v-list-item v-for="(item, index) in category.items" :key="index" :title="item.text">
                <template #prepend>
                  <v-icon
                    :icon="item.blocking ? 'block' : 'lightbulb'"
                    :color="item.blocking ? 'error' : 'info'"
                    size="small"
                    class="mr-2"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </DocSection>

    <DocSection
      :title="$t('conventions.principles.title')"
      :description="$t('conventions.principles.description')"
      icon="school"
      anchor="principios"
    >
      <v-row>
        <v-col v-for="principle in principles" :key="principle.name" cols="12" sm="6" md="4">
          <v-card variant="outlined" class="h-100">
            <v-card-item>
              <v-card-title class="text-subtitle-1 font-weight-bold text-primary-text">
                {{ principle.name }}
              </v-card-title>
            </v-card-item>
            <v-card-text class="text-medium-emphasis">{{ principle.description }}</v-card-text>
          </v-card>
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
import type { BranchType, ChecklistCategory, CommitScope, CommitType, Principle } from '../types';

const { t } = useI18n();

const branchFlow = `git checkout develop
git pull
git checkout -b feat/FEAT-012-customer-list
# ...trabalhe e commite...
# ao concluir, faça o push para o remoto e abra o PR para a develop`;

const branchTypes = computed<BranchType[]>(() => [
  {
    prefix: 'feat',
    when: t('conventions.branches.types.feat'),
    example: 'feat/FEAT-012-customer-list',
    badExample: 'feat-cliente',
  },
  {
    prefix: 'fix',
    when: t('conventions.branches.types.fix'),
    example: 'fix/BUG-007-login-redirect',
    badExample: 'fix/login/erro/2',
  },
  {
    prefix: 'refactor',
    when: t('conventions.branches.types.refactor'),
    example: 'refactor/http-interceptors',
    badExample: 'refatorandotudo',
  },
  {
    prefix: 'docs',
    when: t('conventions.branches.types.docs'),
    example: 'docs/contributing-guide',
    badExample: 'atualizando-readme.md',
  },
  {
    prefix: 'chore',
    when: t('conventions.branches.types.chore'),
    example: 'chore/github-actions',
    badExample: 'chore/versao-nova-1.2.3',
  },
]);

const commitFormat = `<tipo>(<escopo>): <descrição curta>

<corpo opcional — explica o porquê da mudança>`;

const commitTypes = computed<CommitType[]>(() => [
  { type: 'feat', when: t('conventions.commitTypes.feat') },
  { type: 'fix', when: t('conventions.commitTypes.fix') },
  { type: 'docs', when: t('conventions.commitTypes.docs') },
  { type: 'refactor', when: t('conventions.commitTypes.refactor') },
  { type: 'test', when: t('conventions.commitTypes.test') },
  { type: 'chore', when: t('conventions.commitTypes.chore') },
  { type: 'style', when: t('conventions.commitTypes.style') },
  { type: 'perf', when: t('conventions.commitTypes.perf') },
  { type: 'ci', when: t('conventions.commitTypes.ci') },
  { type: 'revert', when: t('conventions.commitTypes.revert') },
  { type: 'build', when: t('conventions.commitTypes.build') },
  { type: 'wip', when: t('conventions.commitTypes.wip') },
]);

const commitScopes = computed<CommitScope[]>(() => [
  { scope: 'auth', usage: t('conventions.scopes.auth') },
  { scope: 'http', usage: t('conventions.scopes.http') },
  { scope: 'stores', usage: t('conventions.scopes.stores') },
  { scope: 'ui', usage: t('conventions.scopes.ui') },
  { scope: 'config', usage: t('conventions.scopes.config') },
  { scope: 'router', usage: t('conventions.scopes.router') },
  { scope: 'types', usage: t('conventions.scopes.types') },
  { scope: 'test', usage: t('conventions.scopes.test') },
  { scope: 'deps', usage: t('conventions.scopes.deps') },
]);

const goodCommits = `feat(auth): implementar refresh automático de token
fix(http): corrigir header ausente após refresh
docs(stores): documentar criação de nova store
refactor(ui): extrair lógica de tema para composable
chore(deps): atualizar vuetify para 4.2.0`;

const badCommits = `fix: correções
feat(auth): add token refresh mechanism
tela de login
fix(router): corrigir redirecionamento após login.
feat(home): adicionou card de métricas`;

const checklist = computed<ChecklistCategory[]>(() => [
  {
    title: t('conventions.review.categories.architecture.title'),
    icon: 'account_tree',
    items: [
      { text: t('conventions.review.categories.architecture.items.layer'), blocking: true },
      { text: t('conventions.review.categories.architecture.items.noCrossModule'), blocking: true },
      {
        text: t('conventions.review.categories.architecture.items.sharedIsolation'),
        blocking: true,
      },
      { text: t('conventions.review.categories.architecture.items.envConfig'), blocking: true },
      { text: t('conventions.review.categories.architecture.items.containers'), blocking: false },
    ],
  },
  {
    title: t('conventions.review.categories.typing.title'),
    icon: 'data_object',
    items: [
      { text: t('conventions.review.categories.typing.items.noAny'), blocking: true },
      { text: t('conventions.review.categories.typing.items.typedProps'), blocking: true },
      { text: t('conventions.review.categories.typing.items.centralized'), blocking: true },
      { text: t('conventions.review.categories.typing.items.noPrefix'), blocking: false },
    ],
  },
  {
    title: t('conventions.review.categories.tests.title'),
    icon: 'science',
    items: [
      { text: t('conventions.review.categories.tests.items.unit'), blocking: true },
      { text: t('conventions.review.categories.tests.items.assertions'), blocking: true },
      { text: t('conventions.review.categories.tests.items.pass'), blocking: true },
      { text: t('conventions.review.categories.tests.items.e2e'), blocking: false },
    ],
  },
  {
    title: t('conventions.review.categories.security.title'),
    icon: 'shield',
    items: [
      { text: t('conventions.review.categories.security.items.tokens'), blocking: true },
      { text: t('conventions.review.categories.security.items.sensitive'), blocking: true },
      { text: t('conventions.review.categories.security.items.validation'), blocking: true },
      { text: t('conventions.review.categories.security.items.sanitize'), blocking: false },
    ],
  },
  {
    title: t('conventions.review.categories.style.title'),
    icon: 'style',
    items: [
      { text: t('conventions.review.categories.style.items.lint'), blocking: true },
      { text: t('conventions.review.categories.style.items.build'), blocking: true },
      { text: t('conventions.review.categories.style.items.blockOrder'), blocking: false },
      { text: t('conventions.review.categories.style.items.alias'), blocking: false },
    ],
  },
  {
    title: t('conventions.review.categories.commits.title'),
    icon: 'commit',
    items: [
      { text: t('conventions.review.categories.commits.items.conventions'), blocking: true },
      {
        text: t('conventions.review.categories.commits.items.singleResponsibility'),
        blocking: true,
      },
      { text: t('conventions.review.categories.commits.items.conciseTitle'), blocking: false },
      { text: t('conventions.review.categories.commits.items.atomic'), blocking: false },
    ],
  },
]);

const principles = computed<Principle[]>(() => [
  { name: 'SRP', description: t('conventions.principles.srp') },
  { name: 'DRY', description: t('conventions.principles.dry') },
  { name: 'KISS', description: t('conventions.principles.kiss') },
  { name: 'Separation of Concerns', description: t('conventions.principles.soc') },
  { name: 'Fail Fast', description: t('conventions.principles.failFast') },
]);
</script>
